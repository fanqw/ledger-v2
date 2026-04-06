import { forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';

export type SelectOption = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  allowEmpty?: boolean;
  options: SelectOption[];
  placeholder?: string;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      allowEmpty = true,
      className,
      options,
      placeholder = '请选择',
      ...props
    },
    ref,
  ) => (
    <select
      ref={ref}
      className={cn(
        'h-11 w-full rounded-xl border border-line bg-white px-3 text-sm outline-none transition focus:border-accent',
        className,
      )}
      {...props}
    >
      {allowEmpty ? <option value="">{placeholder}</option> : null}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  ),
);

Select.displayName = 'Select';
