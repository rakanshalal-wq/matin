/**
 * اختبارات المصادقة — /api/auth
 * منصة متين
 */
import { createMockRequest, parseJsonResponse } from './helpers';

// Mock قاعدة البيانات
jest.mock('@/lib/auth', () => ({
  pool: {
    query: jest.fn(),
  },
  getUserFromRequest: jest.fn(),
  getFilterSQL: jest.fn(() => ({ sql: '', params: [] })),
  getInsertIds: jest.fn(() => ({ school_id: '1', school_name: 'مدرسة تجريبية', school_slug: 'test' })),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('POST /api/auth — تسجيل الدخول', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('يجب أن يرفض الطلب بدون بيانات', async () => {
    const { POST } = await import('../src/app/api/auth/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth',
      body: {},
    });
    const res = await POST(req as any);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });

  it('يجب أن يرفض بريد إلكتروني غير صحيح', async () => {
    const { POST } = await import('../src/app/api/auth/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth',
      body: { email: 'not-an-email', password: '123456' },
    });
    const res = await POST(req as any);
    const data = await parseJsonResponse(res);
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(data).toHaveProperty('error');
  });

  it('يجب أن يرفض مستخدم غير موجود', async () => {
    const { pool } = await import('@/lib/auth');
    (pool.query as jest.Mock).mockResolvedValueOnce({ rows: [] });

    const { POST } = await import('../src/app/api/auth/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/auth',
      body: { email: 'notexist@test.com', password: 'Password123!' },
    });
    const res = await POST(req as any);
    expect(res.status).toBeGreaterThanOrEqual(400);
  });
});
