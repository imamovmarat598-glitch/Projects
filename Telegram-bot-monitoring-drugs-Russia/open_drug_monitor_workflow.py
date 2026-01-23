#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Открывает Drug Monitor workflow в браузере для исправления timeout настроек
"""
import sys
import io
import time
import webbrowser

if sys.platform == 'win32':
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

N8N_URL = 'https://cuhelibbeerank.beget.app'
WORKFLOW_ID = 'cQeB8MAZTXagmbBx'  # ULTRA-FAST 15 Sources

print('=' * 70)
print('ИСПРАВЛЕНИЕ DRUG MONITOR WORKFLOW')
print('=' * 70)
print()
print('🔍 Найдено 4 проблемы с настройками timeout:')
print()
print('1. ❌ Merge node: timeout = 3000ms')
print('   ✅ Должно быть: 30000ms (30 секунд)')
print()
print('2. ❌ AI node (OpenAI): timeout = 10000ms')
print('   ✅ Должно быть: 60000ms (60 секунд)')
print()
print('3. ❌ AI node (OpenAI): maxTokens = 2000')
print('   ✅ Должно быть: 1500')
print()
print('4. ❌ Telegram node: timeout = 3000ms')
print('   ✅ Должно быть: 30000ms (30 секунд)')
print()
print('=' * 70)
print('ЧТО ДЕЛАТЬ В БРАУЗЕРЕ:')
print('=' * 70)
print()
print('Откроется workflow с 3 узлами: Trigger → Merge → AI → Telegram')
print()
print('ШАГИ:')
print()
print('1. MERGE NODE (средний узел):')
print('   - Кликните на узел "Merge"')
print('   - Откройте вкладку "Settings" (Настройки)')
print('   - Найдите "Timeout" и измените с 3000 на 30000')
print()
print('2. AI NODE (OpenAI):')
print('   - Кликните на узел с AI/OpenAI')
print('   - Settings → Timeout: измените с 10000 на 60000')
print('   - Parameters → Options → Max Tokens: измените с 2000 на 1500')
print()
print('3. TELEGRAM NODE:')
print('   - Кликните на узел Telegram')
print('   - Settings → Timeout: измените с 3000 на 30000')
print()
print('4. СОХРАНЕНИЕ:')
print('   - Нажмите "Save" в правом верхнем углу')
print()
print('=' * 70)
print()
print('Открываю браузер через 3 секунды...')
print()

time.sleep(3)

# Открываем браузер
url = f'{N8N_URL}/workflow/{WORKFLOW_ID}'
webbrowser.open(url)

print('✅ Браузер открыт!')
print()
print('Если нужно войти:')
print('  Email: Imamovmarat598@gmail.com')
print('  Пароль: M@maiko17081988!')
print()
print('После обновления workflow будет работать стабильно!')
print()
print('=' * 70)
print('СПРАВКА:')
print('=' * 70)
print()
print('Почему нужно увеличить timeout:')
print('- RSS фиды могут загружаться медленно (15 источников)')
print('- OpenAI API может обрабатывать запросы до 30+ секунд')
print('- Telegram может отправлять сообщения с задержкой')
print()
print('Почему уменьшить maxTokens:')
print('- 2000 токенов = слишком длинные сообщения')
print('- 1500 токенов = оптимально для краткой сводки')
print('- Экономия на API запросах к OpenAI')
print()
