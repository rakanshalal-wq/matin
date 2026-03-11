'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <div className="bg-gradient-to-l from-blue-700 to-indigo-800 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold mb-4">شروط الخدمة</h1>
          <p className="text-blue-200">آخر تحديث: مارس 2026</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">1. مقدمة</h2>
            <p className="text-gray-700 leading-relaxed">
              مرحباً بك في منصة متين التعليمية. باستخدامك لهذه المنصة، فإنك توافق على الالتزام بهذه الشروط والأحكام. إذا كنت لا توافق على أي من هذه الشروط، يرجى عدم استخدام المنصة. تحتفظ منصة متين بالحق في تعديل هذه الشروط في أي وقت مع إشعار المستخدمين بالتغييرات.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">2. وصف الخدمة</h2>
            <p className="text-gray-700 leading-relaxed">
              منصة متين هي نظام إدارة تعليمي شامل (SaaS) يوفر أدوات لإدارة المؤسسات التعليمية بما في ذلك: إدارة الطلاب والمعلمين، الحضور والغياب، الاختبارات والدرجات، الجداول الدراسية، المكتبة الرقمية، نظام النقل، المتجر الإلكتروني، والتواصل بين أطراف العملية التعليمية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">3. التسجيل والحسابات</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>يجب أن تكون المعلومات المقدمة عند التسجيل صحيحة ودقيقة</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>أنت مسؤول عن الحفاظ على سرية بيانات الدخول الخاصة بك</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>يجب إبلاغنا فوراً في حال الاشتباه بأي استخدام غير مصرح به</span></li>
              <li className="flex items-start gap-2"><span className="text-blue-600 mt-1">●</span><span>يحق لنا تعليق أو إلغاء الحسابات التي تنتهك هذه الشروط</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">4. الاشتراكات والدفع</h2>
            <p className="text-gray-700 leading-relaxed">
              تقدم المنصة باقات اشتراك مختلفة (أساسية مجانية، متقدمة، مؤسسية). الاشتراكات المدفوعة تتجدد تلقائياً ما لم يتم إلغاؤها قبل تاريخ التجديد. يمكن الترقية أو التخفيض في أي وقت مع احتساب الفرق بشكل تناسبي. لا يتم استرداد المبالغ المدفوعة إلا في حالات استثنائية وفق تقديرنا.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">5. الاستخدام المقبول</h2>
            <p className="text-gray-700 leading-relaxed mb-4">يُحظر استخدام المنصة في:</p>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start gap-2"><span className="text-red-600 mt-1">✗</span><span>أي نشاط غير قانوني أو مخالف للأنظمة السعودية</span></li>
              <li className="flex items-start gap-2"><span className="text-red-600 mt-1">✗</span><span>نشر محتوى مسيء أو غير لائق</span></li>
              <li className="flex items-start gap-2"><span className="text-red-600 mt-1">✗</span><span>محاولة اختراق أو تعطيل المنصة</span></li>
              <li className="flex items-start gap-2"><span className="text-red-600 mt-1">✗</span><span>مشاركة بيانات الدخول مع أطراف غير مصرح لها</span></li>
              <li className="flex items-start gap-2"><span className="text-red-600 mt-1">✗</span><span>استخدام المنصة لأغراض تجارية غير مرتبطة بالتعليم</span></li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">6. الملكية الفكرية</h2>
            <p className="text-gray-700 leading-relaxed">
              جميع حقوق الملكية الفكرية للمنصة (الكود، التصميم، العلامة التجارية، المحتوى) مملوكة لشركة متين. المحتوى الذي ينشئه المستخدمون (اختبارات، مواد تعليمية) يبقى ملكاً لهم مع منح المنصة ترخيصاً محدوداً لعرضه وتخزينه. لا يحق للمستخدم نسخ أو إعادة توزيع أي جزء من المنصة.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">7. مستوى الخدمة (SLA)</h2>
            <p className="text-gray-700 leading-relaxed">
              نسعى لتوفير المنصة بنسبة تشغيل 99.9%. قد تحدث فترات صيانة مجدولة مع إشعار مسبق. لا نتحمل المسؤولية عن الانقطاعات الناتجة عن أسباب خارجة عن إرادتنا (كوارث طبيعية، مشاكل مزودي الخدمة).
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">8. حدود المسؤولية</h2>
            <p className="text-gray-700 leading-relaxed">
              المنصة مقدمة &quot;كما هي&quot; دون ضمانات صريحة أو ضمنية. لا نتحمل المسؤولية عن أي أضرار مباشرة أو غير مباشرة ناتجة عن استخدام المنصة، بما في ذلك فقدان البيانات أو الأرباح، وذلك في الحدود التي يسمح بها النظام.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">9. إنهاء الخدمة</h2>
            <p className="text-gray-700 leading-relaxed">
              يحق لك إلغاء حسابك في أي وقت. عند الإلغاء، سيتم حذف بياناتك خلال 30 يوماً مع إمكانية تصدير البيانات قبل الحذف. يحق لنا إنهاء أو تعليق حسابك في حالة انتهاك هذه الشروط.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">10. القانون الحاكم</h2>
            <p className="text-gray-700 leading-relaxed">
              تخضع هذه الشروط لأنظمة المملكة العربية السعودية. أي نزاع ينشأ عن استخدام المنصة يتم حله ودياً أولاً، وفي حال عدم التوصل لحل يُحال إلى الجهات القضائية المختصة في المملكة العربية السعودية.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 border-r-4 border-blue-600 pr-4">11. التواصل</h2>
            <p className="text-gray-700 leading-relaxed">
              لأي استفسارات حول شروط الخدمة، يرجى التواصل معنا عبر البريد الإلكتروني: legal@matin.ink أو عبر نموذج التواصل في الموقع.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
