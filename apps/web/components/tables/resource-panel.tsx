'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { apiClient } from '@/lib/api/client';
import { formatDateTime } from '@/lib/utils/format';

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
  const [items, setItems] = useState<T[]>([]);
  const [keyword, setKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [form, setForm] = useState({ name: '', description: '' });
  const [message, setMessage] = useState('');

  const loadData = useCallback(async () => {
    const response = await apiClient.get(endpoint, {
      params: { page: 1, pageSize: 100, keyword },
    });
    if (response.data.success) {
      setItems(response.data.data.items);
    }
  }, [endpoint, keyword]);

  useEffect(() => {
    void loadData();
  }, [loadData]);

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
          <Input value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="搜索名称" />
          <Button
            onClick={() => {
              setEditing(null);
              setForm({ name: '', description: '' });
              setOpen(true);
            }}
          >
            新增
          </Button>
        </div>
      </div>

      {message ? <div className="mb-4 rounded-2xl bg-slate-100 px-4 py-3 text-sm">{message}</div> : null}

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
            {items.map((item) => (
              <tr key={item.id} className="rounded-2xl bg-slate-50">
                {mergedColumns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    {column.render(item)}
                  </td>
                ))}
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
                        const response = await apiClient.delete(`${endpoint}/${item.id}`);
                        if (response.data.success) {
                          setMessage('删除成功');
                          await loadData();
                        } else {
                          setMessage(response.data.error.message);
                        }
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

      <Dialog open={open} onClose={() => setOpen(false)} title={editing ? `编辑${title}` : `新增${title}`}>
        <form
          className="space-y-4"
          onSubmit={async (event) => {
            event.preventDefault();
            const payload = {
              name: form.name,
              description: form.description,
            };
            const response = editing
              ? await apiClient.patch(`${endpoint}/${editing.id}`, payload)
              : await apiClient.post(endpoint, payload);

            if (response.data.success) {
              setMessage(editing ? '更新成功' : '创建成功');
              setOpen(false);
              await loadData();
            } else {
              setMessage(response.data.error.message);
            }
          }}
        >
          <div>
            <label className="mb-2 block text-sm font-medium">名称</label>
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
            <Button type="submit">{editing ? '保存' : '创建'}</Button>
          </div>
        </form>
      </Dialog>
    </Card>
  );
}
