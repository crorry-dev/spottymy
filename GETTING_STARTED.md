# Getting Started with Spottymy

## Prerequisites Setup

Before you begin, make sure you have:

1. **Python 3.8 or higher** - [Download Python](https://www.python.org/downloads/)
2. **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
3. **A Spotify Account** - [Sign up for Spotify](https://www.spotify.com/)

## Step 1: Clone the Repository

```bash
git clone https://github.com/crorry-dev/spottymy.git
cd spottymy
```

## Step 2: Set Up Spotify API

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app details:
   - **App Name**: Spottymy (or any name you like)
   - **App Description**: Party playlist application
   - Accept the terms and create
5. Copy your **Client ID** and **Client Secret**
6. Click "Edit Settings"
7. Add to **Redirect URIs**: `http://localhost:5000/callback`
8. Click "Save"

## Step 3: Configure Backend

1. Navigate to the backend folder:
   ```bash
   cd backend
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and add your Spotify credentials:
   ```env
   SPOTIFY_CLIENT_ID=your_client_id_here
   SPOTIFY_CLIENT_SECRET=your_client_secret_here
   SPOTIFY_REDIRECT_URI=http://localhost:5000/callback
   SECRET_KEY=any_random_string_here
   FRONTEND_URL=http://localhost:3000
   ```

## Step 4: Start the Application

### Option A: Use Startup Scripts (Recommended)

**On Linux/Mac:**
```bash
./start.sh
```

**On Windows:**
```batch
start.bat
```

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Step 5: Access the Application

Open your browser and go to:
- **Main App**: http://localhost:3000
- **Backend API**: http://localhost:5000

## Using the App

### Hosting a Party

1. Click **"Host a Party"**
2. Enter your name
3. You'll get a **party code** and **QR code**
4. Open the **Projector View** on your TV/projector
5. Share the QR code or party code with guests

### Joining a Party

1. Click **"Join a Party"**
2. Enter the party code (or scan QR code)
3. Enter your name
4. Start adding and voting on songs!

### Mobile View Features

- **Queue Tab**: View and vote on upcoming songs
- **Add Songs Tab**: Search Spotify and add songs to queue

### Projector View Features

- Full-screen display perfect for parties
- Shows currently playing song with animations
- Displays queue with vote counts
- Real-time updates as guests add songs

## Troubleshooting

### "Party not found" error
- Make sure the backend server is running
- Check that you entered the correct party code

### Songs not searching
- Verify your Spotify API credentials in `.env`
- Make sure you've added the redirect URI in Spotify Developer Dashboard

### Port already in use
- Backend uses port 5000, Frontend uses port 3000
- Stop any other applications using these ports

### Can't connect to backend
- Check that both backend and frontend are running
- Verify the backend URL in `vite.config.js` matches your setup

## Tips for the Best Experience

1. **Use on a local network**: All devices should be on the same network
2. **Large display**: The projector view looks best on TVs or projectors
3. **Mobile devices**: Guests access the mobile view on their phones
4. **Keep backend running**: Don't close the terminal running the backend

## Next Steps

- Customize the theme colors in `frontend/src/styles/index.css`
- Add your own animations in the projector view
- Deploy to a server for wider access
- Contribute improvements back to the project!

## Need Help?

Open an issue on GitHub: https://github.com/crorry-dev/spottymy/issues

---

Enjoy your party! 🎉🎵
