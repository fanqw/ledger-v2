import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type CategoryDto,
  type CommodityDto,
  type OrderDetailDto,
  type OrderDto,
  type OrderItemDto,
  type UnitDto,
} from '@ledger/shared';
import { Prisma } from '@prisma/client';

export function normalizePageQuery(query: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}) {
  const page = query.page ?? DEFAULT_PAGE;
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE;
  const keyword = query.keyword?.trim() ?? '';

  return {
    page,
    pageSize,
    keyword,
    skip: (page - 1) * pageSize,
  };
}

export function decimalToNumber(value: Prisma.Decimal | number) {
  return Number(value);
}

export function toCategoryDto(entity: {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}): CategoryDto {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toUnitDto(entity: {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}): UnitDto {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toCommodityDto(entity: {
  id: string;
  name: string;
  description: string | null;
  categoryId: string;
  unitId: string;
  createdAt: Date;
  updatedAt: Date;
  category: { name: string };
  unit: { name: string };
}): CommodityDto {
  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    categoryId: entity.categoryId,
    unitId: entity.unitId,
    categoryName: entity.category.name,
    unitName: entity.unit.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toOrderItemDto(entity: {
  id: string;
  orderId: string;
  commodityId: string;
  quantity: Prisma.Decimal | number;
  unitPrice: Prisma.Decimal | number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  commodity: {
    name: string;
    category: { name: string };
    unit: { name: string };
  };
}): OrderItemDto {
  const quantity = decimalToNumber(entity.quantity);
  const unitPrice = decimalToNumber(entity.unitPrice);

  return {
    id: entity.id,
    orderId: entity.orderId,
    commodityId: entity.commodityId,
    commodityName: entity.commodity.name,
    categoryName: entity.commodity.category.name,
    unitName: entity.commodity.unit.name,
    quantity,
    unitPrice,
    amount: quantity * unitPrice,
    description: entity.description,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function buildOrderSummary(items: OrderItemDto[]) {
  return items.reduce(
    (acc, item) => {
      acc.totalAmount += item.amount;
      acc.totalItems += item.quantity;
      return acc;
    },
    { totalAmount: 0, totalItems: 0 },
  );
}

export function toOrderDto(entity: {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: Array<{
    quantity: Prisma.Decimal | number;
    unitPrice: Prisma.Decimal | number;
  }>;
}): OrderDto {
  const items = entity.items ?? [];
  const totalAmount = items.reduce(
    (acc, item) =>
      acc +
      decimalToNumber(item.quantity) * decimalToNumber(item.unitPrice),
    0,
  );
  const itemCount = items.reduce(
    (acc, item) => acc + decimalToNumber(item.quantity),
    0,
  );

  return {
    id: entity.id,
    name: entity.name,
    description: entity.description,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
    totalAmount,
    itemCount,
  };
}

export function toOrderDetailDto(order: Parameters<typeof toOrderDto>[0], items: OrderItemDto[]): OrderDetailDto {
  return {
    order: toOrderDto(order),
    items,
    summary: buildOrderSummary(items),
  };
}
