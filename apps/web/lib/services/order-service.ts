import type {
  OrderDetailDto,
  OrderDto,
  OrderItemDto,
  PageData,
  UpsertOrderInput,
  UpsertOrderItemInput,
} from '@ledger/shared';
import { Prisma } from '@prisma/client';
import { repositories } from '@/lib/db/repositories';
import { AppError } from './errors';
import {
  normalizePageQuery,
  toOrderDetailDto,
  toOrderDto,
  toOrderItemDto,
} from './helpers';

export async function listOrders(query: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}): Promise<PageData<OrderDto>> {
  const page = normalizePageQuery(query);
  const where = {
    deletedAt: null,
    ...(page.keyword
      ? {
          name: { contains: page.keyword, mode: 'insensitive' as const },
        }
      : {}),
  };

  const [items, total] = await Promise.all([
    repositories.order.findMany(where, page.skip, page.pageSize),
    repositories.order.count(where),
  ]);

  return {
    items: items.map(toOrderDto),
    meta: { page: page.page, pageSize: page.pageSize, total },
  };
}

export async function getOrderDetail(id: string): Promise<OrderDetailDto> {
  const order = await repositories.order.findById(id);
  if (!order) {
    throw new AppError('ORDER_NOT_FOUND', '订单不存在', 404);
  }

  const items = order.items.map(toOrderItemDto);
  return toOrderDetailDto(order, items);
}

export async function createOrder(input: UpsertOrderInput) {
  const exists = await repositories.order.findByName(input.name);
  if (exists) {
    throw new AppError('ORDER_EXISTS', '订单名称已存在', 409);
  }

  const order = await repositories.order.create({
    name: input.name,
    description: input.description || null,
  });

  return toOrderDto(order);
}

export async function updateOrder(id: string, input: UpsertOrderInput) {
  const order = await repositories.order.findById(id);
  if (!order) {
    throw new AppError('ORDER_NOT_FOUND', '订单不存在', 404);
  }

  const duplicated = await repositories.order.findByName(input.name);
  if (duplicated && duplicated.id !== id) {
    throw new AppError('ORDER_EXISTS', '订单名称已存在', 409);
  }

  const updated = await repositories.order.update(id, {
    name: input.name,
    description: input.description || null,
  });
  return toOrderDto(updated);
}

export async function deleteOrder(id: string) {
  const order = await repositories.order.findById(id);
  if (!order) {
    throw new AppError('ORDER_NOT_FOUND', '订单不存在', 404);
  }

  if (order.items.length > 0) {
    throw new AppError('ORDER_IN_USE', '该订单下存在明细，无法删除', 409);
  }

  await repositories.order.update(id, { deletedAt: new Date() });
}

export async function createOrderItem(orderId: string, input: UpsertOrderItemInput): Promise<OrderItemDto> {
  const order = await repositories.order.findById(orderId);
  if (!order) {
    throw new AppError('ORDER_NOT_FOUND', '订单不存在', 404);
  }

  const item = await repositories.orderItem.create({
    orderId,
    commodityId: input.commodityId,
    quantity: new Prisma.Decimal(input.quantity),
    unitPrice: new Prisma.Decimal(input.unitPrice),
    description: input.description || null,
  });

  return toOrderItemDto(item);
}

export async function updateOrderItem(
  orderId: string,
  itemId: string,
  input: UpsertOrderItemInput,
): Promise<OrderItemDto> {
  const item = await repositories.orderItem.findById(itemId);
  if (!item || item.orderId !== orderId) {
    throw new AppError('ORDER_ITEM_NOT_FOUND', '订单明细不存在', 404);
  }

  const updated = await repositories.orderItem.update(itemId, {
    commodityId: input.commodityId,
    quantity: new Prisma.Decimal(input.quantity),
    unitPrice: new Prisma.Decimal(input.unitPrice),
    description: input.description || null,
  });

  return toOrderItemDto(updated);
}

export async function deleteOrderItem(orderId: string, itemId: string) {
  const item = await repositories.orderItem.findById(itemId);
  if (!item || item.orderId !== orderId) {
    throw new AppError('ORDER_ITEM_NOT_FOUND', '订单明细不存在', 404);
  }

  await repositories.orderItem.update(itemId, { deletedAt: new Date() });
}
