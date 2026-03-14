@echo off
cd /d c:\Users\akc24\career-counselling-portal
echo Stopping and removing volumes...
call docker compose down -v > docker_down.txt 2>&1
echo Starting containers...
call docker compose up -d > docker_up.txt 2>&1
echo Done.
