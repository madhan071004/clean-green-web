@echo off
title Clean-Green Core Launch
echo --------------------------------------------------
echo 🚀 Launching Clean-Green Web (MERN + AUTH)
echo --------------------------------------------------

:: Backend Boot
echo 🍃 Booting Server (Auth, Database, Mail)...
start "Clean-Green Backend" cmd /c "cd server && npm start"

:: Frontend Boot
echo 🎨 Booting Frontend (React, Leaflet, Motion)...
start "Clean-Green Frontend" cmd /c "cd client && npm run dev -- --port 3000 --open"

echo.
echo ✅ Dashboard is initializing at http://localhost:3000
echo ✅ Ensure MongoDB is running in the background.
echo --------------------------------------------------
pause
