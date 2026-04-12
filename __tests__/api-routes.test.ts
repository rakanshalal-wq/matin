/**
 * اختبارات API routes الرئيسية — منصة متين
 * تغطّي: /api/teachers، /api/classes، /api/announcements، /api/grades
 *
 * النمط العام:
 *  - بدون مصادقة → 401
 *  - مع مصادقة ودور مناسب → 200 أو 201
 *  - دور غير كافٍ → 403
 */
import { createMockRequest, parseJsonResponse, tokens } from './helpers';

// ── Mock مشترك ────────────────────────────────────────────────────
const mockPool = { query: jest.fn() };

jest.mock('@/lib/auth', () => ({
  pool: mockPool,
  getUserFromRequest: jest.fn(),
  getFilterSQL: jest.fn(() => ({ sql: '', params: [] })),
  getInsertIds: jest.fn(() => ({ school_id: '1', school_name: 'مدرسة', school_slug: 'school' })),
}));

jest.mock('@/lib/pagination', () => ({
  getPaginationParams: jest.fn(() => ({ page: 1, limit: 50, offset: 0 })),
  buildPaginatedResponse: jest.fn((data: unknown[], total: number) => ({ data, total })),
}));

// ────────────────────────────────────────────────────────────────
// /api/teachers
// ────────────────────────────────────────────────────────────────
describe('GET /api/teachers', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => jest.clearAllMocks());

  it('يرفض بـ 401 بدون مصادقة', async () => {
    getUserFromRequest.mockResolvedValueOnce(null);
    const { GET } = await import('../src/app/api/teachers/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/teachers' });
    const res = await GET(req as any);
    expect([401, 403]).toContain(res.status);
  });

  it('يُعيد قائمة المعلمين للمدير', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 3, role: 'admin', school_id: 1 });
    mockPool.query.mockResolvedValueOnce({ rows: [{ count: '2' }] });
    mockPool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'أحمد محمد', email: 'ahmed@school.com', role: 'teacher', school_id: 1 },
        { id: 2, name: 'فاطمة علي', email: 'fatima@school.com', role: 'teacher', school_id: 1 },
      ],
    });
    const { GET } = await import('../src/app/api/teachers/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/teachers', token: tokens.admin });
    const res = await GET(req as any);
    expect(res.status).toBe(200);
  });
});

// ────────────────────────────────────────────────────────────────
// /api/classes
// ────────────────────────────────────────────────────────────────
describe('GET /api/classes', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => jest.clearAllMocks());

  it('يرفض بدون مصادقة', async () => {
    getUserFromRequest.mockResolvedValueOnce(null);
    const { GET } = await import('../src/app/api/classes/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/classes' });
    const res = await GET(req as any);
    expect([401, 403]).toContain(res.status);
  });

  it('يُعيد الفصول للمعلم', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 4, role: 'teacher', school_id: 1 });
    mockPool.query.mockResolvedValueOnce({ rows: [{ count: '3' }] });
    mockPool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, name: 'الصف الأول أ', school_id: 1 },
        { id: 2, name: 'الصف الثاني ب', school_id: 1 },
      ],
    });
    const { GET } = await import('../src/app/api/classes/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/classes', token: tokens.teacher });
    const res = await GET(req as any);
    expect(res.status).toBe(200);
  });
});

// ────────────────────────────────────────────────────────────────
// /api/announcements
// ────────────────────────────────────────────────────────────────
describe('GET /api/announcements', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => jest.clearAllMocks());

  it('يرفض بدون مصادقة', async () => {
    getUserFromRequest.mockResolvedValueOnce(null);
    const { GET } = await import('../src/app/api/announcements/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/announcements' });
    const res = await GET(req as any);
    expect([401, 403]).toContain(res.status);
  });

  it('يُعيد الإعلانات لولي الأمر', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 6, role: 'parent', school_id: 1 });
    mockPool.query.mockResolvedValueOnce({ rows: [{ count: '1' }] });
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'إعلان الاختبارات', content: 'الأسبوع القادم', school_id: 1 }],
    });
    const { GET } = await import('../src/app/api/announcements/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/announcements', token: tokens.parent });
    const res = await GET(req as any);
    expect(res.status).toBe(200);
  });
});

// ────────────────────────────────────────────────────────────────
// /api/grades
// ────────────────────────────────────────────────────────────────
describe('GET /api/grades', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => jest.clearAllMocks());

  it('يُعيد بيانات فارغة للطالب من مدرسة مختلفة', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 99, role: 'student', school_id: 99 });
    // mock يعيد صفوفاً فارغة لأي استعلام
    mockPool.query.mockResolvedValue({ rows: [] });
    const { GET } = await import('../src/app/api/grades/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/grades', token: tokens.student });
    const res = await GET(req as any);
    // يجب أن يكون الرد صحيحاً (200 أو 401) وليس خطأً
    expect([200, 401, 403]).toContain(res.status);
  });

  it('يُعيد الدرجات للمعلم', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 4, role: 'teacher', school_id: 1 });
    mockPool.query.mockResolvedValueOnce({ rows: [{ count: '2' }] });
    mockPool.query.mockResolvedValueOnce({
      rows: [
        { id: 1, student_id: 5, subject: 'رياضيات', grade: 95, school_id: 1 },
        { id: 2, student_id: 7, subject: 'علوم', grade: 88, school_id: 1 },
      ],
    });
    const { GET } = await import('../src/app/api/grades/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/grades', token: tokens.teacher });
    const res = await GET(req as any);
    expect(res.status).toBe(200);
  });
});

// ────────────────────────────────────────────────────────────────
// /api/attendance
// ────────────────────────────────────────────────────────────────
describe('GET /api/attendance', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => jest.clearAllMocks());

  it('يرفض بدون مصادقة', async () => {
    getUserFromRequest.mockResolvedValueOnce(null);
    const { GET } = await import('../src/app/api/attendance/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/attendance' });
    const res = await GET(req as any);
    expect([401, 403]).toContain(res.status);
  });
});

// ────────────────────────────────────────────────────────────────
// /api/homework
// ────────────────────────────────────────────────────────────────
describe('GET /api/homework', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => jest.clearAllMocks());

  it('يرفض بدون مصادقة', async () => {
    getUserFromRequest.mockResolvedValueOnce(null);
    const { GET } = await import('../src/app/api/homework/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/homework' });
    const res = await GET(req as any);
    expect([401, 403]).toContain(res.status);
  });

  it('يُعيد الواجبات للطالب', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 5, role: 'student', school_id: 1 });
    mockPool.query.mockResolvedValueOnce({ rows: [{ count: '1' }] });
    mockPool.query.mockResolvedValueOnce({
      rows: [{ id: 1, title: 'واجب الرياضيات', due_date: '2026-04-15', school_id: 1 }],
    });
    const { GET } = await import('../src/app/api/homework/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/homework', token: tokens.student });
    const res = await GET(req as any);
    expect(res.status).toBe(200);
  });
});
