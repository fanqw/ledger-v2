import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition',
          variant === 'primary' && 'bg-ink text-white hover:bg-slate-800',
          variant === 'secondary' && 'bg-accent text-white hover:bg-teal-700',
          variant === 'ghost' && 'bg-white text-ink ring-1 ring-line hover:bg-slate-50',
          variant === 'danger' && 'bg-danger text-white hover:bg-red-800',
          'disabled:cursor-not-allowed disabled:opacity-60',
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
