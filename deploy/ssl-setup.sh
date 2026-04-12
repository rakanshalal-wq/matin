#!/usr/bin/env bash
# =============================================================================
# deploy/ssl-setup.sh — إصدار شهادة SSL Wildcard بـ Let's Encrypt (Certbot)
#
# تدعم: matin.ink  و  *.matin.ink
#
# ════════════════════════════════════════════════════════════════════════════
# المتطلبات قبل التشغيل:
#   1. السيرفر لديه Ubuntu 20.04 / 22.04
#   2. تملك صلاحيات root أو sudo
#   3. الدومين مُشار إلى IP السيرفر في DNS (A record)
#   4. المنفذ 80 و 443 مفتوح في الـ Firewall
#
# الفرق بين Wildcard و الشهادة العادية:
#   - الشهادة العادية تغطي: matin.ink فقط
#   - Wildcard تغطي:       matin.ink + *.matin.ink (أي عدد من Subdomains)
#   - Wildcard تحتاج تحقق DNS (نضيف سجل TXT في Cloudflare / نيم شيب)
#
# خطوات التشغيل:
#   chmod +x deploy/ssl-setup.sh
#   sudo ./deploy/ssl-setup.sh
# =============================================================================

set -euo pipefail

# ── 0. إعدادات — عدّل هذه القيم ────────────────────────────────────────────
DOMAIN="matin.ink"          # الدومين الرئيسي
EMAIL="admin@matin.ink"     # إيميل للتنبيهات (انتهاء صلاحية الشهادة)

# ════════════════════════════════════════════════════════════════════════════

echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  SSL Wildcard Setup — منصة متين                         ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""

# ── 1. تثبيت Certbot ────────────────────────────────────────────────────────
echo "═══════════════════════════════════"
echo "الخطوة 1: تثبيت Certbot"
echo "═══════════════════════════════════"

if ! command -v certbot &>/dev/null; then
    echo "→ تحديث قائمة الحزم..."
    apt-get update -qq

    echo "→ تثبيت certbot..."
    apt-get install -y certbot python3-certbot-nginx
    echo "✅ تم تثبيت Certbot"
else
    echo "✅ Certbot مثبّت بالفعل: $(certbot --version 2>&1)"
fi

# ── 2. إصدار الشهادة ────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════"
echo "الخطوة 2: إصدار شهادة Wildcard"
echo "═══════════════════════════════════"
echo ""
echo "⚠️  سيطلب منك Certbot إضافة سجل DNS من نوع TXT"
echo "    اسمه:   _acme-challenge.${DOMAIN}"
echo "    قيمته:  (ستظهر في الشاشة — انسخها وأضفها في Cloudflare أو لوحة DNS)"
echo ""
echo "    بعد الإضافة في Cloudflare:"
echo "    → افتح DNS > Add record"
echo "    → Type: TXT"
echo "    → Name: _acme-challenge"
echo "    → Content: (القيمة التي ستظهر)"
echo "    → TTL: Auto"
echo "    → انتظر 30-60 ثانية ثم اضغط Enter للمتابعة"
echo ""
read -rp "اضغط Enter للبدء..."

certbot certonly \
    --manual \
    --preferred-challenges dns \
    -d "${DOMAIN}" \
    -d "*.${DOMAIN}" \
    --email "${EMAIL}" \
    --agree-tos \
    --no-eff-email \
    --server https://acme-v02.api.letsencrypt.org/directory

echo ""
echo "✅ تم إصدار الشهادة بنجاح!"
echo "   الشهادة في: /etc/letsencrypt/live/${DOMAIN}/"

# ── 3. نسخ إعدادات Nginx ────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════"
echo "الخطوة 3: نسخ إعدادات Nginx"
echo "═══════════════════════════════════"

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
NGINX_CONF="${SCRIPT_DIR}/nginx.conf"

if [[ -f "$NGINX_CONF" ]]; then
    # استبدال matin.ink بالدومين الفعلي إذا كان مختلفاً
    sed "s/matin\.ink/${DOMAIN}/g" "$NGINX_CONF" > /tmp/matin_nginx.conf

    cp /tmp/matin_nginx.conf /etc/nginx/sites-available/matin

    # تفعيل الموقع
    ln -sf /etc/nginx/sites-available/matin /etc/nginx/sites-enabled/matin

    # إزالة الموقع الافتراضي
    rm -f /etc/nginx/sites-enabled/default

    echo "→ التحقق من إعدادات Nginx..."
    nginx -t

    echo "→ إعادة تشغيل Nginx..."
    systemctl reload nginx

    echo "✅ تم تفعيل Nginx"
else
    echo "⚠️  ملف nginx.conf غير موجود في ${NGINX_CONF}"
    echo "   يمكنك نسخه يدوياً:"
    echo "   sudo cp deploy/nginx.conf /etc/nginx/sites-available/matin"
fi

# ── 4. التجديد التلقائي ─────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════"
echo "الخطوة 4: التجديد التلقائي (Cron)"
echo "═══════════════════════════════════"

# فحص إذا كان الـ cron موجود
CRON_LINE="0 3 * * * certbot renew --quiet --post-hook 'systemctl reload nginx'"
if ! crontab -l 2>/dev/null | grep -qF "certbot renew"; then
    (crontab -l 2>/dev/null; echo "${CRON_LINE}") | crontab -
    echo "✅ تم إضافة تجديد تلقائي (كل يوم الساعة 3 صباحاً)"
else
    echo "✅ التجديد التلقائي موجود بالفعل"
fi

# ── 5. ملخص DNS المطلوب ─────────────────────────────────────────────────────
echo ""
echo "╔══════════════════════════════════════════════════════════╗"
echo "║  ملخص سجلات DNS المطلوبة في Cloudflare                 ║"
echo "╚══════════════════════════════════════════════════════════╝"
echo ""
echo "  Type   Name               Value                   Proxy"
echo "  ────   ────               ─────                   ─────"
echo "  A      ${DOMAIN}        YOUR_SERVER_IP          ✓ Proxied"
echo "  A      *.${DOMAIN}      YOUR_SERVER_IP          ✓ Proxied"
echo ""
echo "  ملاحظة: في Cloudflare، Wildcard subdomain يحتاج خطة Pro"
echo "          إذا كانت خطتك Free، أضف كل subdomain يدوياً:"
echo "          A   school1   YOUR_SERVER_IP   ✓ Proxied"
echo "          A   school2   YOUR_SERVER_IP   ✓ Proxied"
echo ""
echo "  بديل مجاني: استخدم Nginx مع SSL بدون Cloudflare Proxy:"
echo "          A   ${DOMAIN}    YOUR_SERVER_IP  (DNS only)"
echo "          A   *.${DOMAIN}  YOUR_SERVER_IP  (DNS only)"
echo ""
echo "🎉 اكتمل الإعداد!"
echo "   افتح https://${DOMAIN} في المتصفح للتأكد"
echo ""
