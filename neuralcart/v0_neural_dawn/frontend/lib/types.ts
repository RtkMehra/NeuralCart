export type Category = {
  id: string;
  name: string;
  slug: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: Category;
  createdAt: string;
  updatedAt: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export type ApiResponse<T> = {
  data: T;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type OrderPayload = {
  userId: string;
  items: Array<{ productId: string; quantity: number }>;
};

export type User = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

