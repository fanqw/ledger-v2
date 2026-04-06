'use client';

import Link from 'next/link';
import type { Route } from 'next';
import type { OrderDto } from '@ledger/shared';
import { useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { useCrudPanel } from '@/lib/hooks/use-crud-panel';
import { formatAmount, formatDateTime } from '@/lib/utils/format';

export function OrdersPanel() {
  const createInitialForm = useCallback(
    () => ({
      name: '',
      description: '',
    }),
    [],
  );
  const mapItemToForm = useCallback(
    (item: OrderDto) => ({
      name: item.name,
      description: item.description || '',
    }),
    [],
  );
  const fetchItems = useCallback(async (keyword: string) => {
    const response = await apiClient.get('/orders', {
      params: { page: 1, pageSize: 100, keyword },
    });
    return response.data.success ? response.data.data.items : [];
  }, []);
  const createItem = useCallback(async (form: { name: string; description: string }) => {
    const response = await apiClient.post('/orders', form);
    return response.data.success ? { ok: true, message: '创建成功' } : { ok: false, message: response.data.error.message };
  }, []);
  const updateItem = useCallback(async (id: string, form: { name: string; description: string }) => {
    const response = await apiClient.patch(`/orders/${id}`, form);
    return response.data.success ? { ok: true, message: '更新成功' } : { ok: false, message: response.data.error.message };
  }, []);
  const deleteItem = useCallback(async (id: string) => {
    const response = await apiClient.delete(`/orders/${id}`);
    return response.data.success ? { ok: true, message: '删除成功' } : { ok: false, message: response.data.error.message };
  }, []);

  const crud = useCrudPanel<OrderDto, { name: string; description: string }>({
    createInitialForm,
    mapItemToForm,
    getItemId: (item) => item.id,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  });

  return (
    <Card>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">订单管理</h2>
          <p className="mt-1 text-sm text-slate-500">订单详情直接返回明细与汇总金额。</p>
        </div>
        <div className="flex gap-3">
          <Input value={crud.keyword} onChange={(event) => crud.setKeyword(event.target.value)} placeholder="搜索订单" />
          <Button onClick={crud.openCreate}>新增订单</Button>
        </div>
      </div>
      {crud.message ? <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm">{crud.message}</div> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-4 py-2">订单名</th>
              <th className="px-4 py-2">备注</th>
              <th className="px-4 py-2">数量</th>
              <th className="px-4 py-2">总金额</th>
              <th className="px-4 py-2">更新时间</th>
              <th className="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {crud.items.map((item) => (
              <tr key={item.id} className="bg-slate-50">
                <td className="px-4 py-3 font-medium">
                  <Link href={`/orders/${item.id}` as Route} className="text-accent">
                    {item.name}
                  </Link>
                </td>
                <td className="px-4 py-3">{item.description || '--'}</td>
                <td className="px-4 py-3">{item.itemCount}</td>
                <td className="px-4 py-3">{formatAmount(item.totalAmount)}</td>
                <td className="px-4 py-3">{formatDateTime(item.updatedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Button variant="ghost" onClick={() => crud.openEdit(item)}>
                      编辑
                    </Button>
                    <Button variant="danger" onClick={async () => crud.remove(item)}>
                      删除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={crud.open} onClose={crud.closeDialog} title={crud.editingItem ? '编辑订单' : '新增订单'}>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await crud.submit();
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium">订单名称</label>
            <Input
              value={crud.form.name}
              onChange={(event) => crud.setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">备注</label>
            <Textarea
              value={crud.form.description}
              onChange={(event) => crud.setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={crud.closeDialog}>
              取消
            </Button>
            <Button type="submit" disabled={crud.submitting}>
              {crud.submitting ? '保存中...' : crud.editingItem ? '保存' : '创建'}
            </Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
}
