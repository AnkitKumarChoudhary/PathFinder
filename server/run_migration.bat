@echo off
cd /d c:\Users\akc24\career-counselling-portal\server
timeout /t 5 >nul
echo Running prisma migrate...
call npx prisma migrate dev --name initial_schema > migrate_log.txt 2>&1
echo Running prisma db seed...
call npx prisma db seed > seed_log.txt 2>&1
echo All done.
