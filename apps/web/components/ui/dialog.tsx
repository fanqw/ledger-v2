'use client';

import { cn } from '@/lib/utils/cn';
import { Button } from './button';

export function Dialog({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
      <div className={cn('w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl')}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Button variant="ghost" onClick={onClose}>
            关闭
          </Button>
        </div>
        {children}
      </div>
    </div>
  );
}
