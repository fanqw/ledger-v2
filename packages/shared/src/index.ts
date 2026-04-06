export type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiFailure = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
};

export type ApiResult<T> = ApiSuccess<T> | ApiFailure;

export type SessionUser = {
  id: string;
  username: string;
  role: 'admin';
};

export type LoginInput = {
  username: string;
  password: string;
};

export type PageQuery = {
  page?: number;
  pageSize?: number;
  keyword?: string;
};

export type PageMeta = {
  page: number;
  pageSize: number;
  total: number;
};

export type PageData<T> = {
  items: T[];
  meta: PageMeta;
};

export type EntitySummary = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CategoryDto = EntitySummary;

export type UnitDto = EntitySummary;

export type CommodityDto = EntitySummary & {
  categoryId: string;
  unitId: string;
  categoryName: string;
  unitName: string;
};

export type OrderDto = EntitySummary & {
  itemCount: number;
  totalAmount: number;
};

export type OrderItemDto = {
  id: string;
  orderId: string;
  commodityId: string;
  commodityName: string;
  categoryName: string;
  unitName: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type OrderDetailDto = {
  order: OrderDto;
  items: OrderItemDto[];
  summary: {
    totalAmount: number;
    totalItems: number;
  };
};

export type UpsertCategoryInput = {
  name: string;
  description?: string;
};

export type UpsertUnitInput = {
  name: string;
  description?: string;
};

export type UpsertCommodityInput = {
  name: string;
  description?: string;
  categoryId: string;
  unitId: string;
};

export type UpsertOrderInput = {
  name: string;
  description?: string;
};

export type UpsertOrderItemInput = {
  commodityId: string;
  quantity: number;
  unitPrice: number;
  description?: string;
};

export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 10;
