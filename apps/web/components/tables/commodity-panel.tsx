'use client';

import { useCallback, useState } from 'react';
import type { CategoryDto, CommodityDto, UnitDto } from '@ledger/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { useCrudPanel } from '@/lib/hooks/use-crud-panel';
import { formatDateTime } from '@/lib/utils/format';

export function CommodityPanel() {
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [units, setUnits] = useState<UnitDto[]>([]);

  const createInitialForm = useCallback(
    () => ({
      name: '',
      description: '',
      categoryId: '',
      unitId: '',
    }),
    [],
  );
  const mapItemToForm = useCallback(
    (item: CommodityDto) => ({
      name: item.name,
      description: item.description || '',
      categoryId: item.categoryId,
      unitId: item.unitId,
    }),
    [],
  );
  const fetchItems = useCallback(
    async (keyword: string) => {
      const [commoditiesRes, categoriesRes, unitsRes] = await Promise.all([
        apiClient.get('/commodities', { params: { page: 1, pageSize: 100, keyword } }),
        apiClient.get('/categories', { params: { page: 1, pageSize: 100 } }),
        apiClient.get('/units', { params: { page: 1, pageSize: 100 } }),
      ]);

      if (categoriesRes.data.success) {
        setCategories(categoriesRes.data.data.items);
      }
      if (unitsRes.data.success) {
        setUnits(unitsRes.data.data.items);
      }

      return commoditiesRes.data.success ? commoditiesRes.data.data.items : [];
    },
    [],
  );
  const createItem = useCallback(async (form: { name: string; description: string; categoryId: string; unitId: string }) => {
    const response = await apiClient.post('/commodities', form);
    return response.data.success ? { ok: true, message: '创建成功' } : { ok: false, message: response.data.error.message };
  }, []);
  const updateItem = useCallback(
    async (id: string, form: { name: string; description: string; categoryId: string; unitId: string }) => {
      const response = await apiClient.patch(`/commodities/${id}`, form);
      return response.data.success ? { ok: true, message: '更新成功' } : { ok: false, message: response.data.error.message };
    },
    [],
  );
  const deleteItem = useCallback(async (id: string) => {
    const response = await apiClient.delete(`/commodities/${id}`);
    return response.data.success ? { ok: true, message: '删除成功' } : { ok: false, message: response.data.error.message };
  }, []);

  const crud = useCrudPanel<
    CommodityDto,
    { name: string; description: string; categoryId: string; unitId: string }
  >({
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
          <h2 className="text-xl font-semibold">商品管理</h2>
          <p className="mt-1 text-sm text-slate-500">商品依赖分类和单位，删除时检查订单明细占用。</p>
        </div>
        <div className="flex gap-3">
          <Input value={crud.keyword} onChange={(event) => crud.setKeyword(event.target.value)} placeholder="搜索商品" />
          <Button onClick={crud.openCreate}>新增商品</Button>
        </div>
      </div>
      {crud.message ? <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm">{crud.message}</div> : null}
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
            {crud.items.map((item) => (
              <tr key={item.id} className="bg-slate-50">
                <td className="px-4 py-3">{item.name}</td>
                <td className="px-4 py-3">{item.categoryName}</td>
                <td className="px-4 py-3">{item.unitName}</td>
                <td className="px-4 py-3">{item.description || '--'}</td>
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
      <Dialog open={crud.open} onClose={crud.closeDialog} title={crud.editingItem ? '编辑商品' : '新增商品'}>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await crud.submit();
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium">商品名称</label>
            <Input
              value={crud.form.name}
              onChange={(event) => crud.setForm((prev) => ({ ...prev, name: event.target.value }))}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">分类</label>
              <Select
                value={crud.form.categoryId}
                onChange={(event) => crud.setForm((prev) => ({ ...prev, categoryId: event.target.value }))}
                options={categories.map((item) => ({ value: item.id, label: item.name }))}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium">单位</label>
              <Select
                value={crud.form.unitId}
                onChange={(event) => crud.setForm((prev) => ({ ...prev, unitId: event.target.value }))}
                options={units.map((item) => ({ value: item.id, label: item.name }))}
              />
            </div>
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
              {crud.submitting ? '保存中...' : '保存'}
            </Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
}
