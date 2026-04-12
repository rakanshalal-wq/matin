-- ═══════════════════════════════════════════════════════════════════
-- Migration v6 – Integrations: إضافة الأعمدة الناقصة + البيانات الأولية
-- تشغيل مرة واحدة فقط على قاعدة البيانات
-- ═══════════════════════════════════════════════════════════════════

-- ─── 1. إضافة الأعمدة الناقصة لجدول integrations ─────────────────

ALTER TABLE integrations
  ADD COLUMN IF NOT EXISTS display_name   VARCHAR(200),
  ADD COLUMN IF NOT EXISTS description    TEXT         DEFAULT '',
  ADD COLUMN IF NOT EXISTS category       VARCHAR(50)  DEFAULT 'other',
  ADD COLUMN IF NOT EXISTS icon           VARCHAR(20)  DEFAULT '🔗',
  ADD COLUMN IF NOT EXISTS color          VARCHAR(20)  DEFAULT '#6B7280',
  ADD COLUMN IF NOT EXISTS docs_url       TEXT         DEFAULT '',
  ADD COLUMN IF NOT EXISTS extra_config   JSONB        DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS api_key        TEXT,
  ADD COLUMN IF NOT EXISTS api_secret     TEXT,
  ADD COLUMN IF NOT EXISTS webhook_secret TEXT,
  ADD COLUMN IF NOT EXISTS test_mode      BOOLEAN      DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS connected_at   TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at     TIMESTAMPTZ  DEFAULT NOW();

-- تحديث display_name من name حيث هو فارغ
UPDATE integrations SET display_name = name WHERE display_name IS NULL;

-- ─── 2. تعديل جدول school_integrations: إضافة عمود provider ──────
-- هذا يحل عدم التوافق مع LEFT JOIN في /api/integrations

ALTER TABLE school_integrations
  ADD COLUMN IF NOT EXISTS provider VARCHAR(100);

-- مزامنة provider من integration_type للسجلات الحالية
UPDATE school_integrations SET provider = integration_type WHERE provider IS NULL;

-- فهرس لتسريع البحث
CREATE INDEX IF NOT EXISTS idx_school_integrations_provider
  ON school_integrations(school_id, provider);

-- ─── 3. بيانات التكاملات الافتراضية ───────────────────────────────
-- INSERT … ON CONFLICT لضمان الأمان عند إعادة التشغيل

INSERT INTO integrations (id, name, type, display_name, description, category, icon, color, config, is_active, docs_url, test_mode, updated_at)
VALUES

-- ── الدفع ──────────────────────────────────────────────────────────
(1,  'moyasar',      'payment',      'Moyasar موياسر',         'بوابة دفع سعودية تدعم مدى، فيزا، ماستركارد وApple Pay',
 'payment', '💳', '#2563EB',
 '{"fields":[
   {"key":"publishable_key","label":"Publishable Key","type":"text","required":true,"secret":false},
   {"key":"secret_key","label":"Secret Key","type":"password","required":true,"secret":true}
 ]}',
 false, 'https://moyasar.com/docs', false, NOW()),

(2,  'tamara',       'payment',      'تمارا Tamara',           'اشتري الآن وادفع لاحقاً - BNPL سعودي',
 'payment', '🛒', '#059669',
 '{"fields":[
   {"key":"api_token","label":"API Token","type":"password","required":true,"secret":true},
   {"key":"merchant_url","label":"Merchant URL","type":"text","required":false,"secret":false}
 ]}',
 false, 'https://docs.tamara.co', false, NOW()),

(3,  'tabby',        'payment',      'تابي Tabby',             'تقسيط بدون فوائد',
 'payment', '💰', '#7C3AED',
 '{"fields":[
   {"key":"public_key","label":"Public Key","type":"text","required":true,"secret":false},
   {"key":"secret_key","label":"Secret Key","type":"password","required":true,"secret":true},
   {"key":"merchant_code","label":"Merchant Code","type":"text","required":true,"secret":false}
 ]}',
 false, 'https://docs.tabby.ai', false, NOW()),

(4,  'telr',         'payment',      'تلر Telr',               'بوابة دفع إلكتروني متعددة العملات',
 'payment', '💳', '#DC2626',
 '{"fields":[
   {"key":"store_id","label":"Store ID","type":"text","required":true,"secret":false},
   {"key":"auth_key","label":"Auth Key","type":"password","required":true,"secret":true}
 ]}',
 false, 'https://telr.com/support', false, NOW()),

-- ── الاتصالات ──────────────────────────────────────────────────────
(5,  'whatsapp',     'communication','واتساب Business',         'إرسال رسائل وإشعارات عبر WhatsApp Business API',
 'communication', '💬', '#25D366',
 '{"fields":[
   {"key":"access_token","label":"Access Token","type":"password","required":true,"secret":true},
   {"key":"phone_number_id","label":"Phone Number ID","type":"text","required":true,"secret":false},
   {"key":"business_account_id","label":"Business Account ID","type":"text","required":false,"secret":false}
 ]}',
 false, 'https://developers.facebook.com/docs/whatsapp', false, NOW()),

(6,  'resend',       'communication','Resend البريد الإلكتروني','إرسال بريد إلكتروني transactional عالي الجودة',
 'communication', '📧', '#EF4444',
 '{"fields":[
   {"key":"api_key","label":"API Key","type":"password","required":true,"secret":true},
   {"key":"from_email","label":"From Email","type":"text","required":true,"secret":false},
   {"key":"from_name","label":"From Name","type":"text","required":false,"secret":false}
 ]}',
 false, 'https://resend.com/docs', false, NOW()),

(7,  'twilio',       'communication','Twilio SMS',              'إرسال رسائل SMS عالمياً',
 'communication', '📱', '#F59E0B',
 '{"fields":[
   {"key":"account_sid","label":"Account SID","type":"text","required":true,"secret":false},
   {"key":"auth_token","label":"Auth Token","type":"password","required":true,"secret":true},
   {"key":"from_number","label":"From Number","type":"text","required":true,"secret":false}
 ]}',
 false, 'https://www.twilio.com/docs', false, NOW()),

-- ── الإشعارات ──────────────────────────────────────────────────────
(8,  'firebase',     'notification', 'Firebase FCM',            'إشعارات Push للتطبيقات على iOS وAndroid',
 'notification', '🔔', '#FBBF24',
 '{"fields":[
   {"key":"server_key","label":"Server Key (Legacy)","type":"password","required":false,"secret":true},
   {"key":"project_id","label":"Project ID","type":"text","required":true,"secret":false},
   {"key":"service_account_json","label":"Service Account JSON","type":"textarea","required":false,"secret":true}
 ]}',
 false, 'https://firebase.google.com/docs/cloud-messaging', false, NOW()),

-- ── الشحن ──────────────────────────────────────────────────────────
(9,  'aramex',       'shipping',     'أرامكس Aramex',           'خدمات الشحن المحلي والدولي عبر أرامكس',
 'shipping', '📦', '#FF6B00',
 '{"fields":[
   {"key":"username","label":"Username","type":"text","required":true,"secret":false},
   {"key":"password","label":"Password","type":"password","required":true,"secret":true},
   {"key":"account_number","label":"Account Number","type":"text","required":true,"secret":false},
   {"key":"account_pin","label":"Account PIN","type":"password","required":true,"secret":true},
   {"key":"account_entity","label":"Account Entity","type":"text","required":false,"secret":false},
   {"key":"account_country_code","label":"Country Code","type":"text","required":false,"secret":false}
 ]}',
 false, 'https://www.aramex.com/us/en/developers', false, NOW()),

(10, 'smsa',         'shipping',     'SMSA Express',            'شركة SMSA للشحن السريع داخل المملكة',
 'shipping', '🚚', '#1D4ED8',
 '{"fields":[
   {"key":"pass_key","label":"Pass Key","type":"password","required":true,"secret":true},
   {"key":"sender_id","label":"Sender ID","type":"text","required":true,"secret":false}
 ]}',
 false, 'https://www.smsaexpress.com', false, NOW()),

(11, 'dhl',          'shipping',     'DHL Express',             'الشحن الدولي السريع عبر DHL',
 'shipping', '✈️', '#FFCC00',
 '{"fields":[
   {"key":"api_key","label":"API Key","type":"text","required":true,"secret":false},
   {"key":"api_secret","label":"API Secret","type":"password","required":true,"secret":true},
   {"key":"account_number","label":"Account Number","type":"text","required":false,"secret":false}
 ]}',
 false, 'https://developer.dhl.com', false, NOW()),

(12, 'fedex',        'shipping',     'FedEx',                   'خدمات الشحن الدولي عبر FedEx',
 'shipping', '📫', '#4D148C',
 '{"fields":[
   {"key":"api_key","label":"API Key","type":"text","required":true,"secret":false},
   {"key":"api_secret","label":"API Secret","type":"password","required":true,"secret":true},
   {"key":"account_number","label":"Account Number","type":"text","required":true,"secret":false}
 ]}',
 false, 'https://developer.fedex.com', false, NOW()),

-- ── الخرائط ────────────────────────────────────────────────────────
(13, 'google_maps',  'maps',         'Google Maps',             'خرائط وتتبع الموقع الجغرافي',
 'maps', '🗺️', '#34A853',
 '{"fields":[
   {"key":"api_key","label":"API Key","type":"text","required":true,"secret":false}
 ]}',
 false, 'https://developers.google.com/maps', false, NOW()),

-- ── التحليلات ──────────────────────────────────────────────────────
(14, 'google_analytics','analytics', 'Google Analytics',        'تتبع وتحليل زيارات المنصة',
 'analytics', '📊', '#E37400',
 '{"fields":[
   {"key":"measurement_id","label":"Measurement ID (G-XXXXXXXX)","type":"text","required":true,"secret":false},
   {"key":"api_secret","label":"API Secret","type":"password","required":false,"secret":true}
 ]}',
 false, 'https://developers.google.com/analytics', false, NOW()),

-- ── الحكومية ───────────────────────────────────────────────────────
(15, 'nafath',       'government',   'نفاذ Nafath',             'التحقق من الهوية الوطنية عبر نفاذ',
 'government', '🪪', '#006B3C',
 '{"fields":[
   {"key":"client_id","label":"Client ID","type":"text","required":true,"secret":false},
   {"key":"client_secret","label":"Client Secret","type":"password","required":true,"secret":true},
   {"key":"environment","label":"البيئة","type":"select","required":true,"secret":false,"options":["sandbox","production"]}
 ]}',
 false, 'https://nafath.sa', false, NOW()),

(16, 'absher',       'government',   'أبشر Absher',             'التكامل مع منصة أبشر للخدمات الحكومية',
 'government', '🏛️', '#1B5E20',
 '{"fields":[
   {"key":"api_key","label":"API Key","type":"text","required":true,"secret":false},
   {"key":"api_secret","label":"API Secret","type":"password","required":true,"secret":true}
 ]}',
 false, 'https://www.absher.sa', false, NOW()),

-- ── التخزين ────────────────────────────────────────────────────────
(17, 'aws_s3',       'storage',      'AWS S3 Storage',          'تخزين الملفات والوسائط على Amazon S3',
 'storage', '☁️', '#FF9900',
 '{"fields":[
   {"key":"access_key_id","label":"Access Key ID","type":"text","required":true,"secret":false},
   {"key":"secret_access_key","label":"Secret Access Key","type":"password","required":true,"secret":true},
   {"key":"bucket_name","label":"Bucket Name","type":"text","required":true,"secret":false},
   {"key":"region","label":"Region","type":"text","required":true,"secret":false}
 ]}',
 false, 'https://docs.aws.amazon.com/s3', false, NOW()),

-- ── اجتماعات مرئية ────────────────────────────────────────────────
(18, 'zoom',         'video',        'Zoom Meetings',           'اجتماعات ودروس مرئية عبر Zoom',
 'video', '🎥', '#2D8CFF',
 '{"fields":[
   {"key":"account_id","label":"Account ID","type":"text","required":true,"secret":false},
   {"key":"client_id","label":"Client ID","type":"text","required":true,"secret":false},
   {"key":"client_secret","label":"Client Secret","type":"password","required":true,"secret":true}
 ]}',
 false, 'https://marketplace.zoom.us/docs', false, NOW()),

(19, 'ms_teams',     'video',        'Microsoft Teams',         'اجتماعات ودروس عبر Microsoft Teams',
 'video', '👥', '#464775',
 '{"fields":[
   {"key":"tenant_id","label":"Tenant ID","type":"text","required":true,"secret":false},
   {"key":"client_id","label":"Client ID","type":"text","required":true,"secret":false},
   {"key":"client_secret","label":"Client Secret","type":"password","required":true,"secret":true}
 ]}',
 false, 'https://learn.microsoft.com/graph', false, NOW()),

-- ── الذكاء الاصطناعي ──────────────────────────────────────────────
(20, 'openai',       'ai',           'OpenAI GPT',              'مساعد ذكاء اصطناعي لتحسين تجربة التعلم',
 'ai', '🤖', '#10A37F',
 '{"fields":[
   {"key":"api_key","label":"API Key","type":"password","required":true,"secret":true},
   {"key":"model","label":"Model","type":"text","required":false,"secret":false}
 ]}',
 false, 'https://platform.openai.com/docs', false, NOW())

ON CONFLICT (id) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description  = EXCLUDED.description,
  category     = EXCLUDED.category,
  icon         = EXCLUDED.icon,
  color        = EXCLUDED.color,
  config       = EXCLUDED.config,
  docs_url     = EXCLUDED.docs_url,
  updated_at   = NOW();

-- ─── 4. تحديث الـ sequence ليبدأ بعد آخر ID ──────────────────────
SELECT setval('integrations_id_seq', (SELECT MAX(id) FROM integrations));
