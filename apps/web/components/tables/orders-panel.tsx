'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { useCallback, useEffect, useState } from 'react';
import type { OrderDto } from '@ledger/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { formatAmount, formatDateTime } from '@/lib/utils/format';

export function OrdersPanel() {
  const [items, setItems] = useState<OrderDto[]>([]);
  const [keyword, setKeyword] = useState('');
  const [message, setMessage] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<OrderDto | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });

  const loadData = useCallback(async () => {
    const response = await apiClient.get('/orders', {
      params: { page: 1, pageSize: 100, keyword },
    });
    if (response.data.success) {
      setItems(response.data.data.items);
    }
  }, [keyword]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <Card>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">订单管理</h2>
          <p className="mt-1 text-sm text-slate-500">订单详情直接返回明细与汇总金额。</p>
        </div>
        <div className="flex gap-3">
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索订单" />
          <Button
            onClick={() => {
              setEditing(null);
              setForm({ name: '', description: '' });
              setOpen(true);
            }}
          >
            新增订单
          </Button>
        </div>
      </div>
      {message ? <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm">{message}</div> : null}
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
            {items.map((item) => (
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
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setEditing(item);
                        setForm({
                          name: item.name,
                          description: item.description || '',
                        });
                        setOpen(true);
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="danger"
                      onClick={async () => {
                        const response = await apiClient.delete(`/orders/${item.id}`);
                        setMessage(response.data.success ? '删除成功' : response.data.error.message);
                        await loadData();
                      }}
                    >
                      删除
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? '编辑订单' : '新增订单'}>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const response = editing
              ? await apiClient.patch(`/orders/${editing.id}`, form)
              : await apiClient.post('/orders', form);
            setMessage(response.data.success ? '保存成功' : response.data.error.message);
            if (response.data.success) {
              setOpen(false);
              await loadData();
            }
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium">订单名称</label>
            <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium">备注</label>
            <Textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
}
