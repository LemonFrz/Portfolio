@echo off
cd /d "%~dp0"
echo ========================================
echo   LEMON1G STUDIO - Local Server
echo ========================================
echo.
echo Opening http://localhost:8000 in your browser...
start http://localhost:8000
echo.
echo Serving website. Press Ctrl+C to stop.
echo.
python -m http.server 8000
pause
