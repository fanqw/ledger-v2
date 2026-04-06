'use client';

import { useCallback, useMemo } from 'react';
import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, type PageData } from '@ledger/shared';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { useCrudPanel } from '@/lib/hooks/use-crud-panel';
import { formatDateTime } from '@/lib/utils/format';
import { PaginationControls } from './pagination-controls';

type BaseItem = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

type ResourcePanelProps<T extends BaseItem> = {
  title: string;
  endpoint: string;
  columns?: Array<{
    key: string;
    header: string;
    render: (item: T) => React.ReactNode;
  }>;
};

export function ResourcePanel<T extends BaseItem>({
  title,
  endpoint,
  columns = [],
}: ResourcePanelProps<T>) {
  const createInitialForm = useCallback(() => ({ name: '', description: '' }), []);
  const mapItemToForm = useCallback(
    (item: T) => ({
      name: item.name,
      description: item.description || '',
    }),
    [],
  );
  const fetchItems = useCallback(
    async ({
      keyword,
      page,
      pageSize,
    }: {
      keyword: string;
      page: number;
      pageSize: number;
    }): Promise<PageData<T>> => {
      const response = await apiClient.get(endpoint, {
        params: { page, pageSize, keyword },
      });

      return response.data.success
        ? response.data.data
        : {
            items: [],
            meta: { page: DEFAULT_PAGE, pageSize: DEFAULT_PAGE_SIZE, total: 0 },
          };
    },
    [endpoint],
  );
  const createItem = useCallback(
    async (form: { name: string; description: string }) => {
      const response = await apiClient.post(endpoint, form);
      return response.data.success
        ? { ok: true, message: '创建成功' }
        : { ok: false, message: response.data.error.message };
    },
    [endpoint],
  );
  const updateItem = useCallback(
    async (id: string, form: { name: string; description: string }) => {
      const response = await apiClient.patch(`${endpoint}/${id}`, form);
      return response.data.success
        ? { ok: true, message: '更新成功' }
        : { ok: false, message: response.data.error.message };
    },
    [endpoint],
  );
  const deleteItem = useCallback(
    async (id: string) => {
      const response = await apiClient.delete(`${endpoint}/${id}`);
      return response.data.success
        ? { ok: true, message: '删除成功' }
        : { ok: false, message: response.data.error.message };
    },
    [endpoint],
  );

  const crud = useCrudPanel<T, { name: string; description: string }>({
    createInitialForm,
    mapItemToForm,
    getItemId: (item) => item.id,
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
  });

  const mergedColumns = useMemo(
    () => [
      { key: 'name', header: '名称', render: (item: T) => item.name },
      ...columns,
      { key: 'description', header: '备注', render: (item: T) => item.description || '--' },
      { key: 'updatedAt', header: '更新时间', render: (item: T) => formatDateTime(item.updatedAt) },
    ],
    [columns],
  );

  return (
    <Card>
      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">统一使用 v2 API、表单和删除约束。</p>
        </div>
        <div className="flex gap-3">
          <Input value={crud.keyword} onChange={(event) => crud.setKeyword(event.target.value)} placeholder="搜索名称" />
          <Button onClick={crud.openCreate}>新增</Button>
        </div>
      </div>

      {crud.message ? <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm">{crud.message}</div> : null}

      <div className="overflow-x-auto">
        <table className="min-w-full border-separate border-spacing-y-2 text-sm">
          <thead>
            <tr className="text-left text-slate-500">
              {mergedColumns.map((column) => (
                <th key={column.key} className="px-4 py-2 font-medium">
                  {column.header}
                </th>
              ))}
              <th className="px-4 py-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {crud.items.map((item) => (
              <tr key={item.id} className="rounded-2xl bg-slate-50">
                {mergedColumns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    {column.render(item)}
                  </td>
                ))}
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
            {crud.items.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-center text-slate-500" colSpan={mergedColumns.length + 1}>
                  {crud.loading ? '加载中...' : '暂无数据'}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      <PaginationControls
        loading={crud.loading}
        meta={crud.meta}
        onPageChange={crud.setPage}
        onPageSizeChange={crud.setPageSize}
      />

      <Dialog open={crud.open} onClose={crud.closeDialog} title={crud.editingItem ? `编辑${title}` : `新增${title}`}>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            await crud.submit();
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium">名称</label>
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
