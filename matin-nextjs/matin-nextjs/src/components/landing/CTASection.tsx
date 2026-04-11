"use client";

export default function CTASection() {
  return (
    <section className="py-20 lg:py-28 px-[5%] text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,168,67,0.05)_0%,transparent_70%)] pointer-events-none" />
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 leading-tight">
        جاهز لتحويل
        <br />
        <span className="text-gold">مؤسستك التعليمية؟</span>
      </h2>
      <p className="text-sm lg:text-[17px] text-txt-dim max-w-md mx-auto mb-10 leading-relaxed">
        انضم لأكثر من 47 مؤسسة تعليمية في المملكة تثق بمتين.
      </p>
      <div className="flex gap-4 justify-center flex-wrap">
        <a
          href="#"
          className="bg-gradient-to-br from-gold to-gold-light rounded-xl px-8 py-4 text-[#06060E] font-extrabold text-base shadow-lg shadow-gold/30 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/45 transition-all duration-200"
        >
          ابدأ تجربتك المجانية
        </a>
        <a
          href="#"
          className="bg-white/5 border border-bdr rounded-xl px-7 py-4 text-txt font-semibold text-base hover:bg-white/[0.09] hover:border-white/[0.15] transition-all duration-200"
        >
          تحدث مع فريقنا
        </a>
      </div>
    </section>
  );
}
