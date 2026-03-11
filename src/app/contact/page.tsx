import Link from "next/link";

export default function Contact() {
  return (
    <div className="min-h-screen bg-black text-white" dir="rtl">
      <header className="bg-black/90 border-b border-amber-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-3xl font-bold text-amber-500">متين</Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/" className="hover:text-amber-500">الرئيسية</Link>
            <Link href="/community" className="hover:text-amber-500">المجتمع</Link>
            <Link href="/store" className="hover:text-amber-500">المتجر</Link>
            <Link href="/pricing" className="hover:text-amber-500">الأسعار</Link>
            <Link href="/contact" className="text-amber-500">تواصل معنا</Link>
          </nav>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-center mb-4">تواصل <span className="text-amber-500">معنا</span></h1>
        <p className="text-center text-gray-400 mb-12">نسعد بتواصلكم</p>
        
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-2xl p-8">
            <div className="space-y-6">
              <div>
                <label className="block mb-2 font-bold">الاسم</label>
                <input type="text" className="w-full bg-gray-800 rounded-lg p-3 text-white" placeholder="اسمك الكامل" />
              </div>
              <div>
                <label className="block mb-2 font-bold">البريد الإلكتروني</label>
                <input type="email" className="w-full bg-gray-800 rounded-lg p-3 text-white" placeholder="email@example.com" />
              </div>
              <div>
                <label className="block mb-2 font-bold">الرسالة</label>
                <textarea className="w-full bg-gray-800 rounded-lg p-3 text-white resize-none" rows={5} placeholder="اكتب رسالتك هنا..." />
              </div>
              <button className="w-full bg-amber-500 text-black py-3 rounded-lg font-bold hover:bg-amber-400">إرسال</button>
            </div>
          </div>
          
          <div className="mt-8 text-center space-y-2">
            <p className="text-gray-400">📧 rakanshalal@gmail.com</p>
            <p className="text-gray-400">📱 +966 50 000 0000</p>
            <p className="text-gray-400">📍 الرياض، المملكة العربية السعودية</p>
          </div>
        </div>
      </div>
    </div>
  );
}
