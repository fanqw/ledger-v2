'use client';

import { useCallback, useEffect, useState } from 'react';
import type { CategoryDto, CommodityDto, UnitDto } from '@ledger/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { formatDateTime } from '@/lib/utils/format';

export function CommodityPanel() {
  const [items, setItems] = useState<CommodityDto[]>([]);
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [units, setUnits] = useState<UnitDto[]>([]);
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<CommodityDto | null>(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    name: '',
    description: '',
    categoryId: '',
    unitId: '',
  });

  const loadData = useCallback(async () => {
    const [commoditiesRes, categoriesRes, unitsRes] = await Promise.all([
      apiClient.get('/commodities', { params: { page: 1, pageSize: 100, keyword } }),
      apiClient.get('/categories', { params: { page: 1, pageSize: 100 } }),
      apiClient.get('/units', { params: { page: 1, pageSize: 100 } }),
    ]);
    if (commoditiesRes.data.success) setItems(commoditiesRes.data.data.items);
    if (categoriesRes.data.success) setCategories(categoriesRes.data.data.items);
    if (unitsRes.data.success) setUnits(unitsRes.data.data.items);
  }, [keyword]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  return (
    <Card>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">商品管理</h2>
          <p className="mt-1 text-sm text-slate-500">商品依赖分类和单位，删除时检查订单明细占用。</p>
        </div>
        <div className="flex gap-3">
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索商品" />
          <Button
            onClick={() => {
              setEditing(null);
              setForm({ name: '', description: '', categoryId: '', unitId: '' });
              setOpen(true);
            }}
          >
            新增商品
          </Button>
        </div>
      </div>
      {message ? <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm">{message}</div> : null}
      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              <th className="px-4 py-2">名称</th>
              <th className="px-4 py-2">分类</th>
              <th className="px-4 py-2">单位</th>
              <th className="px-4 py-2">备注</th>
              <th className="px-4 py-2">更新时间</th>
              <th className="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="bg-slate-50">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.categoryName}</td>
                <td className="px-4 py-3">{item.unitName}</td>
                <td className="px-4 py-3">{item.description || '--'}</td>
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
                          categoryId: item.categoryId,
                          unitId: item.unitId,
                        });
                        setOpen(true);
                      }}
                    >
                      编辑
                    </Button>
                    <Button
                      variant="danger"
                      onClick={async () => {
                        const response = await apiClient.delete(`/commodities/${item.id}`);
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
      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? '编辑商品' : '新增商品'}>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const response = editing
              ? await apiClient.patch(`/commodities/${editing.id}`, form)
              : await apiClient.post('/commodities', form);
            setMessage(response.data.success ? '保存成功' : response.data.error.message);
            if (response.data.success) {
              setOpen(false);
              await loadData();
            }
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium">商品名称</label>
            <Input value={form.name} onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">分类</label>
              <Select
                value={form.categoryId}
                onChange={(event) => setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                options={categories.map((item) => ({ value: item.id, label: item.name }))}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">单位</label>
              <Select
                value={form.unitId}
                onChange={(event) => setForm((prev) => ({ ...prev, unitId: event.target.value }))}
                options={units.map((item) => ({ value: item.id, label: item.name }))}
              />
            </div>
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
