import { config, validateConfig } from './config/config.js';
import { testConnection } from './database/db.js';
import { travelBot } from './bot/bot.js';

async function main() {
  console.log('🚀 Starting City Travel Bot...\n');

  try {
    // Валидация конфигурации
    validateConfig();
    console.log('✅ Configuration validated');

    // Тест подключения к БД
    const dbConnected = await testConnection();

    if (!dbConnected) {
      console.warn('⚠️ Database connection failed. Bot will start without DB features.');
      console.warn('   To enable database features:');
      console.warn('   1. Install PostgreSQL');
      console.warn('   2. Create database: createdb city_travel_bot');
      console.warn('   3. Run migrations: npm run db:migrate');
      console.warn('   4. Set DATABASE_URL in .env file\n');
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
