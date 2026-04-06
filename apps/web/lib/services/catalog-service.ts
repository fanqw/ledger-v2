import type {
  CategoryDto,
  CommodityDto,
  PageData,
  UnitDto,
  UpsertCategoryInput,
  UpsertCommodityInput,
  UpsertUnitInput,
} from '@ledger/shared';
import { prisma } from '@/lib/db/prisma';
import { repositories } from '@/lib/db/repositories';
import { AppError } from './errors';
import {
  normalizePageQuery,
  toCategoryDto,
  toCommodityDto,
  toUnitDto,
} from './helpers';

export async function listCategories(query: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}): Promise<PageData<CategoryDto>> {
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
    repositories.category.findMany(where, page.skip, page.pageSize),
    repositories.category.count(where),
  ]);

  return {
    items: items.map(toCategoryDto),
    meta: { page: page.page, pageSize: page.pageSize, total },
  };
}

export async function createCategory(input: UpsertCategoryInput) {
  const exists = await repositories.category.findByName(input.name);
  if (exists) {
    throw new AppError('CATEGORY_EXISTS', '分类名称已存在', 409);
  }

  const category = await repositories.category.create({
    name: input.name,
    description: input.description || null,
  });

  return toCategoryDto(category);
}

export async function updateCategory(id: string, input: UpsertCategoryInput) {
  const category = await repositories.category.findById(id);
  if (!category) {
    throw new AppError('CATEGORY_NOT_FOUND', '分类不存在', 404);
  }

  const duplicated = await repositories.category.findByName(input.name);
  if (duplicated && duplicated.id !== id) {
    throw new AppError('CATEGORY_EXISTS', '分类名称已存在', 409);
  }

  const updated = await repositories.category.update(id, {
    name: input.name,
    description: input.description || null,
  });

  return toCategoryDto(updated);
}

export async function deleteCategory(id: string) {
  const category = await repositories.category.findById(id);
  if (!category) {
    throw new AppError('CATEGORY_NOT_FOUND', '分类不存在', 404);
  }

  const inUse = await prisma.commodity.findFirst({
    where: { categoryId: id, deletedAt: null },
  });
  if (inUse) {
    throw new AppError('CATEGORY_IN_USE', '该分类下存在商品，无法删除', 409);
  }

  await repositories.category.update(id, { deletedAt: new Date() });
}

export async function listUnits(query: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}): Promise<PageData<UnitDto>> {
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
    repositories.unit.findMany(where, page.skip, page.pageSize),
    repositories.unit.count(where),
  ]);

  return {
    items: items.map(toUnitDto),
    meta: { page: page.page, pageSize: page.pageSize, total },
  };
}

export async function createUnit(input: UpsertUnitInput) {
  const exists = await repositories.unit.findByName(input.name);
  if (exists) {
    throw new AppError('UNIT_EXISTS', '单位名称已存在', 409);
  }

  const unit = await repositories.unit.create({
    name: input.name,
    description: input.description || null,
  });

  return toUnitDto(unit);
}

export async function updateUnit(id: string, input: UpsertUnitInput) {
  const unit = await repositories.unit.findById(id);
  if (!unit) {
    throw new AppError('UNIT_NOT_FOUND', '单位不存在', 404);
  }

  const duplicated = await repositories.unit.findByName(input.name);
  if (duplicated && duplicated.id !== id) {
    throw new AppError('UNIT_EXISTS', '单位名称已存在', 409);
  }

  const updated = await repositories.unit.update(id, {
    name: input.name,
    description: input.description || null,
  });

  return toUnitDto(updated);
}

export async function deleteUnit(id: string) {
  const unit = await repositories.unit.findById(id);
  if (!unit) {
    throw new AppError('UNIT_NOT_FOUND', '单位不存在', 404);
  }

  const inUse = await prisma.commodity.findFirst({
    where: { unitId: id, deletedAt: null },
  });
  if (inUse) {
    throw new AppError('UNIT_IN_USE', '该单位下存在商品，无法删除', 409);
  }

  await repositories.unit.update(id, { deletedAt: new Date() });
}

export async function listCommodities(query: {
  page?: number;
  pageSize?: number;
  keyword?: string;
}): Promise<PageData<CommodityDto>> {
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
    repositories.commodity.findMany(where, page.skip, page.pageSize),
    repositories.commodity.count(where),
  ]);

  return {
    items: items.map(toCommodityDto),
    meta: { page: page.page, pageSize: page.pageSize, total },
  };
}

export async function createCommodity(input: UpsertCommodityInput) {
  const duplicated = await repositories.commodity.findByNameAndUnit(
    input.name,
    input.unitId,
  );
  if (duplicated) {
    throw new AppError('COMMODITY_EXISTS', '商品名称已存在', 409);
  }

  const commodity = await repositories.commodity.create({
    name: input.name,
    description: input.description || null,
    categoryId: input.categoryId,
    unitId: input.unitId,
  });

  return toCommodityDto(commodity);
}

export async function updateCommodity(id: string, input: UpsertCommodityInput) {
  const existing = await repositories.commodity.findById(id);
  if (!existing) {
    throw new AppError('COMMODITY_NOT_FOUND', '商品不存在', 404);
  }

  const duplicated = await repositories.commodity.findByNameAndUnit(
    input.name,
    input.unitId,
  );
  if (duplicated && duplicated.id !== id) {
    throw new AppError('COMMODITY_EXISTS', '商品名称已存在', 409);
  }

  const commodity = await repositories.commodity.update(id, {
    name: input.name,
    description: input.description || null,
    categoryId: input.categoryId,
    unitId: input.unitId,
  });

  return toCommodityDto(commodity);
}

export async function deleteCommodity(id: string) {
  const existing = await repositories.commodity.findById(id);
  if (!existing) {
    throw new AppError('COMMODITY_NOT_FOUND', '商品不存在', 404);
  }

  const inUse = await prisma.orderItem.findFirst({
    where: { commodityId: id, deletedAt: null },
  });
  if (inUse) {
    throw new AppError('COMMODITY_IN_USE', '该商品已被订单使用，无法删除', 409);
  }

  await repositories.commodity.update(id, { deletedAt: new Date() });
}
