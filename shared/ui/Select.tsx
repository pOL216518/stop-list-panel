'use client';

import type { SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  placeholder?: string;
}

export function Select({ options, placeholder, className = '', ...rest }: SelectProps) {
  return (
    <select
      className={`rounded-md border border-[#D8D2C7] bg-white px-3 py-2 text-sm text-[#171512] focus:border-[#C6462F] focus:outline-none focus:ring-1 focus:ring-[#C6462F] ${className}`}
      {...rest}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}