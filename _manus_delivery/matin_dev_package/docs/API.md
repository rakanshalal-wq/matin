# توثيق API — منصة متين

> **الإصدار:** 1.0.0 | **آخر تحديث:** مارس 2026

جميع endpoints تتطلب مصادقة عبر JWT token في الـ header أو cookie، ما لم يُذكر خلاف ذلك.

```
Authorization: Bearer <token>
# أو عبر cookie: matin_token=<token>
```

---

## المصادقة / Authentication

| Method | Endpoint | الوصف | الصلاحية |
|--------|----------|-------|----------|
| POST | `/api/auth` | تسجيل الدخول بالبريد وكلمة المرور أو OTP | عام |
| POST | `/api/register` | إنشاء حساب مؤسسة جديدة | عام |
| POST | `/api/nafath` | تسجيل الدخول عبر نفاذ | عام |
| POST | `/api/school-join` | طلب انضمام لمدرسة | عام |
| GET | `/api/profile` | بيانات المستخدم الحالي | مسجّل |
| GET/PUT | `/api/users` | إدارة المستخدمين | admin+ |

---

## الطلاب والمعلمين / Students & Teachers

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/students?page=1&limit=50` | قائمة الطلاب مع pagination |
| POST | `/api/students` | إضافة طالب جديد |
| PUT | `/api/students` | تعديل بيانات طالب (يتطلب `id`) |
| DELETE | `/api/students?id=<id>` | حذف طالب |
| GET | `/api/teachers?page=1&limit=50` | قائمة المعلمين |
| POST | `/api/teachers` | إضافة معلم جديد |
| PUT | `/api/teachers` | تعديل بيانات معلم |
| DELETE | `/api/teachers?id=<id>` | حذف معلم |
| GET | `/api/parents` | قائمة أولياء الأمور |
| GET | `/api/employees` | قائمة الموظفين |
| GET | `/api/supervisors` | قائمة المشرفين |

---

## الحضور والدرجات / Attendance & Grades

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/attendance?student_id=&date=` | سجل الحضور |
| POST | `/api/attendance` | تسجيل حضور (فردي أو جماعي) |
| PUT | `/api/attendance` | تعديل حالة الحضور |
| DELETE | `/api/attendance?id=<id>` | حذف سجل |
| GET | `/api/grades?student_id=&course_id=` | الدرجات |
| POST | `/api/grades` | إضافة درجة |
| PUT | `/api/grades` | تعديل درجة |

---

## الاختبارات / Exams

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/exams` | قائمة الاختبارات |
| POST | `/api/exams` | إنشاء اختبار جديد |
| PUT | `/api/exams` | تعديل اختبار |
| DELETE | `/api/exams?id=<id>` | حذف اختبار |
| GET/POST | `/api/exam-session` | جلسة الاختبار المباشرة |
| GET/POST | `/api/exam-proctoring` | نظام المراقبة الذكية |
| GET/POST | `/api/exam-security` | إعدادات أمان الاختبار |
| GET/POST/DELETE | `/api/exam-rooms` | قاعات الاختبار |
| GET/POST/DELETE | `/api/exam-schedule` | جدول الاختبارات |
| GET/POST/DELETE | `/api/emergency-keys` | مفاتيح الطوارئ |
| GET/POST/PUT/DELETE | `/api/question-bank` | بنك الأسئلة |

---

## النقل / Transport

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET | `/api/transport?type=buses` | الحافلات والركاب |
| POST | `/api/transport` | إضافة حافلة أو راكب |
| PUT | `/api/transport` | تعديل (يتطلب `type: bus/rider`) |
| DELETE | `/api/transport?id=<id>` | حذف |
| GET/POST/DELETE | `/api/drivers` | السائقون |
| GET/POST/DELETE | `/api/driver-licenses` | رخص القيادة |
| GET/POST/DELETE | `/api/bus-maintenance` | صيانة الحافلات |
| GET/POST/DELETE | `/api/fuel` | سجلات الوقود |
| GET/POST/PUT | `/api/student-tracking` | تتبع الطلاب |

---

## الصحة والرعاية / Health & Care

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/api/clinic` | العيادة المدرسية |
| GET/POST/PUT/DELETE | `/api/health` | السجلات الصحية |
| GET/POST/PUT/DELETE | `/api/vaccinations` | التطعيمات |
| GET/POST/PUT/DELETE | `/api/insurance` | التأمين الصحي |
| GET/POST/PUT/DELETE | `/api/special-needs` | ذوو الاحتياجات الخاصة |
| GET/POST/PUT/DELETE | `/api/gifted` | الموهوبون |
| GET/POST/PUT/DELETE | `/api/behavior` | السلوك |
| GET/POST/PUT/DELETE | `/api/counseling` | الإرشاد الطلابي |
| GET/POST/PUT/DELETE | `/api/emergencies` | حالات الطوارئ |

---

## المحتوى التعليمي / Educational Content

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/api/lectures` | المحاضرات |
| GET/POST | `/api/lectures-smart` | المحاضرات الذكية (AI) |
| GET/POST/PUT/DELETE | `/api/live-stream` | البث المباشر |
| GET/POST/PUT/DELETE | `/api/recordings` | التسجيلات |
| GET/POST/PUT/DELETE | `/api/elearning` | التعليم الإلكتروني |
| GET/POST/PUT/DELETE | `/api/courses` | الكورسات |
| GET/POST/PUT/DELETE | `/api/curriculum` | المناهج |
| GET/POST/PUT/DELETE | `/api/library` | المكتبة |
| GET/POST/PUT/DELETE | `/api/knowledge-base` | قاعدة المعرفة |
| GET/POST/PUT/DELETE | `/api/videos` | مكتبة الفيديو |
| GET/POST/PUT/DELETE | `/api/gallery` | معرض الصور |
| GET/POST/PUT/DELETE | `/api/homework` | الواجبات |
| GET/POST/PUT/DELETE | `/api/subjects` | المواد الدراسية |
| GET/POST/PUT/DELETE | `/api/schedules` | الجداول الدراسية |

---

## التواصل / Communication

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/api/messages` | الرسائل |
| GET/POST/PUT/DELETE | `/api/inbox` | صندوق الوارد |
| GET/POST/PUT/DELETE | `/api/chat` | المحادثات |
| GET/POST/PUT/DELETE | `/api/announcements` | الإعلانات |
| GET/POST/PUT/DELETE | `/api/notifications` | الإشعارات |
| GET/POST/DELETE | `/api/push-notifications` | الإشعارات الفورية |
| GET/POST/PUT/DELETE | `/api/complaints` | الشكاوى |
| GET/POST/PUT/DELETE | `/api/surveys` | الاستطلاعات |
| GET/POST/PUT/DELETE | `/api/forums` | المنتديات |
| GET/POST/PUT/DELETE | `/api/community` | المجتمع |
| GET/POST | `/api/posts` | المنشورات |
| GET/POST | `/api/follow` | المتابعة |
| GET/POST/PUT/DELETE | `/api/parents-council` | مجلس الآباء |

---

## المالية / Finance

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/api/student-fees` | رسوم الطلاب |
| GET/POST/PUT/DELETE | `/api/payroll` | الرواتب |
| GET/POST/PUT/DELETE | `/api/salaries` | المرتبات |
| GET/POST | `/api/parent-payments` | مدفوعات أولياء الأمور |
| GET | `/api/payment-status` | حالة الدفع |
| GET/POST | `/api/finance` | التقارير المالية |
| GET/POST/PUT/DELETE | `/api/school-invoices` | فواتير المدارس |
| GET/POST/PUT/DELETE | `/api/scholarships` | المنح الدراسية |
| GET/POST/PUT/DELETE | `/api/subscriptions` | الاشتراكات |
| GET | `/api/check-subscription` | التحقق من الاشتراك |

---

## الإدارة / Administration

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/api/classes` | الفصول الدراسية |
| GET/POST/PUT/DELETE | `/api/settings` | إعدادات المدرسة |
| GET/POST/PUT/DELETE | `/api/calendar` | التقويم |
| GET/POST/PUT/DELETE | `/api/meetings` | الاجتماعات |
| GET/POST/PUT/DELETE | `/api/tasks` | المهام |
| GET/POST/PUT/DELETE | `/api/circulars` | التعاميم |
| GET/POST/PUT/DELETE | `/api/certificates` | الشهادات |
| GET/POST/PUT/DELETE | `/api/contracts` | العقود |
| GET/POST/PUT/DELETE | `/api/leaves` | الإجازات |
| GET/POST/PUT/DELETE | `/api/facilities` | المرافق |
| GET/POST/PUT/DELETE | `/api/inventory` | المخزون |
| GET/POST/PUT/DELETE | `/api/security` | سجلات الأمان |
| GET/POST/DELETE | `/api/activity-log` | سجل النشاط |
| GET/POST/DELETE | `/api/backup` | النسخ الاحتياطية |
| GET | `/api/dashboard-stats` | إحصائيات الداشبورد |
| GET | `/api/export?type=students&format=csv` | تصدير البيانات |
| GET | `/api/reports` | التقارير |

---

## المتجر والخدمات / Store & Services

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/api/store` | المتجر المدرسي |
| GET/POST/PUT/DELETE | `/api/cafeteria` | الكافيتيريا |
| GET/POST/PUT | `/api/services` | خدمات المنصة |
| GET/POST/PUT/DELETE | `/api/advertisements` | الإعلانات |

---

## الذكاء الاصطناعي / AI

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET/POST/DELETE | `/api/ai-chat` | المحادثة مع الذكاء الاصطناعي |
| POST | `/api/ai-questions` | توليد أسئلة تلقائية |
| POST | `/api/ai-test` | اختبار نماذج الذكاء الاصطناعي |
| GET/POST | `/api/moderation` | مراقبة المحتوى |

---

## Super Admin فقط

| Method | Endpoint | الوصف |
|--------|----------|-------|
| GET/POST/PUT/DELETE | `/api/schools` | إدارة المدارس |
| GET | `/api/schools-list` | قائمة المدارس العامة |
| GET/POST/PUT/DELETE | `/api/plans` | خطط الاشتراك |
| GET/POST/PUT/DELETE | `/api/features` | ميزات المنصة |
| GET/PUT | `/api/platform-settings` | إعدادات المنصة |
| GET/POST/PUT/DELETE | `/api/partners` | شركاء المنصة |
| GET/POST/PUT/DELETE | `/api/commissions` | العمولات |
| GET/POST/PUT/DELETE | `/api/coupons` | الكوبونات |
| GET/POST | `/api/referrals` | الإحالات |
| GET/POST/DELETE | `/api/error-logs` | سجلات الأخطاء |
| GET/POST/DELETE | `/api/developer-api` | مفاتيح API للمطورين |
| GET/POST/DELETE | `/api/webhooks` | الـ Webhooks |
| GET/POST/PUT/DELETE | `/api/integrations` | التكاملات الخارجية |

---

## نمط الاستجابة / Response Format

### نجاح مع Pagination
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 243,
    "totalPages": 5,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### نجاح بدون Pagination
```json
{ "data": { ... } }
```

### خطأ
```json
{ "error": "رسالة الخطأ بالعربي" }
```

---

## معاملات Pagination

جميع endpoints الداعمة للـ pagination تقبل:

| المعامل | النوع | الافتراضي | الوصف |
|---------|-------|-----------|-------|
| `page` | integer | 1 | رقم الصفحة |
| `limit` | integer | 50 | عدد السجلات في الصفحة (max: 200) |
| `all` | boolean | false | جلب جميع السجلات (للتصدير) |

---

## أكواد الاستجابة / HTTP Status Codes

| الكود | المعنى |
|-------|--------|
| 200 | نجاح |
| 201 | تم الإنشاء |
| 400 | بيانات غير صحيحة |
| 401 | غير مصادق |
| 403 | غير مصرح (صلاحيات) |
| 404 | غير موجود |
| 429 | تجاوز حد الطلبات |
| 500 | خطأ في الخادم |
