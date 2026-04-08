"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SchoolTemplate from "@/components/templates/SchoolTemplate";
import UniversityTemplate from "@/components/templates/UniversityTemplate";
import TrainingTemplate from "@/components/templates/TrainingTemplate";
import QuranTemplate from "@/components/templates/QuranTemplate";

export default function InstitutionPage() {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);
  const [globalAds, setGlobalAds] = useState<any[]>([]);
  const [globalProducts, setGlobalProducts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Fetch Institution Data
        const res = await fetch(`/api/public/institution/${slug}`);
        if (!res.ok) throw new Error("المؤسسة غير موجودة");
        const instData = await res.json();
        setData(instData);

        // 2. Fetch Global Platform Settings (Sultah Olia)
        const settingsRes = await fetch('/api/public/platform-settings');
        if (settingsRes.ok) {
          const settings = await settingsRes.json();
          setGlobalAds(settings.global_ads || []);
          setGlobalProducts(settings.global_store || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(setLoading(false) as any);
      }
    }
    if (slug) fetchData();
  }, [slug]);

  if (loading) return <div style={{ background: '#06060E', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>جارٍ التحميل...</div>;
  if (error || !data) return <div style={{ background: '#06060E', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>{error || "حدث خطأ ما"}</div>;

  // Template Selection Logic based on institution_type
  const type = data.institution_type?.toLowerCase();

  if (type === 'school') {
    return <SchoolTemplate data={data} globalAds={globalAds} globalProducts={globalProducts} />;
  } else if (type === 'university') {
    return <UniversityTemplate data={data} globalAds={globalAds} globalProducts={globalProducts} />;
  } else if (type === 'training' || type === 'center') {
    return <TrainingTemplate data={data} globalAds={globalAds} globalProducts={globalProducts} />;
  } else if (type === 'quran' || type === 'mosque') {
    return <QuranTemplate data={data} globalAds={globalAds} globalProducts={globalProducts} />;
  }

  // Default Fallback Template (Original Style)
  return (
    <div style={{ padding: '100px', textAlign: 'center', background: '#06060E', color: '#fff', minHeight: '100vh' }}>
      <h1>{data.name}</h1>
      <p>{data.description}</p>
      <div style={{ marginTop: '20px', color: '#D4A843' }}>قالب افتراضي - يرجى تحديد نوع المؤسسة</div>
    </div>
  );
}
