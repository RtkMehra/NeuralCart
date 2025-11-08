import { cache } from '../../lib/cache';
import { ListProductsInput } from './product.schema';
import { ProductResponse } from './product.mapper';

const LIST_NAMESPACE = 'products:list';
const DETAIL_NAMESPACE = 'products:detail';
const TTL_SECONDS = 300;

type ProductsListPayload = {
  data: ProductResponse[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

const buildListKey = ({ page, limit, search }: ListProductsInput) =>
  `${LIST_NAMESPACE}:${page}:${limit}:${search ?? ''}`;

const buildDetailKey = (id: string) => `${DETAIL_NAMESPACE}:${id}`;

export const productCache = {
  async getList(params: ListProductsInput): Promise<ProductsListPayload | null> {
    return cache.get<ProductsListPayload>(buildListKey(params), LIST_NAMESPACE);
  },

  async setList(params: ListProductsInput, payload: ProductsListPayload): Promise<void> {
    await cache.set(buildListKey(params), payload, TTL_SECONDS, LIST_NAMESPACE);
  },

  async getDetail(id: string): Promise<ProductResponse | null> {
    return cache.get<ProductResponse>(buildDetailKey(id), DETAIL_NAMESPACE);
  },

  async setDetail(id: string, response: ProductResponse): Promise<void> {
    await cache.set(buildDetailKey(id), response, TTL_SECONDS, DETAIL_NAMESPACE);
  },

  async invalidateLists(): Promise<void> {
    await cache.invalidateNamespace(LIST_NAMESPACE);
  },

  async invalidateDetails(): Promise<void> {
    await cache.invalidateNamespace(DETAIL_NAMESPACE);
  },

  async invalidateAll(): Promise<void> {
    await Promise.all([this.invalidateLists(), this.invalidateDetails()]);
  }
};

