'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import type { CategoryDto, CommodityDto, OrderDetailDto, UnitDto } from '@ledger/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { formatAmount, formatDateTime } from '@/lib/utils/format';

type FormState = {
  commodityId: string;
  quantity: string;
  unitPrice: string;
  description: string;
};

export function OrderDetailPanel({ orderId }: { orderId: string }) {
  const [detail, setDetail] = useState<OrderDetailDto | null>(null);
  const [commodities, setCommodities] = useState<CommodityDto[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState<FormState>({
    commodityId: '',
    quantity: '1',
    unitPrice: '0',
    description: '',
  });

  const loadData = useCallback(async () => {
    const [detailRes, commoditiesRes] = await Promise.all([
      apiClient.get(`/orders/${orderId}`),
      apiClient.get('/commodities', { params: { page: 1, pageSize: 100 } }),
    ]);
    if (detailRes.data.success) {
      setDetail(detailRes.data.data);
    }
    if (commoditiesRes.data.success) {
      setCommodities(commoditiesRes.data.data.items);
    }
  }, [orderId]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const total = useMemo(
    () => Number(form.quantity || 0) * Number(form.unitPrice || 0),
    [form.quantity, form.unitPrice],
  );

  return (
    <div className="space-y-4">
      <Card className="bg-ink text-white">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-teal-200">订单</div>
            <div className="mt-3 text-3xl font-semibold">{detail?.order.name ?? '--'}</div>
            <div className="mt-2 text-sm text-slate-300">{detail?.order.description || '无备注'}</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">明细件数</div>
            <div className="mt-2 text-3xl font-semibold">{detail?.summary.totalItems ?? 0}</div>
          </div>
          <div>
            <div className="text-sm text-slate-300">总金额</div>
            <div className="mt-2 text-3xl font-semibold">
              {formatAmount(detail?.summary.totalAmount ?? 0)}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">订单明细</h2>
            <p className="mt-1 text-sm text-slate-500">金额在服务端直接聚合返回。</p>
          </div>
          <Button
            onClick={() => {
              setEditingId(null);
              setForm({ commodityId: '', quantity: '1', unitPrice: '0', description: '' });
              setOpen(true);
            }}
          >
            新增明细
          </Button>
        </div>
        {message ? <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm">{message}</div> : null}
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="px-4 py-2">分类</th>
                <th className="px-4 py-2">商品</th>
                <th className="px-4 py-2">数量</th>
                <th className="px-4 py-2">单位</th>
                <th className="px-4 py-2">单价</th>
                <th className="px-4 py-2">金额</th>
                <th className="px-4 py-2">更新时间</th>
                <th className="px-4 py-2">操作</th>
              </tr>
            </thead>
            <tbody>
              {(detail?.items ?? []).map((item) => (
                <tr key={item.id} className="bg-slate-50">
                  <td className="px-4 py-3">{item.categoryName}</td>
                  <td className="px-4 py-3">{item.commodityName}</td>
                  <td className="px-4 py-3">{item.quantity}</td>
                  <td className="px-4 py-3">{item.unitName}</td>
                  <td className="px-4 py-3">{formatAmount(item.unitPrice)}</td>
                  <td className="px-4 py-3">{formatAmount(item.amount)}</td>
                  <td className="px-4 py-3">{formatDateTime(item.updatedAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingId(item.id);
                          setForm({
                            commodityId: item.commodityId,
                            quantity: String(item.quantity),
                            unitPrice: String(item.unitPrice),
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
                          const response = await apiClient.delete(`/orders/${orderId}/items/${item.id}`);
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
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} title={editingId ? '编辑明细' : '新增明细'}>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const payload = {
              commodityId: form.commodityId,
              quantity: Number(form.quantity),
              unitPrice: Number(form.unitPrice),
              description: form.description,
            };
            const response = editingId
              ? await apiClient.patch(`/orders/${orderId}/items/${editingId}`, payload)
              : await apiClient.post(`/orders/${orderId}/items`, payload);
            setMessage(response.data.success ? '保存成功' : response.data.error.message);
            if (response.data.success) {
              setOpen(false);
              await loadData();
            }
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium">商品</label>
            <Select
              value={form.commodityId}
              onChange={(event) => setForm((prev) => ({ ...prev, commodityId: event.target.value }))}
              options={commodities.map((item) => ({
                value: item.id,
                label: `${item.name} / ${item.categoryName} / ${item.unitName}`,
              }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">数量</label>
              <Input
                type="number"
                step="0.01"
                value={form.quantity}
                onChange={(event) => setForm((prev) => ({ ...prev, quantity: event.target.value }))}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">单价</label>
              <Input
                type="number"
                step="0.01"
                value={form.unitPrice}
                onChange={(event) => setForm((prev) => ({ ...prev, unitPrice: event.target.value }))}
              />
            </div>
          </div>
          <div className="rounded-2xl bg-slate-100 px-4 py-3 text-sm">当前金额：{formatAmount(total)}</div>
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
    </div>
  );
}
