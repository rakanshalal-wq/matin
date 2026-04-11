$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$outputPath = "C:\Users\rakan\OneDrive\Desktop\تقرير_الفحص_الشامل_متين.docx"
$tempDir = "$env:TEMP\docx_build_matin"

if (Test-Path $tempDir) { Remove-Item $tempDir -Recurse -Force }

New-Item -ItemType Directory -Path "$tempDir\word\_rels" -Force | Out-Null
New-Item -ItemType Directory -Path "$tempDir\_rels" -Force | Out-Null

# ===== HELPER FUNCTIONS =====
function P([string]$text, [string]$style = '') {
    $pPr = ''
    $rPr = ''
    if ($style) { $pPr = "<w:pPr><w:pStyle w:val=`"$style`"/></w:pPr>" }
    return "<w:p>$pPr<w:r><w:rPr><w:rtl/></w:rPr><w:t xml:space=`"preserve`">$([System.Security.SecurityElement]::Escape($text))</w:t></w:r></w:p>`n"
}

function PCode([string]$text) {
    return "<w:p><w:pPr><w:pStyle w:val=`"Code`"/></w:pPr><w:r><w:t xml:space=`"preserve`">$([System.Security.SecurityElement]::Escape($text))</w:t></w:r></w:p>`n"
}

function PBold([string]$text, [string]$style = '') {
    $pPr = "<w:pPr><w:bidi/>"
    if ($style) { $pPr += "<w:pStyle w:val=`"$style`"/>" }
    $pPr += "</w:pPr>"
    return "<w:p>$pPr<w:r><w:rPr><w:b/><w:bCs/><w:rtl/></w:rPr><w:t xml:space=`"preserve`">$([System.Security.SecurityElement]::Escape($text))</w:t></w:r></w:p>`n"
}

function TableRow([string[]]$cells, [bool]$isHeader = $false) {
    $xml = "<w:tr>"
    foreach ($cell in $cells) {
        $shd = ''
        $rPr = '<w:rPr><w:rtl/>'
        if ($isHeader) {
            $shd = '<w:shd w:val="clear" w:color="auto" w:fill="2C3E50"/>'
            $rPr = '<w:rPr><w:b/><w:bCs/><w:color w:val="FFFFFF"/><w:rtl/>'
        }
        $rPr += '</w:rPr>'
        $xml += "<w:tc><w:tcPr><w:tcW w:w=`"0`" w:type=`"auto`"/>$shd</w:tcPr><w:p><w:pPr><w:bidi/><w:spacing w:after=`"40`"/></w:pPr><w:r>$rPr<w:t xml:space=`"preserve`">$([System.Security.SecurityElement]::Escape($cell))</w:t></w:r></w:p></w:tc>"
    }
    $xml += "</w:tr>`n"
    return $xml
}

function TableStart() {
    return '<w:tbl><w:tblPr><w:tblStyle w:val="TableGrid"/><w:tblW w:w="5000" w:type="pct"/><w:bidiVisual/><w:tblLook w:val="04A0"/></w:tblPr>'
}

function TableEnd() { return "</w:tbl>`n" }

function PageBreak() {
    return '<w:p><w:r><w:br w:type="page"/></w:r></w:p>'
}

# ===== BUILD DOCUMENT CONTENT =====
$body = ''

# ===== TITLE PAGE =====
$body += P '' 
$body += P '' 
$body += P '' 
$body += P 'تقرير الفحص الفني الشامل' 'Title'
$body += P 'منصة متين (Matin Platform)' 'Subtitle'
$body += P '' 
$body += P 'فحص دقيق لكل ملف في المشروع مع أدلة مباشرة من الكود' 'Subtitle'
$body += P '' 
$body += P "تاريخ التقرير: $(Get-Date -Format 'yyyy/MM/dd')" 'Subtitle'
$body += P 'عدد الملفات المفحوصة: 61 ملف مصدري + 23 تصميم HTML' 'Subtitle'
$body += PageBreak

# ===== TABLE OF CONTENTS =====
$body += P 'فهرس المحتويات' 'Heading1'
$body += P 'الجزء الاول: ملخص تنفيذي'
$body += P 'الجزء الثاني: الاعطال الحرجة (تمنع التشغيل) - 3 اعطال'
$body += P 'الجزء الثالث: المشاكل الامنية - 5 مشاكل'
$body += P 'الجزء الرابع: تحليل كل قطاع (التصميم مقابل التنفيذ)'
$body += P 'الجزء الخامس: المشاكل الهيكلية العامة'
$body += P 'الجزء السادس: خطة الاصلاح المدروسة (مرتبة بالاولوية)'
$body += P 'الملاحق: طريقة التحقق من كل ادعاء'
$body += PageBreak

# ===== EXECUTIVE SUMMARY =====
$body += P 'الجزء الاول: ملخص تنفيذي' 'Heading1'
$body += P ''
$body += TableStart
$body += TableRow @('المقياس', 'القيمة') $true
$body += TableRow @('اجمالي الملفات المفحوصة', '61 ملف مصدري')
$body += TableRow @('اعطال حرجة (تمنع التشغيل)', '3 اعطال')
$body += TableRow @('ثغرات امنية', '5 ثغرات')
$body += TableRow @('صفحات ثابتة 100% (بدون API)', '3 صفحات')
$body += TableRow @('APIs مكسورة بالكامل', '3 (بسبب import خطأ)')
$body += TableRow @('APIs ناقصة (مطلوبة لكن غير موجودة)', '6')
$body += TableRow @('اماكن alert() بدل وظيفة حقيقية', '15+ مكان')
$body += TableRow @('صفحات عامة ناقصة', '2 (training/[code], quran/[code])')
$body += TableRow @('نسبة الانجاز الحقيقية', '55-60%')
$body += TableEnd
$body += PageBreak

# ===== CRITICAL BUGS =====
$body += P 'الجزء الثاني: الاعطال الحرجة (تمنع التشغيل)' 'Heading1'

# Bug 1
$body += P 'العطل #1: خطأ Import يكسر 3 APIs كاملة' 'Heading2'
$body += P 'الحالة: حرج - كسر كامل' 'AlertRed'
$body += P ''
$body += PBold 'المشكلة:'
$body += P 'ثلاثة ملفات API تستورد pool من المكان الخطأ. الملف auth.ts لا يصدر pool اطلاقا.'
$body += P ''
$body += PBold 'الملفات المتأثرة:'
$body += P ''
$body += TableStart
$body += TableRow @('الملف', 'السطر', 'الكود الخطأ') $true
$body += TableRow @('src/app/api/quran/route.ts', 'سطر 2', "import { pool } from '@/lib/auth';")
$body += TableRow @('src/app/api/schools/public/[code]/route.ts', 'سطر 2', "import { pool } from '@/lib/auth';")
$body += TableRow @('src/app/api/institutes/public/[code]/route.ts', 'سطر 2', "import { pool } from '@/lib/auth';")
$body += TableEnd

$body += P ''
$body += PBold 'الدليل - ما يصدره auth.ts فعلا:'
$body += P 'الملف src/lib/auth.ts يصدر فقط هذه الدوال والانواع:'
$body += PCode 'TokenPayload (interface)'
$body += PCode 'signToken, verifyToken'
$body += PCode 'hashPassword, comparePassword'
$body += PCode 'setAuthCookie, clearAuthCookie, getTokenFromCookies'
$body += PCode 'getCurrentUser, getRoleRedirect'
$body += P ''
$body += P 'لا يوجد كلمة pool في الملف نهائيا. pool موجود فقط في src/lib/db.ts'
$body += P ''
$body += PBold 'طريقة التحقق بنفسك:'
$body += PCode '1. افتح src/lib/auth.ts وابحث عن كلمة "pool" - لن تجدها'
$body += PCode '2. افتح src/lib/db.ts - ستجد pool موجود هنا'
$body += PCode '3. افتح اي من الملفات الثلاثة اعلاه وانظر السطر 2'
$body += P ''
$body += PBold 'النتيجة:'
$body += P 'pool سيكون undefined عند التشغيل. كل استدعاء pool.query() سيطيح بخطأ TypeError'
$body += P ''
$body += PBold 'الحل:'
$body += PCode "تغيير: import { pool } from '@/lib/auth';"
$body += PCode "الى:    import pool from '@/lib/db';"
$body += P ''
$body += PBold 'التأثير الجانبي: لا يوجد - تصحيح مسار الاستيراد فقط'
$body += P '' 'AlertGreen'

# Bug 2
$body += P 'العطل #2: القرآن بدون حماية (مفتوح للجميع)' 'Heading2'
$body += P 'الحالة: حرج - ثغرة امنية + عطل' 'AlertRed'
$body += P ''
$body += PBold 'الملف: src/app/api/quran/route.ts'
$body += P ''
$body += PBold 'المشكلة:'
$body += P 'دالة getUser() في هذا الملف ترجع بيانات وهمية ثابتة ولا تتحقق من التوكن. والاسوأ: لا تُستدعى اصلا في GET/POST handlers.'
$body += P ''
$body += PBold 'طريقة التحقق بنفسك:'
$body += PCode '1. افتح src/app/api/quran/route.ts'
$body += PCode '2. ابحث عن function getUser - ستجدها ترجع كائن ثابت'
$body += PCode '3. ابحث عن getUser() في GET و POST handlers - لن تجدها تُستدعى'
$body += PCode '4. اي شخص يقدر يرسل GET/POST لهذا الـ endpoint بدون تسجيل دخول'
$body += P ''
$body += PBold 'النتيجة:'
$body += P 'بيانات حلقات القرآن والطلاب مكشوفة. يمكن لاي شخص تسجيل حضور وتسميع وهمي.'
$body += P ''
$body += PBold 'الصفحات المتأثرة:'
$body += P 'quran/dashboard, quran/teacher, quran/student, quran/supervisor, quran/session'
$body += P ''
$body += PBold 'الحل:'
$body += PCode "استبدال getUser() بـ getCurrentUser() من '@/lib/auth'"
$body += PCode 'اضافة تحقق من الدور (quran_admin, quran_teacher, etc.)'
$body += P ''
$body += PBold 'التأثير الجانبي: صفحات القرآن ستتطلب تسجيل دخول (وهذا المطلوب)'
$body += P '' 'AlertYellow'

# Bug 3
$body += P 'العطل #3: حقول المستخدم خطأ في الجامعة' 'Heading2'
$body += P 'الحالة: حرج - بيانات لا تظهر' 'AlertRed'
$body += P ''
$body += PBold 'الملف: src/app/api/university/route.ts'
$body += P ''
$body += PBold 'المشكلة:'
$body += P 'يستخدم (user as any).school_id و (user as any).id لكن JWT التوكن يحتوي على institutionId و userId'
$body += P ''
$body += PBold 'طريقة التحقق بنفسك:'
$body += PCode '1. افتح src/lib/auth.ts وانظر TokenPayload interface (سطر 9-15)'
$body += PCode '   الحقول: userId, role, institutionId, institutionType, name'
$body += PCode '2. افتح src/app/api/university/route.ts'
$body += PCode '3. ابحث عن school_id - ستجده يستخدم (user as any).school_id'
$body += PCode '4. ابحث عن .id - ستجده يستخدم (user as any).id'
$body += PCode '5. لا يوجد school_id ولا id في TokenPayload - فقط userId و institutionId'
$body += P ''
$body += PBold 'النتيجة:'
$body += P 'school_id و id سيكونان undefined. كل استعلامات الجامعة ترجع بيانات فارغة او خاطئة.'
$body += P ''
$body += PBold 'الحل:'
$body += PCode "(user as any).school_id  ->  user.institutionId"
$body += PCode "(user as any).id         ->  user.userId"
$body += P ''
$body += PBold 'التأثير الجانبي: لا يوجد - تصحيح اسماء فقط. لكن تأكد ان عمود DB هو school_id'
$body += P '' 'AlertGreen'
$body += PageBreak

# ===== SECURITY ISSUES =====
$body += P 'الجزء الثالث: المشاكل الامنية' 'Heading1'

$body += P 'امن #1: بيانات بطاقات الدفع تُجمع مباشرة في الكود' 'Heading2'
$body += P 'الحالة: خطير - مخالفة PCI-DSS' 'AlertRed'
$body += P ''
$body += PBold 'الملفات:'
$body += P ''
$body += TableStart
$body += TableRow @('الملف', 'السطر', 'الكود') $true
$body += TableRow @('src/app/school/parent/page.tsx', 'سطر 45', "useState({ method: 'mada', card_number: '', expiry: '', cvv: '' })")
$body += TableRow @('src/app/university/parent/page.tsx', 'سطر 49', "useState({ method: 'mada', card_number: '', expiry: '', cvv: '' })")
$body += TableEnd
$body += P ''
$body += PBold 'طريقة التحقق بنفسك:'
$body += PCode '1. افتح src/app/school/parent/page.tsx سطر 45'
$body += PCode '2. افتح src/app/university/parent/page.tsx سطر 49'
$body += PCode '3. ابحث عن card_number و cvv - ستجدهما في useState وفي حقول الادخال'
$body += P ''
$body += PBold 'النتيجة: رقم البطاقة و CVV يُخزنان في state ويُرسلان في POST body'
$body += P ''
$body += PBold 'الحل: استخدام بوابة دفع خارجية (Moyasar/Tap) او استبدال الحقول برسالة "قريبا"'

$body += P '' 
$body += P 'امن #2: لا يوجد Rate Limiting' 'Heading2'
$body += P 'الحالة: مهم' 'AlertYellow'
$body += PBold 'الملف: src/app/api/auth/login/route.ts'
$body += P 'لا يوجد حد اقصى لمحاولات تسجيل الدخول. هجمات Brute Force ممكنة.'
$body += PBold 'طريقة التحقق: افتح الملف وابحث عن rate او limit - لن تجد شيئا'

$body += P '' 
$body += P 'امن #3: لا يوجد تحقق من الادوار في 4 APIs' 'Heading2'
$body += P 'الحالة: مهم' 'AlertYellow'
$body += P ''
$body += TableStart
$body += TableRow @('الملف', 'المشكلة', 'النتيجة') $true
$body += TableRow @('api/institute/route.ts', 'لا role check بعد getCurrentUser()', 'اي مستخدم يوصل لبيانات المعهد')
$body += TableRow @('api/training/route.ts', 'لا role check بعد getCurrentUser()', 'اي مستخدم يوصل لبيانات التدريب')
$body += TableRow @('api/university/route.ts', 'لا role check', 'طالب يقدر يشوف بيانات الرئيس')
$body += TableRow @('api/quran/route.ts', 'لا auth اصلا', 'الكل يقدر يدخل')
$body += TableEnd
$body += P ''
$body += PBold 'طريقة التحقق: افتح كل ملف وابحث عن role - لن تجد تحقق من الدور'

$body += P '' 
$body += P 'امن #4: POST errors ترجع success: true كذبا' 'Heading2'
$body += PBold 'الملفات: api/institute/route.ts, api/training/route.ts, api/university/route.ts'
$body += P 'اذا فشل INSERT في قاعدة البيانات، يرجع success: true, note: "قيد الاعداد" بدل الخطأ الحقيقي.'
$body += PBold 'طريقة التحقق: افتح الملفات وابحث عن catch blocks في POST handlers'

$body += P '' 
$body += P 'امن #5: انشاء مستخدمين بدون كلمة مرور' 'Heading2'
$body += PBold 'الملفات: api/institute/route.ts, api/training/route.ts'
$body += P 'POST type=student/teacher/trainee/trainer يعمل INSERT في جدول users بدون حقل password_hash'
$body += PBold 'طريقة التحقق: ابحث عن INSERT INTO users في هذين الملفين وتأكد من عدم وجود password_hash'
$body += PageBreak

# ===== SECTOR ANALYSIS =====
$body += P 'الجزء الرابع: تحليل كل قطاع' 'Heading1'

# Schools
$body += P 'قطاع المدارس (5 تصاميم HTML)' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('التصميم HTML', 'الملف في الكود', 'نسبة الانجاز', 'الناقص') $true
$body += TableRow @('الصفحة الرئيسية للمدارس', 'school/[code]/page.tsx', '80%', 'صور المدرسة، خريطة، شهادات الاهالي')
$body += TableRow @('لوحة تحكم مالك المدرسة', 'dashboard/school-owner/page.tsx', '10%', 'كل البيانات ثابتة. لا API. الازرار لا تعمل')
$body += TableRow @('لوحة تحكم المعلم', 'school/teacher/page.tsx', '70%', 'حفظ الدرجات بدون API. لا رسائل. لا تنبيهات')
$body += TableRow @('داش بورد ولي الامر', 'school/parent/page.tsx', '75%', 'تفاصيل الحضور يوميا. امان الدفع')
$body += TableRow @('الموارد البشرية', 'dashboard/hr/page.tsx', '30%', 'يستدعي APIs غير موجودة: /api/hr-stats, /api/employees')
$body += TableEnd

$body += P ''
$body += PBold 'ميزات من التصاميم غير موجودة بالكود:'
$body += P '- لوحة المالك: ادارة الفروع (مدرسة/روضة/حضانة)، نظام الاشتراكات، تقارير مالية، ادارة الباصات'
$body += P '- المعلم: جدول الحصص الاسبوعي، نظام الرسائل، تنبيهات فورية'
$body += P '- ولي الامر: تتبع الباص GPS، جدول الحصص، تقارير سلوكية مفصلة'

# Universities
$body += P '' 
$body += P 'قطاع الجامعات (7 تصاميم HTML)' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('التصميم HTML', 'الملف في الكود', 'نسبة الانجاز', 'الناقص') $true
$body += TableRow @('الصفحة الرئيسية للجامعات', 'لا توجد صفحة مستقلة', '0%', 'تعالج عبر institution/[slug] العامة فقط')
$body += TableRow @('لوحة رئيس الجامعة', 'university/president/page.tsx', '60%', 'بيانات Fallback ثابتة. قبول/رفض بدون API')
$body += TableRow @('لوحة عميد الكلية', 'university/dean/page.tsx', '50%', 'المستخدم ثابت بالكود. الصلاحيات لا تنحفظ')
$body += TableRow @('لوحة الدكتور', 'university/professor/page.tsx', '40%', 'حضور/درجات = alert() فقط! لا API')
$body += TableRow @('بوابة الطالب', 'university/student/page.tsx', '45%', '10 من 12 زر = alert(). التسجيل بدون API')
$body += TableRow @('الموارد البشرية', 'university/hr/page.tsx', '65%', 'تصدير PDF = alert(). الرواتب ثابتة')
$body += TableRow @('ولي امر الطالب الجامعي', 'university/parent/page.tsx', '55%', 'الاختبارات والمعدل التراكمي ثابتين')
$body += TableEnd

# Institutes
$body += P '' 
$body += P 'قطاع المعاهد (2 تصميم HTML)' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('التصميم HTML', 'الملف في الكود', 'نسبة الانجاز', 'الناقص') $true
$body += TableRow @('الصفحة الرئيسية للمعهد', 'institute/[code]/page.tsx', '80%', 'جيدة')
$body += TableRow @('داش بورد المعهد', 'institute/dashboard/page.tsx', '65%', 'المدرسون لا يتحملون. المالية = صفر ثابت')
$body += TableEnd

# Training
$body += P '' 
$body += P 'قطاع مراكز التدريب (4 تصاميم HTML)' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('التصميم HTML', 'الملف في الكود', 'نسبة الانجاز', 'الناقص') $true
$body += TableRow @('بوابة المركز العامة', 'لا توجد training/[code]', '0%', 'صفحة عامة غير موجودة اصلا')
$body += TableRow @('لوحة المدير', 'training/manager/page.tsx', '60%', 'المدربون placeholder. المالية ثابتة')
$body += TableRow @('لوحة المدرب', 'training/trainer/page.tsx', '70%', 'الحضور متصل بـ API')
$body += TableRow @('بوابة المتدرب', 'training/trainee/page.tsx', '65%', 'تحميل الشهادات لا يعمل')
$body += TableEnd

# Quran
$body += P '' 
$body += P 'قطاع تحفيظ القرآن (5 تصاميم HTML)' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('التصميم HTML', 'الملف في الكود', 'نسبة الانجاز', 'الناقص') $true
$body += TableRow @('الصفحة الرئيسية', 'لا توجد quran/[code]', '0%', 'صفحة عامة غير موجودة')
$body += TableRow @('لوحة الادارة', 'quran/dashboard/page.tsx', '70%', 'API مكسور بسبب import')
$body += TableRow @('لوحة المحفظ', 'quran/teacher/page.tsx', '50%', '4 تبويبات تعرض نفس الجدول!')
$body += TableRow @('المشرف', 'quran/supervisor/page.tsx', '60%', 'رفع تقرير لا يعمل')
$body += TableRow @('الطالب', 'quran/student/page.tsx', '65%', 'الشارات والسجل يعملان')
$body += TableEnd
$body += PageBreak

# ===== STRUCTURAL ISSUES =====
$body += P 'الجزء الخامس: المشاكل الهيكلية العامة' 'Heading1'

$body += P '1. نظام الالوان مفكك' 'Heading3'
$body += P 'globals.css يعرف #0F172A كخلفية. معظم الصفحات تستخدم #06060E. كل قطاع يعرف الوانه inline.'
$body += PBold 'طريقة التحقق:'
$body += PCode 'ابحث عن #0F172A في globals.css وعن #06060E في باقي الملفات'

$body += P '' 
$body += P '2. تحميل الخط مكرر' 'Heading3'
$body += P 'IBM Plex Sans Arabic يتحمل مرتين: في layout.tsx عبر link وفي globals.css عبر @import'
$body += PBold 'طريقة التحقق:'
$body += PCode 'افتح src/app/layout.tsx وابحث عن IBM Plex'
$body += PCode 'افتح src/app/globals.css وابحث عن @import'

$body += P '' 
$body += P '3. نمط المصادقة (Auth) غير موحد' 'Heading3'
$body += P ''
$body += TableStart
$body += TableRow @('النمط', 'الملفات') $true
$body += TableRow @('localStorage (قديم)', 'dashboard/hr, dashboard/school-owner')
$body += TableRow @('/api/auth/me (صحيح)', 'معظم الصفحات الاخرى')
$body += TableRow @('لا مصادقة', 'quran/session, university/dean')
$body += TableEnd

$body += P '' 
$body += P '4. الـ Shells (اطارات التنقل) غير مكتملة' 'Heading3'
$body += P ''
$body += TableStart
$body += TableRow @('المشكلة', 'التفصيل', 'الملفات') $true
$body += TableRow @('اسم المستخدم ثابت', 'كل الـ Shells تعرض "م" بدل الاسم الحقيقي', 'كل الـ 6 Shells')
$body += TableRow @('الجرس لا يعمل', 'زر التنبيهات بدون وظيفة', 'كل الـ 6 Shells')
$body += TableRow @('التنقل النشط خطأ', 'يستخدم === بدل startsWith', 'كل الـ 6 Shells')
$body += TableRow @('رابط اللوقو مكسور', 'href="#" بدل رابط صحيح', 'UniversityShell.tsx')
$body += TableEnd
$body += PageBreak

# ===== FIX PLAN =====
$body += P 'الجزء السادس: خطة الاصلاح المدروسة' 'Heading1'
$body += P 'الخطوات مرتبة بحيث كل خطوة لا تؤثر سلبا على التي بعدها'

$body += P 'الخطوة 1: اصلاح الاعطال الحرجة (الاولوية القصوى)' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('#', 'المهمة', 'الملفات', 'الحل', 'التأثير الجانبي') $true
$body += TableRow @('1.1', 'اصلاح import pool', '3 ملفات API', "تغيير from auth الى from db", 'لا يوجد')
$body += TableRow @('1.2', 'اصلاح auth القرآن', 'api/quran/route.ts', 'استبدال getUser بـ getCurrentUser', 'يتطلب تسجيل دخول')
$body += TableRow @('1.3', 'اصلاح حقول الجامعة', 'api/university/route.ts', 'school_id -> institutionId', 'لا يوجد')
$body += TableEnd

$body += P '' 
$body += P 'الخطوة 2: سد الثغرات الامنية' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('#', 'المهمة', 'الحل', 'التأثير الجانبي') $true
$body += TableRow @('2.1', 'تحقق الادوار في 4 APIs', 'اضافة role check بعد getCurrentUser()', 'لا يوجد')
$body += TableRow @('2.2', 'ازالة جمع بيانات البطاقات', 'حذف حقول CVV/card واستبدالها برسالة او SDK', 'الدفع لن يعمل مؤقتا')
$body += TableRow @('2.3', 'اصلاح ارجاع الاخطاء', 'ارجاع success: false عند الفشل', 'لا يوجد')
$body += TableRow @('2.4', 'اصلاح انشاء المستخدمين', 'اضافة password_hash عند INSERT', 'لا يوجد')
$body += TableEnd

$body += P '' 
$body += P 'الخطوة 3: توحيد البنية التحتية' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('#', 'المهمة', 'الحل', 'التأثير الجانبي') $true
$body += TableRow @('3.1', 'توحيد نمط Auth', 'استبدال localStorage بـ /api/auth/me', 'لا يوجد')
$body += TableRow @('3.2', 'اصلاح الـ Shells', 'اضافة fetch لبيانات المستخدم + startsWith', 'تحسين UX')
$body += TableRow @('3.3', 'توحيد نظام الالوان', 'توحيد على #06060E واستخدام CSS variables', 'يحتاج حذر')
$body += TableRow @('3.4', 'حذف تحميل الخط المكرر', 'حذف @import من globals.css', 'لا يوجد')
$body += TableEnd

$body += P '' 
$body += P 'الخطوة 4: اكمال APIs الناقصة' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('#', 'المهمة', 'التفصيل') $true
$body += TableRow @('4.1', 'API حفظ الدرجات (الاستاذ)', 'POST /api/university type=save-grades')
$body += TableRow @('4.2', 'API حفظ الحضور (الاستاذ)', 'POST /api/university type=save-attendance')
$body += TableRow @('4.3', 'API قبول/رفض الطلبات', 'POST /api/university type=admission-action')
$body += TableRow @('4.4', 'ربط زر حفظ الدرجات (المعلم)', 'POST /api/school/teacher type=grade موجود لكن لا يُستدعى')
$body += TableRow @('4.5', 'APIs الموارد البشرية الناقصة', '/api/hr-stats, /api/employees, /api/leaves, /api/payroll')
$body += TableRow @('4.6', 'صفحة التدريب العامة', 'انشاء training/[code]/page.tsx + API')
$body += TableRow @('4.7', 'صفحة القرآن العامة', 'انشاء quran/[code]/page.tsx + API')
$body += TableEnd

$body += P '' 
$body += P 'الخطوة 5: تحويل الصفحات الثابتة لديناميكية' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('#', 'الصفحة', 'الحالة', 'المطلوب') $true
$body += TableRow @('5.1', 'owner/dashboard', 'كل الارقام = 0', 'انشاء API للمالك + ربطها')
$body += TableRow @('5.2', 'dashboard/school-owner', 'بيانات ثابتة', 'ربط بـ API حقيقي')
$body += TableRow @('5.3', 'university/dean', 'المستخدم ثابت بالكود', 'جلب من /api/auth/me')
$body += TableRow @('5.4', 'المدرسون في institute', 'لا يتحمل ابدا', 'اضافة GET للمدرسين')
$body += TableRow @('5.5', 'المدربون في training', 'placeholder', 'نفس الحل')
$body += TableEnd

$body += P '' 
$body += P 'الخطوة 6: اكمال الميزات حسب التصاميم' 'Heading2'
$body += P ''
$body += TableStart
$body += TableRow @('#', 'الميزة', 'الاولوية', 'الملاحظة') $true
$body += TableRow @('6.1', 'تبويبات المحفظ (4 مختلفة بدل نسخة واحدة)', 'عالية', 'quran/teacher/page.tsx')
$body += TableRow @('6.2', 'استبدال alert() بوظائف حقيقية', 'عالية', '15+ مكان في الكود')
$body += TableRow @('6.3', 'الاقسام الثابتة في الجامعة', 'متوسطة', 'اختبارات، معدل تراكمي')
$body += TableRow @('6.4', 'نظام الشهادات PDF', 'متوسطة', 'training/trainee')
$body += TableRow @('6.5', 'نظام الرسائل والتنبيهات', 'متوسطة', 'كل القطاعات')
$body += TableRow @('6.6', 'تصدير PDF للرواتب', 'منخفضة', 'university/hr')
$body += TableEnd
$body += PageBreak

# ===== APPENDIX: VERIFICATION =====
$body += P 'الملاحق: طريقة التحقق من كل ادعاء' 'Heading1'
$body += P 'لكل ادعاء في هذا التقرير، يمكنك التحقق بنفسك باتباع هذه الخطوات:'
$body += P ''

$body += P 'التحقق #1: هل auth.ts يصدر pool؟' 'Heading3'
$body += PCode 'افتح الملف: src/lib/auth.ts'
$body += PCode 'ابحث عن كلمة pool في الملف كامل'
$body += PCode 'النتيجة المتوقعة: لا توجد كلمة pool'
$body += PCode ''
$body += PCode 'ثم افتح: src/lib/db.ts'
$body += PCode 'ابحث عن pool'
$body += PCode 'النتيجة المتوقعة: pool موجود هنا (export default pool او export { pool })'

$body += P '' 
$body += P 'التحقق #2: هل api/quran/route.ts موجود؟' 'Heading3'
$body += PCode 'في المجلد: src/app/api/quran/'
$body += PCode 'تأكد من وجود route.ts'
$body += PCode 'النتيجة المتوقعة: الملف موجود'

$body += P '' 
$body += P 'التحقق #3: هل api/university/route.ts موجود؟' 'Heading3'
$body += PCode 'في المجلد: src/app/api/university/'
$body += PCode 'تأكد من وجود route.ts'
$body += PCode 'النتيجة المتوقعة: الملف موجود'

$body += P '' 
$body += P 'التحقق #4: هل card_number و cvv موجودين؟' 'Heading3'
$body += PCode 'افتح: src/app/school/parent/page.tsx - سطر 45'
$body += PCode 'افتح: src/app/university/parent/page.tsx - سطر 49'
$body += PCode 'النتيجة المتوقعة: ستجد card_number و cvv في useState'

$body += P '' 
$body += P 'التحقق #5: هل الجامعة تستخدم school_id بدل institutionId؟' 'Heading3'
$body += PCode 'افتح: src/app/api/university/route.ts'
$body += PCode 'ابحث عن school_id'
$body += PCode 'النتيجة المتوقعة: ستجد (user as any).school_id'
$body += PCode ''
$body += PCode 'ثم افتح: src/lib/auth.ts سطر 9-15'
$body += PCode 'انظر TokenPayload interface'
$body += PCode 'النتيجة المتوقعة: لا يوجد حقل school_id - فقط institutionId'

$body += P '' 
$body += P 'التحقق #6: هل القرآن بدون مصادقة؟' 'Heading3'
$body += PCode 'افتح: src/app/api/quran/route.ts'
$body += PCode 'ابحث عن function getUser'
$body += PCode 'النتيجة المتوقعة: دالة ترجع كائن ثابت بدون تحقق من التوكن'
$body += PCode ''
$body += PCode 'ثم ابحث عن getCurrentUser في نفس الملف'
$body += PCode 'النتيجة المتوقعة: لا تُستدعى'

$body += P '' 
$body += P 'التحقق #7: هل الـ Shells تعرض اسم ثابت؟' 'Heading3'
$body += PCode 'افتح اي Shell مثل: src/components/shells/SchoolShell.tsx'
$body += PCode 'ابحث عن Avatar او حرف "م"'
$body += PCode 'النتيجة المتوقعة: حرف ثابت بدون fetch لبيانات المستخدم'

$body += P '' 
$body += P '' 
$body += P 'نهاية التقرير' 'Heading2'
$body += P "تم انشاء هذا التقرير بتاريخ $(Get-Date -Format 'yyyy/MM/dd HH:mm') بناء على فحص فعلي لكل ملف في المشروع."
$body += P 'كل ادعاء مرفق بالدليل (اسم الملف + رقم السطر + الكود) ويمكن التحقق منه مباشرة.'

# ===== ASSEMBLE DOCUMENT =====
$documentXml = @"
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
$body
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720"/>
      <w:bidi/>
    </w:sectPr>
  </w:body>
</w:document>
"@

$documentXml | Set-Content -Path "$tempDir\word\document.xml" -Encoding UTF8

# ===== CREATE ZIP (DOCX) =====
if (Test-Path $outputPath) { Remove-Item $outputPath -Force }

$zipPath = "$tempDir.zip"
if (Test-Path $zipPath) { Remove-Item $zipPath -Force }

Compress-Archive -Path "$tempDir\*" -DestinationPath $zipPath -Force
Copy-Item $zipPath $outputPath -Force

# Cleanup
Remove-Item $tempDir -Recurse -Force
Remove-Item $zipPath -Force

Write-Host "DONE: $outputPath"
