import { describe, expect, it } from 'vitest';
import { buildOrderSummary, decimalToNumber } from '@/lib/services/helpers';

describe('service helpers', () => {
  it('builds order summary totals', () => {
    const summary = buildOrderSummary([
      {
        id: '1',
        orderId: 'order-1',
        commodityId: 'commodity-1',
        commodityName: '苹果',
        categoryName: '水果',
        unitName: '斤',
        quantity: 2,
        unitPrice: 3.5,
        amount: 7,
        description: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        orderId: 'order-1',
        commodityId: 'commodity-2',
        commodityName: '香蕉',
        categoryName: '水果',
        unitName: '斤',
        quantity: 1,
        unitPrice: 4,
        amount: 4,
        description: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    expect(summary.totalAmount).toBe(11);
    expect(summary.totalItems).toBe(3);
  });

  it('converts decimal-like values to number', () => {
    expect(decimalToNumber(12.5)).toBe(12.5);
  });
});
