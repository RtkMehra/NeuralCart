import type {
  ApiResponse,
  OrderPayload,
  PaginatedResponse,
  Product,
  User
} from './types';

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (typeof window === 'undefined'
    ? process.env.API_URL ?? 'http://localhost:4000/api/v1'
    : 'http://localhost:4000/api/v1');

const defaultHeaders = (): HeadersInit => ({
  'Content-Type': 'application/json'
});

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message ?? 'Something went wrong');
  }

  return response.json() as Promise<T>;
}

export const fetchProducts = async (): Promise<PaginatedResponse<Product>> => {
  const response = await fetch(`${API_BASE}/products`, {
    headers: defaultHeaders(),
    next: { revalidate: 60 }
  });

  return handleResponse<PaginatedResponse<Product>>(response);
};

export const fetchProduct = async (id: string): Promise<ApiResponse<Product>> => {
  const response = await fetch(`${API_BASE}/products/${id}`, {
    headers: defaultHeaders(),
    next: { revalidate: 60 }
  });

  return handleResponse<ApiResponse<Product>>(response);
};

export const createOrder = async (payload: OrderPayload) => {
  const response = await fetch(`${API_BASE}/orders`, {
    method: 'POST',
    headers: defaultHeaders(),
    body: JSON.stringify(payload)
  });

  return handleResponse(response);
};

export const fetchUsers = async (): Promise<PaginatedResponse<User>> => {
  const response = await fetch(`${API_BASE}/users`, {
    headers: defaultHeaders(),
    next: { revalidate: 0 }
  });

  return handleResponse<PaginatedResponse<User>>(response);
};

