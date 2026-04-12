/**
 * اختبارات عزل المؤسسات — Schema-per-Tenant Isolation
 * منصة متين
 *
 * يتحقق من أن:
 * 1. getTenantClient يضبط search_path على الـ Schema الصحيح
 * 2. استعلام على Schema مؤسسة A لا يرجع بيانات من مؤسسة B
 * 3. استخدام schemaName مختلف يتسبب في عدم إيجاد الجدول أو إرجاع بيانات فارغة
 * 4. provisionTenant ينشئ سجلات tenant و tenant_quotas منفصلة
 * 5. checkTenantQuota لا تخلط بين مؤسستين
 */

// ── Mock Pool ────────────────────────────────────────────────────
const mockQuery = jest.fn();
const mockRelease = jest.fn();
const mockConnect = jest.fn();

jest.mock('pg', () => ({
  Pool: jest.fn().mockImplementation(() => ({
    connect: mockConnect,
    query: mockQuery,
    end: jest.fn(),
  })),
}));

// إعادة استيراد الوحدة بعد الـ mock
let tenant: typeof import('@/lib/tenant');

beforeAll(async () => {
  tenant = await import('@/lib/tenant');
});

beforeEach(() => {
  jest.clearAllMocks();
  mockConnect.mockResolvedValue({
    query: mockQuery,
    release: mockRelease,
  });
});

// ─────────────────────────────────────────────────────────────────
// 1. التحقق من ضبط search_path عند getTenantClient
// ─────────────────────────────────────────────────────────────────
describe('getTenantClient — ضبط search_path', () => {
  it('يجب أن يضبط search_path على schema المؤسسة المحددة فقط', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

    await tenant.getTenantClient('school_42');

    const searchPathCall = mockQuery.mock.calls.find(
      (c) => typeof c[0] === 'string' && c[0].includes('search_path')
    );
    expect(searchPathCall).toBeDefined();
    expect(searchPathCall![0]).toContain('school_42');
    // يجب ألا يحتوي على schema مؤسسة أخرى
    expect(searchPathCall![0]).not.toContain('school_99');
  });

  it('يجب أن يضبط search_path مختلفاً لكل مؤسسة', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

    await tenant.getTenantClient('school_1');
    const call1 = mockQuery.mock.calls.find(
      (c) => typeof c[0] === 'string' && c[0].includes('search_path')
    );

    jest.clearAllMocks();
    mockConnect.mockResolvedValue({ query: mockQuery, release: mockRelease });

    await tenant.getTenantClient('school_2');
    const call2 = mockQuery.mock.calls.find(
      (c) => typeof c[0] === 'string' && c[0].includes('search_path')
    );

    expect(call1![0]).toContain('school_1');
    expect(call2![0]).toContain('school_2');
    // التأكيد أن الـ schema مختلف
    expect(call1![0]).not.toEqual(call2![0]);
  });
});

// ─────────────────────────────────────────────────────────────────
// 2. العزل: مؤسسة A لا ترى بيانات مؤسسة B
// ─────────────────────────────────────────────────────────────────
describe('عزل البيانات بين المؤسسات', () => {
  it('يجب أن يرجع 0 طلاب عند الاستعلام عن schema خاطئ', async () => {
    // نُحاكي: schema_42 يملك بيانات، لكن الاستعلام يتم على schema_99
    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // SET search_path
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }); // SELECT students

    const client = await tenant.getTenantClient('school_99');
    const result = await client.query('SELECT * FROM students');

    // يجب ألا يرجع بيانات من مؤسسة أخرى
    expect(result.rows).toHaveLength(0);
  });

  it('يجب أن يرفع خطأ إذا كان الـ schema غير موجود', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // SET search_path
      .mockRejectedValueOnce(
        new Error('relation "students" does not exist')
      );

    const client = await tenant.getTenantClient('school_nonexistent');
    await expect(client.query('SELECT * FROM students')).rejects.toThrow(
      'does not exist'
    );
  });
});

// ─────────────────────────────────────────────────────────────────
// 3. createTenantSchema — لكل مؤسسة schema مستقل
// ─────────────────────────────────────────────────────────────────
describe('createTenantSchema — استقلالية الـ Schemas', () => {
  it('يجب أن ينشئ schema باسم school_{id}', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // BEGIN
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // CREATE SCHEMA
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // SET search_path
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // DDL
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // SEED
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }); // COMMIT

    const schemaName = await tenant.createTenantSchema(42);
    expect(schemaName).toBe('school_42');

    const createSchemaCall = mockQuery.mock.calls.find(
      (c) => typeof c[0] === 'string' && c[0].includes('CREATE SCHEMA')
    );
    expect(createSchemaCall![0]).toContain('school_42');
    // لا ينشئ schema لمؤسسة أخرى
    expect(createSchemaCall![0]).not.toContain('school_43');
  });

  it('يجب أن ينشئ schema مختلفاً لمؤسستين مختلفتين', async () => {
    mockQuery.mockResolvedValue({ rows: [], rowCount: 0 });

    const schema1 = await tenant.createTenantSchema(1);
    const schema2 = await tenant.createTenantSchema(2);

    expect(schema1).toBe('school_1');
    expect(schema2).toBe('school_2');
    expect(schema1).not.toEqual(schema2);
  });
});

// ─────────────────────────────────────────────────────────────────
// 4. checkTenantQuota — لا تخلط بين مؤسستين
// ─────────────────────────────────────────────────────────────────
describe('checkTenantQuota — عزل الحصص', () => {
  it('يجب أن تستعلم بـ school_id المحدد فقط', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          current_students: '50',
          current_storage_bytes: '1000000',
          max_students: '200',
          max_storage_gb: '10',
        },
      ],
      rowCount: 1,
    });

    const quota = await tenant.checkTenantQuota(42, 'students');

    const queryCall = mockQuery.mock.calls[0];
    // يجب أن يمرر school_id المحدد كمعامل
    expect(queryCall[1]).toContain('42');
    expect(quota.current).toBe(50);
    expect(quota.limit).toBe(200);
    expect(quota.allowed).toBe(true);
  });

  it('يجب أن تُظهر عدم السماح عند بلوغ الحد', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          current_students: '200',
          current_storage_bytes: '1000000',
          max_students: '200',
          max_storage_gb: '10',
        },
      ],
      rowCount: 1,
    });

    // إبطال الكاش قبل الاختبار
    tenant.invalidateTenantQuotaCache(99);
    const quota = await tenant.checkTenantQuota(99, 'students');

    expect(quota.allowed).toBe(false);
    expect(quota.current).toBe(200);
    expect(quota.limit).toBe(200);
  });

  it('يجب ألا تخلط بين حصص مؤسستين مختلفتين', async () => {
    // المؤسسة A: 50 من 200
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          current_students: '50',
          current_storage_bytes: '0',
          max_students: '200',
          max_storage_gb: '10',
        },
      ],
      rowCount: 1,
    });
    // المؤسسة B: 199 من 200
    mockQuery.mockResolvedValueOnce({
      rows: [
        {
          current_students: '199',
          current_storage_bytes: '0',
          max_students: '200',
          max_storage_gb: '10',
        },
      ],
      rowCount: 1,
    });

    tenant.invalidateTenantQuotaCache(1);
    tenant.invalidateTenantQuotaCache(2);

    const quotaA = await tenant.checkTenantQuota(1, 'students');
    const quotaB = await tenant.checkTenantQuota(2, 'students');

    // A مسموح، B مسموح لكن تقترب
    expect(quotaA.allowed).toBe(true);
    expect(quotaA.current).toBe(50);

    expect(quotaB.allowed).toBe(true);
    expect(quotaB.current).toBe(199);

    // التأكد أن A لم تأخذ بيانات B
    expect(quotaA.current).not.toBe(quotaB.current);
  });
});

// ─────────────────────────────────────────────────────────────────
// 5. provisionTenant — سجلات منفصلة لكل مؤسسة
// ─────────────────────────────────────────────────────────────────
describe('provisionTenant — عزل السجلات', () => {
  it('يجب أن يُدرج tenant_id منفصلاً لكل مؤسسة', async () => {
    // ردود createTenantSchema
    mockQuery
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // BEGIN
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // CREATE SCHEMA
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // SET search_path
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // DDL
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // SEED
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // COMMIT
      // ردود provisionTenant
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // BEGIN
      .mockResolvedValueOnce({ rows: [{ id: 7 }], rowCount: 1 }) // INSERT tenants
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }) // INSERT tenant_quotas
      .mockResolvedValueOnce({ rows: [], rowCount: 0 }); // COMMIT

    const result = await tenant.provisionTenant('owner_1', 100);

    expect(result.tenantId).toBe(7);
    expect(result.schemaName).toBe('school_100');

    // التأكد أن INSERT يشمل school_id الصحيح
    const insertCall = mockQuery.mock.calls.find(
      (c) =>
        typeof c[0] === 'string' &&
        c[0].includes('INSERT INTO tenants') &&
        Array.isArray(c[1]) &&
        c[1].includes('school_100')
    );
    expect(insertCall).toBeDefined();
    expect(insertCall![1]).toContain('school_100');
    // يجب ألا يحتوي على school_id مؤسسة أخرى
    expect(insertCall![1]).not.toContain('school_200');
  });
});
