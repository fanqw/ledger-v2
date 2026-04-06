import type { Prisma } from '@prisma/client';
import { prisma } from './prisma';

export const repositories = {
  user: {
    findActiveByUsername(username: string) {
      return prisma.user.findFirst({
        where: { username, deletedAt: null },
      });
    },
    create(data: Prisma.UserUncheckedCreateInput) {
      return prisma.user.create({ data });
    },
  },
  category: {
    findMany(where: Prisma.CategoryWhereInput, skip: number, take: number) {
      return prisma.category.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      });
    },
    count(where: Prisma.CategoryWhereInput) {
      return prisma.category.count({ where });
    },
    findById(id: string) {
      return prisma.category.findFirst({ where: { id, deletedAt: null } });
    },
    findByName(name: string) {
      return prisma.category.findFirst({ where: { name, deletedAt: null } });
    },
    create(data: Prisma.CategoryUncheckedCreateInput) {
      return prisma.category.create({ data });
    },
    update(id: string, data: Prisma.CategoryUncheckedUpdateInput) {
      return prisma.category.update({ where: { id }, data });
    },
  },
  unit: {
    findMany(where: Prisma.UnitWhereInput, skip: number, take: number) {
      return prisma.unit.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      });
    },
    count(where: Prisma.UnitWhereInput) {
      return prisma.unit.count({ where });
    },
    findById(id: string) {
      return prisma.unit.findFirst({ where: { id, deletedAt: null } });
    },
    findByName(name: string) {
      return prisma.unit.findFirst({ where: { name, deletedAt: null } });
    },
    create(data: Prisma.UnitUncheckedCreateInput) {
      return prisma.unit.create({ data });
    },
    update(id: string, data: Prisma.UnitUncheckedUpdateInput) {
      return prisma.unit.update({ where: { id }, data });
    },
  },
  commodity: {
    findMany(where: Prisma.CommodityWhereInput, skip: number, take: number) {
      return prisma.commodity.findMany({
        where,
        include: { category: true, unit: true },
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      });
    },
    count(where: Prisma.CommodityWhereInput) {
      return prisma.commodity.count({ where });
    },
    findById(id: string) {
      return prisma.commodity.findFirst({
        where: { id, deletedAt: null },
        include: { category: true, unit: true },
      });
    },
    findByNameAndUnit(name: string, unitId: string) {
      return prisma.commodity.findFirst({
        where: { name, unitId, deletedAt: null },
      });
    },
    create(data: Prisma.CommodityUncheckedCreateInput) {
      return prisma.commodity.create({
        data,
        include: { category: true, unit: true },
      });
    },
    update(id: string, data: Prisma.CommodityUncheckedUpdateInput) {
      return prisma.commodity.update({
        where: { id },
        data,
        include: { category: true, unit: true },
      });
    },
  },
  order: {
    findMany(where: Prisma.OrderWhereInput, skip: number, take: number) {
      return prisma.order.findMany({
        where,
        include: { items: { where: { deletedAt: null } } },
        orderBy: { updatedAt: 'desc' },
        skip,
        take,
      });
    },
    count(where: Prisma.OrderWhereInput) {
      return prisma.order.count({ where });
    },
    findById(id: string) {
      return prisma.order.findFirst({
        where: { id, deletedAt: null },
        include: {
          items: {
            where: { deletedAt: null },
            include: {
              commodity: {
                include: { category: true, unit: true },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });
    },
    findByName(name: string) {
      return prisma.order.findFirst({ where: { name, deletedAt: null } });
    },
    create(data: Prisma.OrderUncheckedCreateInput) {
      return prisma.order.create({
        data,
        include: { items: true },
      });
    },
    update(id: string, data: Prisma.OrderUncheckedUpdateInput) {
      return prisma.order.update({
        where: { id },
        data,
        include: { items: { where: { deletedAt: null } } },
      });
    },
  },
  orderItem: {
    findById(id: string) {
      return prisma.orderItem.findFirst({
        where: { id, deletedAt: null },
        include: {
          commodity: { include: { category: true, unit: true } },
        },
      });
    },
    create(data: Prisma.OrderItemUncheckedCreateInput) {
      return prisma.orderItem.create({
        data,
        include: {
          commodity: { include: { category: true, unit: true } },
        },
      });
    },
    update(id: string, data: Prisma.OrderItemUncheckedUpdateInput) {
      return prisma.orderItem.update({
        where: { id },
        data,
        include: {
          commodity: { include: { category: true, unit: true } },
        },
      });
    },
  },
};
