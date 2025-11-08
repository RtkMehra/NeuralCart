import { unstable_noStore as noStore } from 'next/cache';
import { type PaginatedResponse, type ProductSummary, type HealthReport, type RecommendationResult, type SearchResult, type OrderSummary, type UserSummary } from './types';

class ApiError extends Error {
  readonly status: number;
  readonly payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

const withTrailingSlash = (value: string) => (value.endsWith('/') ? value : `${value}/`);

const buildUrl = (path: string, params?: Record<string, string | number | undefined>) => {
  const base = withTrailingSlash(API_BASE);
  const normalizedPath = path.replace(/^\//, '');
  const url = new URL(normalizedPath, base);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, String(value));
      }
    });
  }
  return url.toString();
};

const apiFetch = async <T>(path: string, init?: RequestInit & { disableCache?: boolean }) => {
  if (init?.disableCache) {
    noStore();
  }

  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const rawMessage = await response.text();
    let formatted: unknown = rawMessage;

    try {
      formatted = JSON.parse(rawMessage);
    } catch {
      // plain text, ignore
    }

    const message = typeof formatted === 'string' ? formatted : rawMessage || `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, formatted);
  }

  return (await response.json()) as T;
};

export const api = {
  getHealth: () => apiFetch<HealthReport>(buildUrl('/health'), { disableCache: true }),
  listProducts: (options: { page?: number; limit?: number; search?: string } = {}) =>
    apiFetch<PaginatedResponse<ProductSummary>>(buildUrl('/products', options), { cache: 'no-store' }),
  getProduct: (id: string) => apiFetch<{ data: ProductSummary }>(buildUrl(`/products/${id}`), { cache: 'no-store' }),
  getRecommendations: (productId: string, limit = 5) =>
    apiFetch<{ data: RecommendationResult[] }>(buildUrl('/recommendations', { productId, limit }), { cache: 'no-store' }),
  searchProducts: (query: string, limit = 10) =>
    apiFetch<{ data: SearchResult[] }>(buildUrl('/search', { q: query, limit }), { cache: 'no-store' }),
  listOrders: (options: { page?: number; limit?: number } = {}) =>
    apiFetch<PaginatedResponse<OrderSummary>>(buildUrl('/orders', options), { cache: 'no-store' }),
  listUsers: (options: { page?: number; limit?: number } = {}) =>
    apiFetch<PaginatedResponse<UserSummary>>(buildUrl('/users', options), { cache: 'no-store' })
};

export { ApiError };
