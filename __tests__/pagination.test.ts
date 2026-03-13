/**
 * اختبارات Pagination Utility
 * منصة متين
 */
import { getPaginationParams, buildPaginatedResponse } from '../src/lib/pagination';

describe('getPaginationParams', () => {
  it('يجب أن يُعيد القيم الافتراضية', () => {
    const params = new URLSearchParams('');
    const result = getPaginationParams(params);
    expect(result.page).toBe(1);
    expect(result.limit).toBe(50);
    expect(result.offset).toBe(0);
  });

  it('يجب أن يحسب الـ offset بشكل صحيح', () => {
    const params = new URLSearchParams('page=3&limit=20');
    const result = getPaginationParams(params);
    expect(result.page).toBe(3);
    expect(result.limit).toBe(20);
    expect(result.offset).toBe(40); // (3-1) * 20
  });

  it('يجب ألا يتجاوز الـ limit الحد الأقصى 200', () => {
    const params = new URLSearchParams('limit=500');
    const result = getPaginationParams(params);
    expect(result.limit).toBeLessThanOrEqual(200);
  });

  it('يجب أن يُعيد page=1 إذا كانت القيمة سالبة', () => {
    const params = new URLSearchParams('page=-5');
    const result = getPaginationParams(params);
    expect(result.page).toBeGreaterThanOrEqual(1);
  });
});

describe('buildPaginatedResponse', () => {
  const sampleData = [{ id: 1 }, { id: 2 }, { id: 3 }];

  it('يجب أن يُعيد بنية صحيحة', () => {
    const result = buildPaginatedResponse(sampleData, 100, 1, 50);
    expect(result).toHaveProperty('data');
    expect(result).toHaveProperty('pagination');
    expect(result.pagination).toHaveProperty('page');
    expect(result.pagination).toHaveProperty('limit');
    expect(result.pagination).toHaveProperty('total');
    expect(result.pagination).toHaveProperty('totalPages');
    expect(result.pagination).toHaveProperty('hasNext');
    expect(result.pagination).toHaveProperty('hasPrev');
  });

  it('يجب أن يحسب totalPages بشكل صحيح', () => {
    const result = buildPaginatedResponse(sampleData, 100, 1, 50);
    expect(result.pagination.totalPages).toBe(2); // 100 / 50 = 2
  });

  it('hasNext يجب أن يكون true في الصفحة الأولى من 2', () => {
    const result = buildPaginatedResponse(sampleData, 100, 1, 50);
    expect(result.pagination.hasNext).toBe(true);
    expect(result.pagination.hasPrev).toBe(false);
  });

  it('hasPrev يجب أن يكون true في الصفحة الثانية', () => {
    const result = buildPaginatedResponse(sampleData, 100, 2, 50);
    expect(result.pagination.hasPrev).toBe(true);
  });

  it('hasNext يجب أن يكون false في الصفحة الأخيرة', () => {
    const result = buildPaginatedResponse(sampleData, 100, 2, 50);
    expect(result.pagination.hasNext).toBe(false);
  });

  it('يجب أن يُعيد البيانات كما هي', () => {
    const result = buildPaginatedResponse(sampleData, 3, 1, 50);
    expect(result.data).toEqual(sampleData);
    expect(result.data).toHaveLength(3);
  });
});
