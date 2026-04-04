// api.ts - يُرسل الـ cookies تلقائياً مع كل request (httpOnly)
// لا نحتاج Authorization header لأن الـ cookies تُرسل مع كل request

export function getHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
  };
}

export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<{ data: T | null; error: string | null }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers as Record<string, string>),
      },
    });

    if (res.status === 401) {
      window.location.href = '/login';
      return { data: null, error: 'غير مخوّل' };
    }

    const data = await res.json();

    if (!res.ok) {
      return { data: null, error: data.message || data.error || 'حدث خطأ' };
    }

    return { data: data as T, error: null };
  } catch (err) {
    return { data: null, error: (err as Error).message || 'خطأ في الاتصال' };
  }
}
