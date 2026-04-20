@echo off
title Clean-Green [FRONTEND]
echo --------------------------------------------------
echo 🎨 Launching React Frontend (Vite)...
echo --------------------------------------------------
cd client
npm run dev -- --port 3000 --open
pause
