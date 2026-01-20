import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pool } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function migrate() {
  console.log('🔄 Running database migrations...\n');

  try {
    const schemaPath = join(__dirname, 'schema.sql');
    const schemaSql = readFileSync(schemaPath, 'utf-8');

    await pool.query(schemaSql);

    console.log('✅ Database migrations completed successfully!\n');
    console.log('Tables created:');
    console.log('  - users');
    console.log('  - search_history');
    console.log('  - payments');
    console.log('  - favorites\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
