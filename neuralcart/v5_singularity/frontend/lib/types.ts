export type CategorySummary = {
  id: string;
  name: string;
  slug: string;
};

export type ProductSummary = {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string | null;
  category: CategorySummary;
  createdAt: string;
  updatedAt: string;
};

export type UserSummary = {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type OrderItemSummary = {
  id: string;
  quantity: number;
  unitPrice: number;
  product: ProductSummary;
  createdAt: string;
  updatedAt: string;
};

export type OrderSummary = {
  id: string;
  status: string;
  totalAmount: number;
  user: UserSummary;
  items: OrderItemSummary[];
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

export type HealthReport = {
  status: 'ok' | 'degraded' | 'down';
  timestamp: string;
  dependencies: Record<'database' | 'redis' | 'elasticsearch' | 'ollama', 'up' | 'down' | 'unknown'>;
};

export type SearchResult = {
  id: string;
  score: number;
  name: string;
  description: string;
  category: string;
  price: number;
  createdAt: string;
};

export type RecommendationResult = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  category: CategorySummary;
  score: number;
};
