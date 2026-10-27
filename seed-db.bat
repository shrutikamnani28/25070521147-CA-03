@echo off
echo ========================================================
echo        Seeding Database for Velvet Vapors
echo ========================================================
echo.
echo Make sure your local MongoDB server is running!
echo.
cd /d %~dp0server
node seed.js
echo.
echo ========================================================
echo Seeding complete!
echo ========================================================
pause
