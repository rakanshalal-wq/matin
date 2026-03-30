'use client';
// Helper لإرسال طلبات API مع التوكن
export function getHeaders(): Record<string, string> {
  try {
    const token = localStorage.getItem('matin_token');
    if (token) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };
    }
    // توافق مؤقت مع النظام القديم
    const user = JSON.parse(localStorage.getItem('matin_user') || '{}');
    return {
      'Content-Type': 'application/json',
      'x-user-id': String(user.id || ''),
    };
  } catch {
    return { 'Content-Type': 'application/json' };
  }
}

export async function apiFetch(url: string, options?: RequestInit) {
  const headers = { ...getHeaders(), ...(options?.headers || {}) };
  return fetch(url, { ...options, headers });
}
