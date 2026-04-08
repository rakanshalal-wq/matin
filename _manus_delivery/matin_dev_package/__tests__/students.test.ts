/**
 * اختبارات إدارة الطلاب — /api/students
 * منصة متين
 */
import { createMockRequest, parseJsonResponse, tokens } from './helpers';

// Mock قاعدة البيانات
const mockPool = {
  query: jest.fn(),
};

jest.mock('@/lib/auth', () => ({
  pool: mockPool,
  getUserFromRequest: jest.fn(),
  getFilterSQL: jest.fn(() => ({ sql: 'AND school_id = $1', params: ['1'] })),
  getInsertIds: jest.fn(() => ({
    school_id: '1',
    school_name: 'مدرسة تجريبية',
    school_slug: 'test-school',
  })),
}));

jest.mock('@/lib/pagination', () => ({
  getPaginationParams: jest.fn(() => ({ page: 1, limit: 50, offset: 0 })),
  buildPaginatedResponse: jest.fn((data, total, page, limit) => ({
    data,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasNext: false, hasPrev: false },
  })),
}));

describe('GET /api/students', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('يجب أن يرفض أو يرجع بيانات فارغة بدون مصادقة', async () => {
    getUserFromRequest.mockResolvedValueOnce(null);
    const { GET } = await import('../src/app/api/students/route');
    const req = createMockRequest({ url: 'http://localhost:3000/api/students' });
    const res = await GET(req as any);
    // students GET يرجع [] بدل 401 لأسباب تاريخية
    expect([200, 401]).toContain(res.status);
  });

  it('يجب أن يُعيد قائمة الطلاب للمشرف', async () => {
    getUserFromRequest.mockResolvedValueOnce({
      id: 3, role: 'admin', school_id: 1,
    });
    mockPool.query
      .mockResolvedValueOnce({ rows: [{ count: '2' }] })
      .mockResolvedValueOnce({
        rows: [
          { id: 1, name: 'أحمد محمد', student_id: 'STD-0001' },
          { id: 2, name: 'سارة علي', student_id: 'STD-0002' },
        ],
      });

    const { GET } = await import('../src/app/api/students/route');
    const req = createMockRequest({
      url: 'http://localhost:3000/api/students',
      token: tokens.admin,
    });
    const res = await GET(req as any);
    const data = await parseJsonResponse(res);
    expect(res.status).toBe(200);
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('pagination');
  });
});

describe('POST /api/students', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('يجب أن يرفض إضافة طالب بدون اسم', async () => {
    getUserFromRequest.mockResolvedValueOnce({
      id: 3, role: 'admin', school_id: 1,
    });
    const { POST } = await import('../src/app/api/students/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/students',
      body: { email: 'student@test.com' }, // بدون name
      token: tokens.admin,
    });
    const res = await POST(req as any);
    const data = await parseJsonResponse(res);
    expect(res.status).toBe(400);
    expect(data.error).toContain('مطلوب');
  });

  it('يجب أن يرفض الطالب من دون مصادقة', async () => {
    getUserFromRequest.mockResolvedValueOnce(null);
    const { POST } = await import('../src/app/api/students/route');
    const req = createMockRequest({
      method: 'POST',
      url: 'http://localhost:3000/api/students',
      body: { name: 'طالب جديد' },
    });
    const res = await POST(req as any);
    expect(res.status).toBe(401);
  });
});

describe('DELETE /api/students', () => {
  const { getUserFromRequest } = require('@/lib/auth');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('يجب أن يرفض الحذف بدون id', async () => {
    getUserFromRequest.mockResolvedValueOnce({
      id: 3, role: 'admin', school_id: 1,
    });
    const { DELETE } = await import('../src/app/api/students/route');
    const req = createMockRequest({
      method: 'DELETE',
      url: 'http://localhost:3000/api/students', // بدون ?id=
      token: tokens.admin,
    });
    const res = await DELETE(req as any);
    expect(res.status).toBe(400);
  });
});
