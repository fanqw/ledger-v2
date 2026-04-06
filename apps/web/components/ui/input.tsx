import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none ring-0 transition placeholder:text-slate-400 focus:border-accent',
        className,
      )}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
