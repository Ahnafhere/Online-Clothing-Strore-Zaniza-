@echo off
echo ========================================
echo   ZANIZA - AUTO PUSH TO GITHUB
echo ========================================

echo.
echo Staging changes...
git add .

echo.
set /p msg="Enter your commit message (or press enter for 'Daily Sync'): "
if "%msg%"=="" set msg=Daily Sync

echo.
echo Committing changes...
git commit -m "%msg%"

echo.
echo Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   SYNC COMPLETE!
echo ========================================
pause
