from flask import Flask, request, jsonify, session
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room
import os
import secrets
import qrcode
import io
import base64
from datetime import datetime, timedelta
import spotipy
from spotipy.oauth2 import SpotifyOAuth

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', secrets.token_hex(32))
CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

# Store party sessions in memory (use Redis in production)
party_sessions = {}

# Spotify OAuth configuration
SPOTIFY_CLIENT_ID = os.environ.get('SPOTIFY_CLIENT_ID')
SPOTIFY_CLIENT_SECRET = os.environ.get('SPOTIFY_CLIENT_SECRET')
SPOTIFY_REDIRECT_URI = os.environ.get('SPOTIFY_REDIRECT_URI', 'http://localhost:5000/callback')

def get_spotify_oauth():
    return SpotifyOAuth(
        client_id=SPOTIFY_CLIENT_ID,
        client_secret=SPOTIFY_CLIENT_SECRET,
        redirect_uri=SPOTIFY_REDIRECT_URI,
        scope='user-read-playback-state user-modify-playback-state user-read-currently-playing playlist-read-private'
    )

@app.route('/api/auth/login')
def spotify_login():
    """Initiate Spotify OAuth flow"""
    sp_oauth = get_spotify_oauth()
    auth_url = sp_oauth.get_authorize_url()
    return jsonify({'auth_url': auth_url})

@app.route('/callback')
def spotify_callback():
    """Handle Spotify OAuth callback"""
    sp_oauth = get_spotify_oauth()
    code = request.args.get('code')
    
    if code:
        token_info = sp_oauth.get_access_token(code)
        session['token_info'] = token_info
        return jsonify({'success': True, 'token': token_info})
    
    return jsonify({'error': 'No code provided'}), 400

@app.route('/api/party/create', methods=['POST'])
def create_party():
    """Create a new party session"""
    data = request.json
    party_code = secrets.token_hex(4).upper()
    
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    party_url = f"{os.environ.get('FRONTEND_URL', 'http://localhost:3000')}/join/{party_code}"
    qr.add_data(party_url)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    qr_code_base64 = base64.b64encode(buffer.getvalue()).decode()
    
    party_sessions[party_code] = {
        'code': party_code,
        'host': data.get('host_name', 'Anonymous'),
        'created_at': datetime.now().isoformat(),
        'queue': [],
        'current_song': None,
        'members': [],
        'qr_code': qr_code_base64
    }
    
    return jsonify({
        'party_code': party_code,
        'party_url': party_url,
        'qr_code': qr_code_base64
    })

@app.route('/api/party/<party_code>')
def get_party(party_code):
    """Get party session details"""
    party = party_sessions.get(party_code)
    if not party:
        return jsonify({'error': 'Party not found'}), 404
    
    return jsonify(party)

@app.route('/api/party/<party_code>/join', methods=['POST'])
def join_party(party_code):
    """Join a party session"""
    party = party_sessions.get(party_code)
    if not party:
        return jsonify({'error': 'Party not found'}), 404
    
    data = request.json
    user_name = data.get('user_name', 'Anonymous')
    
    member = {
        'name': user_name,
        'joined_at': datetime.now().isoformat()
    }
    party['members'].append(member)
    
    # Emit update to all clients in the party
    socketio.emit('party_updated', party, room=party_code)
    
    return jsonify({'success': True, 'party': party})

@app.route('/api/party/<party_code>/queue/add', methods=['POST'])
def add_to_queue(party_code):
    """Add a song to the party queue"""
    party = party_sessions.get(party_code)
    if not party:
        return jsonify({'error': 'Party not found'}), 404
    
    data = request.json
    song = {
        'id': data.get('id'),
        'name': data.get('name'),
        'artist': data.get('artist'),
        'album': data.get('album'),
        'duration_ms': data.get('duration_ms'),
        'uri': data.get('uri'),
        'image_url': data.get('image_url'),
        'added_by': data.get('added_by', 'Anonymous'),
        'votes': 0,
        'voters': [],
        'added_at': datetime.now().isoformat()
    }
    
    party['queue'].append(song)
    
    # Sort queue by votes
    party['queue'].sort(key=lambda x: x['votes'], reverse=True)
    
    # Emit update to all clients in the party
    socketio.emit('queue_updated', party['queue'], room=party_code)
    
    return jsonify({'success': True, 'queue': party['queue']})

@app.route('/api/party/<party_code>/queue/<int:song_index>/vote', methods=['POST'])
def vote_song(party_code, song_index):
    """Vote on a song in the queue"""
    party = party_sessions.get(party_code)
    if not party:
        return jsonify({'error': 'Party not found'}), 404
    
    if song_index >= len(party['queue']):
        return jsonify({'error': 'Song not found'}), 404
    
    data = request.json
    voter = data.get('voter', 'Anonymous')
    vote_type = data.get('vote')  # 'up' or 'down'
    
    song = party['queue'][song_index]
    
    # Remove previous vote if exists
    if voter in song['voters']:
        song['voters'].remove(voter)
        song['votes'] -= 1 if vote_type == 'down' else -1
    
    # Add new vote
    if vote_type == 'up':
        song['votes'] += 1
        song['voters'].append(voter)
    elif vote_type == 'down':
        song['votes'] -= 1
        song['voters'].append(voter)
    
    # Sort queue by votes
    party['queue'].sort(key=lambda x: x['votes'], reverse=True)
    
    # Emit update to all clients in the party
    socketio.emit('queue_updated', party['queue'], room=party_code)
    
    return jsonify({'success': True, 'queue': party['queue']})

@app.route('/api/search')
def search_songs():
    """Search for songs on Spotify"""
    query = request.args.get('q')
    if not query:
        return jsonify({'error': 'Query parameter required'}), 400
    
    token_info = session.get('token_info')
    if not token_info:
        return jsonify({'error': 'Not authenticated'}), 401
    
    sp = spotipy.Spotify(auth=token_info['access_token'])
    results = sp.search(q=query, type='track', limit=20)
    
    tracks = []
    for item in results['tracks']['items']:
        tracks.append({
            'id': item['id'],
            'name': item['name'],
            'artist': ', '.join([artist['name'] for artist in item['artists']]),
            'album': item['album']['name'],
            'duration_ms': item['duration_ms'],
            'uri': item['uri'],
            'image_url': item['album']['images'][0]['url'] if item['album']['images'] else None
        })
    
    return jsonify({'tracks': tracks})

# WebSocket events
@socketio.on('join')
def on_join(data):
    """Client joins a party room"""
    party_code = data.get('party_code')
    join_room(party_code)
    emit('joined', {'party_code': party_code})

@socketio.on('leave')
def on_leave(data):
    """Client leaves a party room"""
    party_code = data.get('party_code')
    leave_room(party_code)
    emit('left', {'party_code': party_code})

@socketio.on('update_playback')
def on_update_playback(data):
    """Update current playback status"""
    party_code = data.get('party_code')
    current_song = data.get('current_song')
    
    party = party_sessions.get(party_code)
    if party:
        party['current_song'] = current_song
        emit('playback_updated', current_song, room=party_code)

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
