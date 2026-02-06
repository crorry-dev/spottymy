# 🎉 Spottymy - Party Playlist App

A collaborative party playlist application where guests can add songs, vote on the queue, and watch it all come alive on a projector display. Built with Python Flask backend and React frontend with beautiful animations.

## ✨ Features

- **🎵 Spotify Integration**: Connect your Spotify account to control playback
- **📱 Mobile-First Interface**: Guests use their phones to interact with the playlist
- **📺 Projector Mode**: Beautiful full-screen display perfect for parties
- **🗳️ Democratic Queue**: Up/down voting system for songs
- **🔄 Real-time Updates**: WebSocket-powered live synchronization
- **📲 QR Code Join**: Easy party access via QR code scanning
- **🎨 Stunning Animations**: Smooth, party-appropriate UI with Framer Motion

## 🚀 Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- Spotify Developer Account

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure your Spotify API credentials in `.env`:
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Copy your Client ID and Client Secret
   - Add `http://localhost:5000/callback` to Redirect URIs

5. Start the backend server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

### Quick Start (Alternative)

For convenience, you can use the provided startup scripts to run both backend and frontend simultaneously:

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```batch
start.bat
```

These scripts will automatically:
- Check for required configuration files
- Set up virtual environments
- Install dependencies
- Start both servers

## 📖 Usage

### Hosting a Party

1. Open `http://localhost:3000` in your browser
2. Click "Host a Party"
3. Enter your name
4. You'll get a party code and QR code
5. Open the **Projector View** on your display/TV
6. Share the QR code or party code with guests

### Joining a Party

1. Open `http://localhost:3000/join` on your phone
2. Enter the party code OR scan the QR code
3. Enter your name
4. Start adding and voting on songs!

### Using the App

**Mobile View:**
- **Queue Tab**: View upcoming songs, vote up/down on tracks
- **Add Songs Tab**: Search for songs and add them to the queue

**Projector View:**
- Shows currently playing song with album art
- Displays upcoming queue with vote counts
- Shows party statistics (guests, songs)
- QR code for easy joining

## 🏗️ Architecture

```
spottymy/
├── backend/
│   ├── app.py              # Flask application with API endpoints
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx           # Landing page
    │   │   ├── CreateParty.jsx    # Party creation
    │   │   ├── JoinParty.jsx      # Join party flow
    │   │   ├── MobileView.jsx     # Mobile interface
    │   │   └── ProjectorView.jsx  # Projector display
    │   ├── styles/
    │   │   └── index.css          # Global styles
    │   ├── App.jsx                # Main app component
    │   └── main.jsx               # Entry point
    ├── package.json
    └── vite.config.js
```

## 🔌 API Endpoints

### Party Management
- `POST /api/party/create` - Create a new party
- `GET /api/party/<code>` - Get party details
- `POST /api/party/<code>/join` - Join a party

### Queue Management
- `POST /api/party/<code>/queue/add` - Add song to queue
- `POST /api/party/<code>/queue/<index>/vote` - Vote on a song

### Spotify Integration
- `GET /api/auth/login` - Initiate Spotify OAuth
- `GET /callback` - OAuth callback
- `GET /api/search?q=<query>` - Search for songs

### WebSocket Events
- `join` - Join party room
- `leave` - Leave party room
- `queue_updated` - Queue changed
- `playback_updated` - Current song changed
- `party_updated` - Party state changed

## 🎨 Tech Stack

**Backend:**
- Flask - Web framework
- Flask-SocketIO - WebSocket support
- Spotipy - Spotify API wrapper
- QRCode - QR code generation

**Frontend:**
- React - UI framework
- Vite - Build tool
- Framer Motion - Animations
- Socket.IO Client - Real-time communication
- React Router - Navigation
- Axios - HTTP client

## 🔐 Environment Variables

### Backend (.env)

```env
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
SECRET_KEY=your_secret_key
FRONTEND_URL=http://localhost:3000
```

## 🎯 Future Enhancements

- [ ] Persistent storage (Redis/Database)
- [ ] User authentication
- [ ] Playlist history
- [ ] Song suggestions based on party mood
- [ ] Multiple theme options
- [ ] Mobile app (React Native)
- [ ] Advanced voting algorithms
- [ ] Song skip functionality
- [ ] Party analytics

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Spotify Web API for music integration
- Framer Motion for amazing animations
- The open-source community

## 💬 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Made with ❤️ for party people everywhere! 🎊