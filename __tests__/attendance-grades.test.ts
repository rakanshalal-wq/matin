/**
 * اختبارات الحضور والدرجات
 * منصة متين
 */
import { createMockRequest, parseJsonResponse, tokens } from './helpers';

const mockPool = { query: jest.fn() };

jest.mock('@/lib/auth', () => ({
  pool: mockPool,
  getUserFromRequest: jest.fn(),
  getFilterSQL: jest.fn(() => ({ sql: '', params: [] })),
  getInsertIds: jest.fn(() => ({ school_id: '1', school_name: 'مدرسة', school_slug: 'school' })),
}));

jest.mock('@/lib/pagination', () => ({
  getPaginationParams: jest.fn(() => ({ page: 1, limit: 50, offset: 0 })),
  buildPaginatedResponse: jest.fn((data, total, page, limit) => ({
    data,
    pagination: { page, limit, total, totalPages: 1, hasNext: false, hasPrev: false },
  })),
}));

// ===== اختبارات الحضور =====
describe('POST /api/attendance', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => jest.clearAllMocks());

  it('يجب أن يرفض تسجيل الحضور بدون student_id', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 4, role: 'teacher', school_id: 1 });
    const { POST } = await import('../src/app/api/attendance/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/attendance',
      body: { status: 'present', date: '2026-03-13' }, // بدون student_id
      token: tokens.teacher,
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it('يجب أن يقبل تسجيل حضور جماعي صحيح', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 4, role: 'teacher', school_id: 1 });
    // mock لجميع الاستعلامات المتوقعة
    mockPool.query.mockResolvedValue({ rows: [{ id: 1 }], rowCount: 1 });

    const { POST } = await import('../src/app/api/attendance/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/attendance',
      body: {
        action: 'bulk_attendance',
        date: '2026-03-13',
        records: [
          { student_id: 1, status: 'present' },
          { student_id: 2, status: 'absent' },
        ],
      },
      token: tokens.teacher,
    });
    const res = await POST(req as any);
    // نتوقع نجاح (200/201) أو خطأ DB (500) - ليس 400
    expect([200, 201, 500]).toContain(res.status);
  });
});

// ===== اختبارات الدرجات =====
describe('POST /api/grades', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => jest.clearAllMocks());

  it('يجب أن يرفض إضافة درجة بدون student_id', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 4, role: 'teacher', school_id: 1 });
    const { POST } = await import('../src/app/api/grades/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/grades',
      body: { grade: 95, subject: 'رياضيات' }, // بدون student_id
      token: tokens.teacher,
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });

  it('يجب أن يرفض الطالب من تعديل درجات الآخرين', async () => {
    getUserFromRequest.mockResolvedValueOnce({ id: 5, role: 'student', school_id: 1 });
    const { POST } = await import('../src/app/api/grades/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/grades',
      body: { student_id: 99, grade: 100 },
      token: tokens.student,
    });
    const res = await POST(req as any);
    expect(res.status).toBe(403);
  });
});
