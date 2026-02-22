@echo off
echo ===================================================
echo   Authentic Web Project - Startup Script
echo ===================================================
echo.

echo 1. Checking MongoDB...
sc query MongoDB >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] MongoDB service not found. Make sure MongoDB is installed.
) else (
    echo [OK] MongoDB service found.
)

echo.
echo 2. Starting Backend Server...
start "Authentic Backend (Port 5000)" cmd /k "cd /d "%~dp0server" && npm start"

echo.
echo 3. Starting Frontend Client...
start "Authentic Frontend" cmd /k "cd /d "%~dp0client" && npm run dev"

echo.
echo ===================================================
echo   Success! 
echo   - Backend is running on port 5000
echo   - Frontend is running on port 5173
echo.
echo   Opening website in your browser...
echo ===================================================

timeout /t 5
start http://localhost:5173

pause
