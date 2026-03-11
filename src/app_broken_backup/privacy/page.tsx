'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">سياسة الخصوصية</h1>
          <p className="text-blue-200">آخر تحديث: مارس 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">1. مقدمة</h2>
            <p className="text-gray-700 leading-relaxed">
              نحن في منصة متين نلتزم بحماية خصوصية مستخدمينا وبياناتهم الشخصية. توضح هذه السياسة كيفية جمع واستخدام وحماية المعلومات الشخصية التي تقدمها لنا عند استخدام منصتنا التعليمية. نحن نتوافق مع نظام حماية البيانات الشخصية في المملكة العربية السعودية (PDPL) وجميع الأنظمة واللوائح ذات الصلة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">2. البيانات التي نجمعها</h2>
            <p className="text-gray-700 leading-relaxed mb-4">نجمع الأنواع التالية من البيانات:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span><strong>بيانات التسجيل:</strong> الاسم الكامل، البريد الإلكتروني، رقم الهاتف، الدور الوظيفي.</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span><strong>بيانات المؤسسة:</strong> اسم المدرسة/المؤسسة، العنوان، رقم الترخيص.</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span><strong>بيانات الطلاب:</strong> الاسم، تاريخ الميلاد، الصف، الدرجات، سجل الحضور.</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span><strong>بيانات الاستخدام:</strong> سجلات الدخول، النشاط على المنصة، عنوان IP.</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span><strong>بيانات الدفع:</strong> معلومات الفوترة (لا نخزن بيانات البطاقات مباشرة).</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">3. كيف نستخدم بياناتك</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>تقديم خدمات المنصة التعليمية وتحسينها</span></li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>إدارة حسابات المستخدمين والمصادقة</span></li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>إرسال إشعارات مهمة متعلقة بالخدمة</span></li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>تحليل الأداء الأكاديمي وإنشاء التقارير</span></li>
              <li className="flex items-start gap-2"><span className="text-green-600 mt-1">✓</span><span>الامتثال للمتطلبات القانونية والتنظيمية</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">4. حماية البيانات</h2>
            <p className="text-gray-700 leading-relaxed">
              نستخدم أعلى معايير الأمان لحماية بياناتك، بما في ذلك تشفير AES-256 للبيانات المخزنة، وبروتوكول HTTPS/TLS لنقل البيانات، ونظام JWT للمصادقة، وحماية CSRF، ونظام Rate Limiting لمنع الهجمات. جميع البيانات مخزنة في سيرفرات آمنة مع نسخ احتياطية يومية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">5. مشاركة البيانات</h2>
            <p className="text-gray-700 leading-relaxed">
              لا نبيع أو نشارك بياناتك الشخصية مع أطراف ثالثة لأغراض تسويقية. قد نشارك البيانات فقط مع: مقدمي الخدمات الموثوقين (بوابات الدفع، خدمات الرسائل)، الجهات الحكومية عند الطلب القانوني، ومع المؤسسة التعليمية التي تنتمي إليها.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">6. حقوقك</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>الحق في الوصول إلى بياناتك الشخصية</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>الحق في تصحيح البيانات غير الدقيقة</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>الحق في حذف بياناتك (مع مراعاة الالتزامات القانونية)</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>الحق في تصدير بياناتك بصيغة قابلة للقراءة</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>الحق في الاعتراض على معالجة بياناتك</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">7. ملفات تعريف الارتباط (Cookies)</h2>
            <p className="text-gray-700 leading-relaxed">
              نستخدم ملفات تعريف الارتباط الضرورية لتشغيل المنصة وتحسين تجربة المستخدم. يمكنك التحكم في إعدادات الكوكيز من خلال متصفحك.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">8. التواصل معنا</h2>
            <p className="text-gray-700 leading-relaxed">
              لأي استفسارات حول سياسة الخصوصية أو لممارسة حقوقك، يرجى التواصل معنا عبر البريد الإلكتروني: privacy@matin.ink أو عبر نموذج التواصل في الموقع.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
