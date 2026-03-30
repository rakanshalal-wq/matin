const { Pool } = require('pg');
const fs = require('fs');

// قراءة DATABASE_URL من .env يدوياً
const envFile = fs.readFileSync('/var/www/matin/matin-new/.env', 'utf8');
const match = envFile.match(/^DATABASE_URL\s*=\s*["']?(.+?)["']?\s*$/m);
if (!match) { console.error('DATABASE_URL not found in .env'); process.exit(1); }
const connectionString = match[1];

const pool = new Pool({ connectionString });
pool.query(`
  CREATE TABLE IF NOT EXISTS landing_content (
    section VARCHAR(50) PRIMARY KEY DEFAULT 'main',
    content JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
  )
`).then(() => pool.query(`
  INSERT INTO landing_content (section, content)
  VALUES ('main', '{}') ON CONFLICT DO NOTHING
`)).then(() => { console.log('Done!'); process.exit(0); })
.catch(e => { console.error(e.message); process.exit(1); });
