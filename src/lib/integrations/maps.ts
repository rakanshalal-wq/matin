/**
 * src/lib/integrations/maps.ts
 * تكامل Google Maps لتتبع GPS وعرض الخرائط
 * المتغيرات المطلوبة: GOOGLE_MAPS_API_KEY, NEXT_PUBLIC_GOOGLE_MAPS_KEY
 */

// إرجاع مفتاح Google Maps للاستخدام في الـ frontend
export function getGoogleMapsKey(): string {
  return process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_KEY || '';
}

// التحقق من أن Google Maps مهيأ
export function isGoogleMapsConfigured(): boolean {
  return !!(process.env.GOOGLE_MAPS_API_KEY || process.env.GOOGLE_MAPS_KEY);
}

// حساب المسافة بين نقطتين (بالمتر) باستخدام صيغة Haversine
export function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371000; // نصف قطر الأرض بالمتر
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// التحقق من أن موقعاً داخل منطقة آمنة
export function isInsideSafeZone(
  lat: number, lon: number,
  zoneLat: number, zoneLon: number,
  radiusMeters: number
): boolean {
  return calculateDistance(lat, lon, zoneLat, zoneLon) <= radiusMeters;
}

// بناء رابط صورة الخريطة الثابتة (Static Map URL)
export function buildStaticMapUrl(lat: number, lon: number, zoom = 15, size = '400x300'): string {
  const key = getGoogleMapsKey();
  if (!key) return '';
  return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=${zoom}&size=${size}&markers=${lat},${lon}&key=${key}`;
}

// الحصول على عنوان نصي من إحداثيات (Reverse Geocoding)
export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  const key = getGoogleMapsKey();
  if (!key) return null;

  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${key}&language=ar`
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results[0].formatted_address;
    }
    return null;
  } catch {
    return null;
  }
}
