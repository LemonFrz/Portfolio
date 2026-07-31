@echo off
echo.
echo ========================================
echo   LEMON1G STUDIO - Deploy to GitHub
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Staging all changes...
git add .

echo.
set /p msg="Enter commit message (or press Enter for 'update'): "
if "%msg%"=="" set msg=update

echo.
echo [2/3] Committing: %msg%
git commit -m "%msg%"

echo.
echo [3/3] Pushing to GitHub...
git push origin main
git push origin main:master --force

echo.
echo ========================================
echo   Done! Site is live on GitHub Pages.
echo ========================================
echo.
pause
