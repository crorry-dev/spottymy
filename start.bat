@echo off
REM Spottymy Startup Script for Windows
REM This script starts both the backend and frontend servers

echo 🎉 Starting Spottymy Party Playlist App...

REM Check if .env exists in backend
if not exist backend\.env (
    echo ⚠️  Warning: backend\.env file not found!
    echo Please copy backend\.env.example to backend\.env and configure your Spotify credentials.
    exit /b 1
)

REM Start backend
echo 🔧 Starting backend server...
cd backend
if not exist venv (
    echo Creating virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing Python dependencies...
pip install -r requirements.txt >nul
start /B python app.py
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak >nul

REM Start frontend
echo 🎨 Starting frontend server...
cd frontend
if not exist node_modules (
    echo Installing npm dependencies...
    call npm install
)
start /B npm run dev
cd ..

echo.
echo ✅ Spottymy is running!
echo 📱 Mobile/Web: http://localhost:3000
echo 🔧 Backend API: http://localhost:5000
echo.
echo Press Ctrl+C to stop all servers
echo.

pause
