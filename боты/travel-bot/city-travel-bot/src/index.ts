import { config, validateConfig } from './config/config.js';
import { travelBot } from './bot/bot.js';
import { supabaseService } from './services/supabase.service.js';

async function main() {
  console.log('🚀 Starting City Travel Bot...\n');

  try {
    // Валидация конфигурации
    validateConfig();
    console.log('✅ Configuration validated');

    // Инициализация Supabase (основное хранилище)
    console.log('📊 Connecting to Supabase...');
    const supabaseConnected = await supabaseService.testConnection();

    if (supabaseConnected) {
      console.log('✅ Supabase connected successfully');
      console.log('📋 Database tables ready: users, favorites, events_cache\n');
    } else {
      console.warn('⚠️ Supabase not available. Bot will use in-memory storage.');
      console.warn('   Check SUPABASE_URL and SUPABASE_ANON_KEY in .env file\n');
    }

    // Запуск бота
    travelBot.launch();

    console.log('\n✅ City Travel Bot is running!');
    console.log(`📊 Environment: ${config.app.env}`);
    console.log(`💎 Premium price: ${config.pricing.premium}₽/month`);
    console.log(`🆓 Free tier: ${config.limits.freeCities} cities, ${config.limits.freeRequestsPerDay} requests/day\n`);

  } catch (error) {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  }
}

main();
