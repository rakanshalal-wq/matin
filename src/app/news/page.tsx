'use client';

/* MATIN DESIGN SYSTEM — News Page (Dynamic)
   يجلب الأخبار ديناميكياً من /api/public/news */

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, Loader2 } from "lucide-react";

function useScrollAnimation() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("visible"); }); },
      { threshold: 0.1 }
    );
    document.querySelectorAll(".fade-in-up").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

interface NewsItem {
  id: number;
  title: string;
  description?: string;
  category?: string;
  image_url?: string;
  created_at?: string;
  color?: string;
}

function getCategoryColor(category?: string): string {
  const map: Record<string, string> = {
    'إطلاق': '#D4A843',
    'شراكة': '#22C55E',
    'تكامل': '#60A5FA',
    'تقنية': '#F97316',
    'حكومي': '#A78BFA',
    'تحديث': '#EC4899',
  };
  return category ? (map[category] || '#D4A843') : '#D4A843';
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('ar-SA', { year: 'numeric', month: 'long' });
  } catch {
    return dateStr;
  }
}

export default function News() {
  useScrollAnimation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/public/news')
      .then(res => res.json())
      .then(data => {
        const items = data.news || data;
        if (Array.isArray(items) && items.length > 0) {
          setNews(items);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <Navbar />

      <section className="pt-32 pb-16 page-hero">
        <div className="container text-center">
          <span className="section-label mb-6 inline-flex">الأخبار</span>
          <h1 className="text-4xl md:text-6xl font-black text-white mt-4 mb-6">
            آخر <span className="text-gold-gradient">أخبار متين</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            تابع أحدث المستجدات والإعلانات من منصة متين التعليمية.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={32} className="animate-spin" style={{ color: '#D4A843' }} />
              <span className="mr-3 text-gray-400">جاري تحميل الأخبار...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item, i) => {
                const color = item.color || getCategoryColor(item.category);
                return (
                  <div key={item.id || i} className="matin-card p-6 fade-in-up" style={{ transitionDelay: `${i * 80}ms` }}>
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-40 object-cover rounded-xl mb-4"
                      />
                    )}
                    <div className="flex items-center gap-3 mb-4">
                      {item.category && (
                        <span
                          className="text-xs font-bold px-3 py-1 rounded-full"
                          style={{ background: `${color}15`, color }}
                        >
                          {item.category}
                        </span>
                      )}
                      {item.created_at && (
                        <span className="text-gray-600 text-xs flex items-center gap-1">
                          <Calendar size={12} />
                          {formatDate(item.created_at)}
                        </span>
                      )}
                    </div>
                    <h3 className="text-white font-bold mb-3 leading-snug">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
