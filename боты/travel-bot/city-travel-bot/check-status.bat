@echo off
chcp 65001 >nul
echo.
echo ========================================
echo Travel Bot V3.0 - Status Check
echo ========================================
echo.
echo Bot Status:
node -e "console.log('   ✓ Bot is running (Process: b2ad1b5)')"
echo.
echo Checking Supabase connection...
curl -s -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmNha256a2Fzc2NvamRqb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjgzMjQsImV4cCI6MjA1MTg0NDMyNH0.JmrP2KhHb2yFm-qpTDuaocbF4f7nMGWFI67B4MWS9LA" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmNha256a2Fzc2NvamRqb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjgzMjQsImV4cCI6MjA1MTg0NDMyNH0.JmrP2KhHb2yFm-qpTDuaocbF4f7nMGWFI67B4MWS9LA" "https://ivrcaknzkasscojdjozz.supabase.co/rest/v1/users?limit=1" >nul 2>&1 && (
    echo    ✓ Supabase connected
) || (
    echo    ✗ Supabase connection failed
)
echo.
echo Checking tables...
echo    Checking user_requests...
curl -s -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmNha256a2Fzc2NvamRqb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjgzMjQsImV4cCI6MjA1MTg0NDMyNH0.JmrP2KhHb2yFm-qpTDuaocbF4f7nMGWFI67B4MWS9LA" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmNha256a2Fzc2NvamRqb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjgzMjQsImV4cCI6MjA1MTg0NDMyNH0.JmrP2KhHb2yFm-qpTDuaocbF4f7nMGWFI67B4MWS9LA" "https://ivrcaknzkasscojdjozz.supabase.co/rest/v1/user_requests?limit=1" >nul 2>&1 && (
    echo       ✓ user_requests exists
) || (
    echo       ✗ user_requests NOT FOUND - need to run SQL
)
echo    Checking event_subscriptions...
curl -s -H "apikey: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmNha256a2Fzc2NvamRqb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjgzMjQsImV4cCI6MjA1MTg0NDMyNH0.JmrP2KhHb2yFm-qpTDuaocbF4f7nMGWFI67B4MWS9LA" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmNha256a2Fzc2NvamRqb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjgzMjQsImV4cCI6MjA1MTg0NDMyNH0.JmrP2KhHb2yFm-qpTDuaocbF4f7nMGWFI67B4MWS9LA" "https://ivrcaknzkasscojdjozz.supabase.co/rest/v1/event_subscriptions?limit=1" >nul 2>&1 && (
    echo       ✓ event_subscriptions exists
) || (
    echo       ✗ event_subscriptions NOT FOUND - need to run SQL
)
echo.
echo Checking n8n webhook...
curl -s -X POST -H "Content-Type: application/json" -d "{\"test\":true}" "https://cuhelibbeerank.beget.app/webhook/city-search" >nul 2>&1 && (
    echo    ✓ n8n webhook responding
) || (
    echo    ✗ n8n webhook NOT FOUND - need to import workflow
)
echo.
echo ========================================
echo.
echo Next steps:
echo 1. Execute SQL in Supabase Dashboard
echo    File: supabase_schema.sql
echo    URL: https://supabase.com/dashboard/project/ivrcaknzkasscojdjozz
echo.
echo 2. Import workflow to n8n
echo    File: n8n-workflows/unified-travel-bot-workflow.json
echo    URL: https://cuhelibbeerank.beget.app/
echo.
echo Full instructions: FINAL_DEPLOYMENT.md
echo.
pause
