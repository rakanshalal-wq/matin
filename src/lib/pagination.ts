// ===== نظام Pagination المركزي - منصة متين =====
// يُستخدم في جميع API routes لتجنب إرجاع آلاف السجلات دفعة واحدة

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 200;

export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * استخراج معاملات الـ pagination من URL
 */
export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const requestedLimit = parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE), 10);
  const limit = Math.min(Math.max(1, requestedLimit), MAX_PAGE_SIZE);
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * بناء استجابة paginated موحدة
 */
export function buildPaginatedResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
): PaginatedResponse<T> {
  const totalPages = Math.ceil(total / limit);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

/**
 * إضافة LIMIT وOFFSET لاستعلام SQL
 * يُستخدم عند الحاجة لـ pagination بسيط بدون COUNT
 */
export function addPaginationToQuery(query: string, limit: number, offset: number): string {
  return `${query} LIMIT ${limit} OFFSET ${offset}`;
}
