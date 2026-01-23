# Travel Bot V3.0 - Supabase Setup Script (PowerShell)
# Автоматически создает необходимые таблицы через REST API

Write-Host "🚀 Настройка Supabase для Travel Bot V3.0" -ForegroundColor Green
Write-Host ""

$SUPABASE_URL = "https://ivrcaknzkasscojdjozz.supabase.co"
$SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml2cmNha256a2Fzc2NvamRqb3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNjgzMjQsImV4cCI6MjA1MTg0NDMyNH0.JmrP2KhHb2yFm-qpTDuaocbF4f7nMGWFI67B4MWS9LA"

Write-Host "📊 Supabase URL: $SUPABASE_URL" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  ВАЖНО: Этот скрипт не может выполнить SQL напрямую через REST API" -ForegroundColor Yellow
Write-Host "Supabase требует выполнения DDL команд через Dashboard" -ForegroundColor Yellow
Write-Host ""

# Проверка подключения к Supabase
Write-Host "🔍 Проверка подключения к Supabase..." -ForegroundColor Cyan

try {
    $headers = @{
        "apikey" = $SUPABASE_ANON_KEY
        "Authorization" = "Bearer $SUPABASE_ANON_KEY"
    }

    $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/" -Headers $headers -Method Get -ErrorAction Stop
    Write-Host "✅ Supabase доступен" -ForegroundColor Green
} catch {
    Write-Host "❌ Ошибка подключения к Supabase: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Проверка существующих таблиц
Write-Host "📋 Проверка существующих таблиц..." -ForegroundColor Cyan

$tables = @("users", "favorites", "events_cache", "user_requests", "event_subscriptions")
$existingTables = @()
$missingTables = @()

foreach ($table in $tables) {
    try {
        $response = Invoke-RestMethod -Uri "$SUPABASE_URL/rest/v1/$table?limit=1" -Headers $headers -Method Get -ErrorAction Stop
        Write-Host "   ✅ $table" -ForegroundColor Green
        $existingTables += $table
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
            Write-Host "   ❌ $table - НЕ СОЗДАНА" -ForegroundColor Red
            $missingTables += $table
        } else {
            Write-Host "   ⚠️  $table - ошибка проверки" -ForegroundColor Yellow
        }
    }
}

Write-Host ""

if ($missingTables.Count -eq 0) {
    Write-Host "🎉 Все таблицы уже созданы!" -ForegroundColor Green
    Write-Host ""
    Write-Host "✅ База данных готова к работе" -ForegroundColor Green
    Write-Host "Следующий шаг: Импортировать workflow в n8n" -ForegroundColor Cyan
    exit 0
}

# Инструкции по созданию таблиц
Write-Host "📝 Необходимо создать следующие таблицы:" -ForegroundColor Yellow
foreach ($table in $missingTables) {
    Write-Host "   • $table" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 ИНСТРУКЦИЯ ПО СОЗДАНИЮ ТАБЛИЦ:" -ForegroundColor Green
Write-Host ""
Write-Host "Шаг 1: Открыть Supabase Dashboard" -ForegroundColor Cyan
Write-Host "   URL: https://supabase.com/dashboard/project/ivrcaknzkasscojdjozz" -ForegroundColor White
Write-Host ""
Write-Host "Шаг 2: Перейти в SQL Editor" -ForegroundColor Cyan
Write-Host "   Левое меню → SQL Editor → New Query" -ForegroundColor White
Write-Host ""
Write-Host "Шаг 3: Скопировать содержимое файла" -ForegroundColor Cyan
Write-Host "   Файл: supabase_schema.sql" -ForegroundColor White
Write-Host "   Путь: $PSScriptRoot\supabase_schema.sql" -ForegroundColor Gray
Write-Host ""
Write-Host "Шаг 4: Вставить в SQL Editor и нажать RUN" -ForegroundColor Cyan
Write-Host "   Или нажать Ctrl+Enter" -ForegroundColor White
Write-Host ""
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""

# Показать содержимое SQL файла
$sqlFile = Join-Path $PSScriptRoot "supabase_schema.sql"

if (Test-Path $sqlFile) {
    Write-Host "📄 Предпросмотр SQL (первые 30 строк):" -ForegroundColor Cyan
    Write-Host ""
    Get-Content $sqlFile -Head 30 | ForEach-Object {
        Write-Host "   $_" -ForegroundColor Gray
    }
    Write-Host "   ..." -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Полный файл: $sqlFile" -ForegroundColor Cyan
} else {
    Write-Host "⚠️  Файл supabase_schema.sql не найден" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═" * 80 -ForegroundColor Cyan
Write-Host ""
Write-Host "🔄 После выполнения SQL запустите этот скрипт снова для проверки" -ForegroundColor Green
Write-Host "   .\setup-supabase.ps1" -ForegroundColor White
Write-Host ""

# Опция: Открыть браузер
Write-Host "Открыть Supabase Dashboard в браузере? (Y/N): " -ForegroundColor Yellow -NoNewline
$answer = Read-Host

if ($answer -eq "Y" -or $answer -eq "y") {
    Start-Process "https://supabase.com/dashboard/project/ivrcaknzkasscojdjozz"
    Write-Host "✅ Браузер открыт" -ForegroundColor Green
}

Write-Host ""
Write-Host "📚 Подробная инструкция: FINAL_DEPLOYMENT.md" -ForegroundColor Cyan
Write-Host ""
