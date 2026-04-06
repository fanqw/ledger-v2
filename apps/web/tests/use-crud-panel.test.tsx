import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import type { PageData } from '@ledger/shared';
import { describe, expect, it, vi } from 'vitest';
import { useCrudPanel, type MutationResult } from '@/lib/hooks/use-crud-panel';

type TestItem = {
  id: string;
  name: string;
};

type TestForm = {
  name: string;
};

function TestHarness({
  deleteItem = async () => ({ ok: true }),
  fetchItems,
}: {
  deleteItem?: (id: string) => Promise<MutationResult>;
  fetchItems: (query: {
    keyword: string;
    page: number;
    pageSize: number;
  }) => Promise<PageData<TestItem>>;
}) {
  const crud = useCrudPanel<TestItem, TestForm>({
    createInitialForm: () => ({ name: '' }),
    mapItemToForm: (item) => ({ name: item.name }),
    getItemId: (item) => item.id,
    fetchItems,
    createItem: async () => ({ ok: true }),
    updateItem: async () => ({ ok: true }),
    deleteItem,
  });

  return (
    <div>
      <div data-testid="page">{crud.page}</div>
      <div data-testid="page-size">{crud.pageSize}</div>
      <div data-testid="keyword">{crud.keyword}</div>
      <div data-testid="item-count">{crud.items.length}</div>
      <button onClick={() => crud.setPage(2)} type="button">
        goto-page-2
      </button>
      <button onClick={() => crud.setKeyword('milk')} type="button">
        set-keyword
      </button>
      <button onClick={() => crud.setPageSize(20)} type="button">
        set-page-size
      </button>
      <button
        disabled={crud.items.length === 0}
        onClick={() => void crud.remove(crud.items[0])}
        type="button"
      >
        remove-first
      </button>
    </div>
  );
}

describe('useCrudPanel', () => {
  it('resets to page 1 when keyword or page size changes', async () => {
    const fetchItems = vi.fn(
      async ({ keyword, page, pageSize }: { keyword: string; page: number; pageSize: number }) => ({
        items: [],
        meta: { page, pageSize, total: keyword ? 3 : 0 },
      }),
    );

    render(<TestHarness fetchItems={fetchItems} />);

    await waitFor(() => {
      expect(fetchItems).toHaveBeenCalledWith({ keyword: '', page: 1, pageSize: 10 });
    });

    fireEvent.click(screen.getByRole('button', { name: 'goto-page-2' }));
    await waitFor(() => {
      expect(fetchItems).toHaveBeenLastCalledWith({ keyword: '', page: 2, pageSize: 10 });
    });

    fireEvent.click(screen.getByRole('button', { name: 'set-keyword' }));
    await waitFor(() => {
      expect(fetchItems).toHaveBeenLastCalledWith({ keyword: 'milk', page: 1, pageSize: 10 });
    });
    expect(screen.getByTestId('page').textContent).toBe('1');
    expect(screen.getByTestId('keyword').textContent).toBe('milk');

    fireEvent.click(screen.getByRole('button', { name: 'goto-page-2' }));
    await waitFor(() => {
      expect(fetchItems).toHaveBeenLastCalledWith({ keyword: 'milk', page: 2, pageSize: 10 });
    });

    fireEvent.click(screen.getByRole('button', { name: 'set-page-size' }));
    await waitFor(() => {
      expect(fetchItems).toHaveBeenLastCalledWith({ keyword: 'milk', page: 1, pageSize: 20 });
    });
    expect(screen.getByTestId('page-size').textContent).toBe('20');
  });

  it('moves back one page after deleting the last item on a later page', async () => {
    const fetchItems = vi.fn(
      async ({ page, pageSize, keyword }: { keyword: string; page: number; pageSize: number }) => ({
        items: page === 2 ? [{ id: 'item-1', name: 'Milk' }] : [{ id: 'item-2', name: 'Tea' }],
        meta: { page, pageSize, total: 11 },
      }),
    );
    const deleteItem = vi.fn(async () => ({ ok: true }));

    render(<TestHarness deleteItem={deleteItem} fetchItems={fetchItems} />);
    await waitFor(() => {
      expect(fetchItems).toHaveBeenLastCalledWith({ keyword: '', page: 1, pageSize: 10 });
    });

    fireEvent.click(screen.getByRole('button', { name: 'goto-page-2' }));
    await waitFor(() => {
      expect(fetchItems).toHaveBeenLastCalledWith({ keyword: '', page: 2, pageSize: 10 });
    });

    fireEvent.click(screen.getByRole('button', { name: 'remove-first' }));
    await waitFor(() => {
      expect(deleteItem).toHaveBeenCalledWith('item-1');
      expect(fetchItems).toHaveBeenLastCalledWith({ keyword: '', page: 1, pageSize: 10 });
    });
    expect(screen.getByTestId('page').textContent).toBe('1');
    expect(screen.getByTestId('item-count').textContent).toBe('1');
  });
});
