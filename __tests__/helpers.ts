/**
 * مساعدات الاختبار — منصة متين
 */
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'matin_secret_2024';

// إنشاء JWT token وهمي لأغراض الاختبار
export function createTestToken(payload: {
  id?: number;
  email?: string;
  role?: string;
  school_id?: number;
}) {
  return jwt.sign(
    {
      id: payload.id ?? 1,
      email: payload.email ?? 'test@matin.ink',
      role: payload.role ?? 'admin',
      school_id: payload.school_id ?? 1,
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// إنشاء Request وهمي
export function createMockRequest(options: {
  method?: string;
  url?: string;
  body?: Record<string, unknown>;
  token?: string;
  searchParams?: Record<string, string>;
}): Request {
  const {
    method = 'GET',
    url = 'http://localhost:3000/api/test',
    body,
    token,
    searchParams,
  } = options;

  let fullUrl = url;
  if (searchParams) {
    const params = new URLSearchParams(searchParams);
    fullUrl = `${url}?${params.toString()}`;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return new Request(fullUrl, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
}

// التحقق من استجابة JSON
export async function parseJsonResponse(response: Response) {
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

// Tokens جاهزة للاستخدام
export const tokens = {
  superAdmin: createTestToken({ id: 1, role: 'super_admin', email: 'admin@matin.ink' }),
  owner: createTestToken({ id: 2, role: 'owner', email: 'owner@school.com', school_id: 1 }),
  admin: createTestToken({ id: 3, role: 'admin', email: 'admin@school.com', school_id: 1 }),
  teacher: createTestToken({ id: 4, role: 'teacher', email: 'teacher@school.com', school_id: 1 }),
  student: createTestToken({ id: 5, role: 'student', email: 'student@school.com', school_id: 1 }),
  parent: createTestToken({ id: 6, role: 'parent', email: 'parent@school.com', school_id: 1 }),
};
