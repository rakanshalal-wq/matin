#!/usr/bin/env ts-node
/**
 * scripts/migrate-tenants.ts
 *
 * يُطبّق migration SQL على كل Schemas المؤسسات الموجودة دفعةً واحدة.
 *
 * الاستخدام:
 *   npm run migrate:tenants                         ← يطبق الـ migration الافتراضي
 *   npm run migrate:tenants -- --sql "ALTER TABLE students ADD COLUMN IF NOT EXISTS photo TEXT"
 *   npm run migrate:tenants -- --file scripts/my-migration.sql
 *   npm run migrate:tenants -- --dry-run             ← يعرض فقط بدون تنفيذ
 *
 * يُخرج تقريراً لكل Schema: ✓ نجح / ✗ فشل (مع السبب)
 */

import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── تحليل المعاملات ─────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const sqlIndex = args.indexOf('--sql');
const fileIndex = args.indexOf('--file');

let migrationSQL = '';

if (sqlIndex !== -1 && args[sqlIndex + 1]) {
  migrationSQL = args[sqlIndex + 1];
} else if (fileIndex !== -1 && args[fileIndex + 1]) {
  const filePath = resolve(process.cwd(), args[fileIndex + 1]);
  migrationSQL = readFileSync(filePath, 'utf-8');
} else {
  // المسار الافتراضي: آخر migration
  const defaultFile = resolve(process.cwd(), 'scripts/migration_tenant_schema.sql');
  try {
    migrationSQL = readFileSync(defaultFile, 'utf-8');
  } catch {
    console.error('❌ لم يُحدد SQL ولم يوجد ملف migration افتراضي');
    process.exit(1);
  }
}

// ── الاتصال بقاعدة البيانات ──────────────────────────────────────
const DB_URL = process.env.MATIN_DATABASE_URL || process.env.DATABASE_URL || '';
if (!DB_URL) {
  console.error('❌ المتغير DATABASE_URL غير محدد في البيئة');
  process.exit(1);
}

const pool = new Pool({
  connectionString: DB_URL,
  ssl: DB_URL.includes('localhost') || DB_URL.includes('127.0.0.1')
    ? false
    : { rejectUnauthorized: false },
});

interface SchemaRow {
  schema_name: string;
  school_id: string;
  status: string;
}

async function run(): Promise<void> {
  console.log('\n🔄 Matin — Tenant Migrations');
  console.log('═'.repeat(50));
  if (dryRun) console.log('⚠️  وضع التجربة (Dry Run) — لن يُطبَّق أي تغيير\n');

  // جلب كل Schemas النشطة
  const { rows: schemas } = await pool.query<SchemaRow>(
    `SELECT schema_name, school_id::text, status
     FROM tenants
     WHERE status IN ('active', 'suspended')
     ORDER BY id`
  );

  if (schemas.length === 0) {
    console.log('⚠️  لا توجد مؤسسات مسجلة في جدول tenants');
    await pool.end();
    return;
  }

  console.log(`📋 عدد المؤسسات: ${schemas.length}\n`);

  let successCount = 0;
  let failCount = 0;
  const failures: { schema: string; error: string }[] = [];

  for (const { schema_name, school_id, status } of schemas) {
    process.stdout.write(`  ${status === 'suspended' ? '⏸' : '▶'}  ${schema_name} (school ${school_id}) … `);

    if (dryRun) {
      console.log('SKIP (dry-run)');
      successCount++;
      continue;
    }

    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      // ضبط search_path لهذا الـ Schema
      await client.query(`SET LOCAL search_path = "${schema_name}", public`);
      await client.query(migrationSQL);
      await client.query('COMMIT');
      console.log('✓');
      successCount++;
    } catch (err: unknown) {
      await client.query('ROLLBACK').catch(() => {});
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`✗ ${msg}`);
      failures.push({ schema: schema_name, error: msg });
      failCount++;
    } finally {
      client.release();
    }
  }

  // ── ملخص التقرير ───────────────────────────────────────────────
  console.log('\n' + '═'.repeat(50));
  console.log(`✅ نجح: ${successCount}  ❌ فشل: ${failCount}`);

  if (failures.length > 0) {
    console.log('\nالمؤسسات التي فشلت:');
    for (const f of failures) {
      console.log(`  • ${f.schema}: ${f.error}`);
    }
    await pool.end();
    process.exit(1);
  }

  await pool.end();
  console.log('\n🎉 اكتمل التحديث بنجاح\n');
}

run().catch((err) => {
  console.error('❌ خطأ غير متوقع:', err);
  process.exit(1);
});
