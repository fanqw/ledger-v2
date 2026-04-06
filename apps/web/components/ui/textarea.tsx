import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      'min-h-28 w-full rounded-xl border border-line bg-white px-3 py-2 text-sm outline-none transition placeholder:text-slate-400 focus:border-accent',
      className,
    )}
    {...props}
  />
));

Textarea.displayName = 'Textarea';
