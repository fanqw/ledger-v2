'use client';

import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  type PageData,
  type PageMeta,
  type PageQuery,
} from '@ledger/shared';
import { useCallback, useEffect, useState } from 'react';

export type MutationResult = {
  ok: boolean;
  message?: string;
};

export type UseCrudPanelOptions<TItem, TForm> = {
  createInitialForm: () => TForm;
  mapItemToForm: (item: TItem) => TForm;
  getItemId: (item: TItem) => string;
  fetchItems: (query: Required<PageQuery>) => Promise<PageData<TItem>>;
  createItem: (form: TForm) => Promise<MutationResult>;
  updateItem: (id: string, form: TForm) => Promise<MutationResult>;
  deleteItem: (id: string) => Promise<MutationResult>;
};

const EMPTY_META: PageMeta = {
  page: DEFAULT_PAGE,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
};

export function useCrudPanel<TItem, TForm>({
  createInitialForm,
  mapItemToForm,
  getItemId,
  fetchItems,
  createItem,
  updateItem,
  deleteItem,
}: UseCrudPanelOptions<TItem, TForm>) {
  const [items, setItems] = useState<TItem[]>([]);
  const [keyword, setKeywordState] = useState('');
  const [page, setPage] = useState(DEFAULT_PAGE);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [meta, setMeta] = useState<PageMeta>(EMPTY_META);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TItem | null>(null);
  const [form, setForm] = useState<TForm>(createInitialForm);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const nextData = await fetchItems({ keyword, page, pageSize });
      setItems(nextData.items);
      setMeta(nextData.meta);
    } finally {
      setLoading(false);
    }
  }, [fetchItems, keyword, page, pageSize]);

  const setKeyword = useCallback((nextKeyword: string) => {
    setKeywordState(nextKeyword);
    setPage(DEFAULT_PAGE);
  }, []);

  const changePageSize = useCallback((nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(DEFAULT_PAGE);
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  const openCreate = useCallback(() => {
    setMessage('');
    setEditingItem(null);
    setForm(createInitialForm());
    setOpen(true);
  }, [createInitialForm]);

  const openEdit = useCallback(
    (item: TItem) => {
      setMessage('');
      setEditingItem(item);
      setForm(mapItemToForm(item));
      setOpen(true);
    },
    [mapItemToForm],
  );

  const closeDialog = useCallback(() => {
    setOpen(false);
    setEditingItem(null);
    setForm(createInitialForm());
  }, [createInitialForm]);

  const submit = useCallback(async () => {
    setSubmitting(true);
    try {
      const result = editingItem
        ? await updateItem(getItemId(editingItem), form)
        : await createItem(form);

      setMessage(result.ok ? result.message || '保存成功' : result.message || '操作失败');
      if (result.ok) {
        closeDialog();
        await loadData();
      }
    } finally {
      setSubmitting(false);
    }
  }, [closeDialog, createItem, editingItem, form, getItemId, loadData, updateItem]);

  const remove = useCallback(
    async (item: TItem) => {
      const id = getItemId(item);
      setDeletingId(id);
      try {
        const result = await deleteItem(id);
        setMessage(result.ok ? result.message || '删除成功' : result.message || '删除失败');
        if (result.ok) {
          const shouldGoPreviousPage =
            items.length === 1 && page > DEFAULT_PAGE && meta.total > items.length;

          if (shouldGoPreviousPage) {
            setPage((currentPage) => Math.max(DEFAULT_PAGE, currentPage - 1));
          } else {
            await loadData();
          }
        }
      } finally {
        setDeletingId(null);
      }
    },
    [deleteItem, getItemId, items.length, loadData, meta.total, page],
  );

  return {
    items,
    keyword,
    setKeyword,
    page,
    setPage,
    pageSize,
    setPageSize: changePageSize,
    meta,
    open,
    openCreate,
    openEdit,
    closeDialog,
    editingItem,
    form,
    setForm,
    message,
    setMessage,
    loading,
    submitting,
    deletingId,
    submit,
    remove,
    reload: loadData,
  };
}
