#!/usr/bin/env bash
# =============================================================================
# scripts/backup-tenants.sh — نسخ احتياطي مستقل لكل Schema
# =============================================================================
#
# يأخذ نسخة pg_dump لكل Schema في قاعدة بيانات متين بشكل مستقل
# بحيث يمكن استعادة بيانات مؤسسة واحدة دون المساس بالباقي.
#
# الاستخدام:
#   chmod +x scripts/backup-tenants.sh
#   ./scripts/backup-tenants.sh                         ← نسخ كل المؤسسات
#   ./scripts/backup-tenants.sh --schema school_42      ← نسخ مؤسسة واحدة فقط
#   ./scripts/backup-tenants.sh --dry-run               ← عرض بدون تنفيذ
#
# المتغيرات البيئية المطلوبة:
#   DATABASE_URL أو MATIN_DATABASE_URL
#   BACKUP_DIR (اختياري، افتراضي: ./backups/tenants)
#   BACKUP_RETENTION_DAYS (اختياري، افتراضي: 30 يوم)
#
# يُنشئ ملفات بصيغة:
#   {BACKUP_DIR}/YYYY-MM-DD/{schema_name}.dump
# =============================================================================

set -euo pipefail

# ── المتغيرات ────────────────────────────────────────────────────
DB_URL="${MATIN_DATABASE_URL:-${DATABASE_URL:-}}"
BACKUP_DIR="${BACKUP_DIR:-./backups/tenants}"
RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
DATE=$(date +%Y-%m-%d)
TARGET_SCHEMA=""
DRY_RUN=false

# ── تحليل المعاملات ──────────────────────────────────────────────
while [[ $# -gt 0 ]]; do
  case "$1" in
    --schema)
      TARGET_SCHEMA="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    *)
      echo "خيار غير معروف: $1"
      exit 1
      ;;
  esac
done

# ── التحقق من المتطلبات ──────────────────────────────────────────
if [[ -z "$DB_URL" ]]; then
  echo "❌ خطأ: DATABASE_URL غير محدد في البيئة"
  exit 1
fi

if ! command -v pg_dump &>/dev/null; then
  echo "❌ خطأ: pg_dump غير مثبت. ثبّت postgresql-client"
  exit 1
fi

if ! command -v psql &>/dev/null; then
  echo "❌ خطأ: psql غير مثبت"
  exit 1
fi

# ── إنشاء مجلد النسخ ────────────────────────────────────────────
TODAY_DIR="${BACKUP_DIR}/${DATE}"
if [[ "$DRY_RUN" == false ]]; then
  mkdir -p "$TODAY_DIR"
fi

echo ""
echo "🗄️  Matin — Tenant Backup"
echo "══════════════════════════════════════"
echo "📅 التاريخ: $DATE"
echo "📁 المسار:  $TODAY_DIR"
[[ "$DRY_RUN" == true ]] && echo "⚠️  وضع التجربة (Dry Run)"
echo ""

# ── جلب قائمة Schemas ───────────────────────────────────────────
if [[ -n "$TARGET_SCHEMA" ]]; then
  SCHEMAS=("$TARGET_SCHEMA")
else
  mapfile -t SCHEMAS < <(
    psql "$DB_URL" -t -A -c \
      "SELECT schema_name FROM tenants WHERE status IN ('active','suspended','offboarding') ORDER BY id"
  )
fi

if [[ ${#SCHEMAS[@]} -eq 0 ]]; then
  echo "⚠️  لا توجد مؤسسات مسجلة للنسخ الاحتياطي"
  exit 0
fi

echo "📋 عدد المؤسسات: ${#SCHEMAS[@]}"
echo ""

SUCCESS=0
FAIL=0
FAIL_LIST=()

# ── النسخ الاحتياطي لكل Schema ──────────────────────────────────
for SCHEMA in "${SCHEMAS[@]}"; do
  # تخطي القيم الفارغة
  [[ -z "${SCHEMA// }" ]] && continue

  OUTPUT_FILE="${TODAY_DIR}/${SCHEMA}.dump"
  printf "  ▶  %-30s … " "$SCHEMA"

  if [[ "$DRY_RUN" == true ]]; then
    echo "SKIP (dry-run)"
    ((SUCCESS++)) || true
    continue
  fi

  if pg_dump \
      --dbname="$DB_URL" \
      --schema="$SCHEMA" \
      --format=custom \
      --compress=9 \
      --no-acl \
      --no-owner \
      --file="$OUTPUT_FILE" \
      2>/tmp/pg_dump_err; then

    SIZE=$(du -sh "$OUTPUT_FILE" 2>/dev/null | cut -f1 || echo "?")
    echo "✓  ($SIZE)"
    ((SUCCESS++)) || true
  else
    ERR=$(cat /tmp/pg_dump_err | head -1)
    echo "✗  $ERR"
    FAIL_LIST+=("$SCHEMA: $ERR")
    ((FAIL++)) || true
  fi
done

# ── حذف النسخ القديمة ───────────────────────────────────────────
if [[ "$DRY_RUN" == false && "$RETENTION_DAYS" -gt 0 ]]; then
  echo ""
  echo "🗑️  حذف النسخ الأقدم من ${RETENTION_DAYS} يوم…"
  find "$BACKUP_DIR" -maxdepth 1 -type d -mtime "+${RETENTION_DAYS}" \
    -exec echo "  حذف: {}" \; \
    -exec rm -rf {} \; 2>/dev/null || true
fi

# ── ملخص التقرير ────────────────────────────────────────────────
echo ""
echo "══════════════════════════════════════"
echo "✅ نجح: $SUCCESS   ❌ فشل: $FAIL"

if [[ ${#FAIL_LIST[@]} -gt 0 ]]; then
  echo ""
  echo "المؤسسات التي فشلت:"
  for ITEM in "${FAIL_LIST[@]}"; do
    echo "  • $ITEM"
  done
  exit 1
fi

echo ""
echo "🎉 اكتمل النسخ الاحتياطي بنجاح"
echo "   المسار: $TODAY_DIR"
echo ""
