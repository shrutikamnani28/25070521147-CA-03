@echo off
echo ========================================================
echo        Starting Velvet Vapors Luxury Perfume Shop
echo ========================================================
echo.

:: Start Backend Server
echo [1/2] Starting Node.js Express Backend on port 5001...
start "Velvet Vapors Backend" cmd /k "cd /d %~dp0server && npm start"

:: Wait 2 seconds
timeout /t 2 /nobreak >nul

:: Start Frontend Client
echo [2/2] Starting React Vite Frontend...
start "Velvet Vapors Frontend" cmd /k "cd /d %~dp0client && npm run dev"

echo.
echo ========================================================
echo App launched!
echo Backend:  http://localhost:5001
echo Frontend: http://localhost:5174 (or next available port)
echo ========================================================
pause
