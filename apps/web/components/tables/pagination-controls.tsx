'use client';

import { DEFAULT_PAGE_SIZE, type PageMeta } from '@ledger/shared';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';

const PAGE_SIZE_OPTIONS = [10, 20, 50].map((value) => ({
  label: `${value} 条 / 页`,
  value: String(value),
}));

type PaginationControlsProps = {
  loading?: boolean;
  meta: PageMeta;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function PaginationControls({
  loading = false,
  meta,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) {
  const totalPages = Math.max(1, Math.ceil(meta.total / meta.pageSize));
  const start = meta.total === 0 ? 0 : (meta.page - 1) * meta.pageSize + 1;
  const end = Math.min(meta.page * meta.pageSize, meta.total);

  return (
    <div className="mt-4 flex flex-col gap-3 border-t border-line pt-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <span>
          共 {meta.total} 条，当前显示 {start}-{end}
        </span>
        <div className="w-36">
          <Select
            allowEmpty={false}
            aria-label="每页条数"
            options={PAGE_SIZE_OPTIONS}
            placeholder={`${DEFAULT_PAGE_SIZE} 条 / 页`}
            value={String(meta.pageSize)}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span>
          第 {meta.page} / {totalPages} 页
        </span>
        <Button
          variant="ghost"
          disabled={loading || meta.page <= 1}
          onClick={() => onPageChange(meta.page - 1)}
          type="button"
        >
          上一页
        </Button>
        <Button
          variant="ghost"
          disabled={loading || meta.page >= totalPages}
          onClick={() => onPageChange(meta.page + 1)}
          type="button"
        >
          下一页
        </Button>
      </div>
    </div>
  );
}
