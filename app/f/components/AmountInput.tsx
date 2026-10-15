'use client';

import React, { useRef } from 'react';
import { formatIndianNumberString } from '@/lib/financeUtils';

interface AmountInputProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export default function AmountInput({
  id = 'transaction-amount',
  value,
  onChange,
  placeholder = '0.00',
  required = true,
  disabled = false,
  className,
  autoFocus = false,
}: AmountInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    const rawVal = input.value;
    const oldPos = input.selectionStart ?? rawVal.length;

    // Count non-comma characters before old cursor
    let nonCommasBefore = 0;
    for (let i = 0; i < oldPos; i++) {
      if (rawVal[i] !== ',') {
        nonCommasBefore++;
      }
    }

    // Format using Indian numbering system
    const formatted = formatIndianNumberString(rawVal);

    // Compute new cursor position based on matching non-comma count
    let newPos = 0;
    let count = 0;
    for (let i = 0; i < formatted.length; i++) {
      if (count === nonCommasBefore) {
        newPos = i;
        break;
      }
      if (formatted[i] !== ',') {
        count++;
      }
      newPos = i + 1;
    }

    onChange(formatted);

    // Maintain natural cursor location without jumping
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newPos, newPos);
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // If backspacing immediately after a comma (e.g. "10,|000"), delete the digit before the comma
    if (e.key === 'Backspace' && inputRef.current) {
      const { selectionStart, selectionEnd } = inputRef.current;
      if (selectionStart !== null && selectionStart === selectionEnd && selectionStart > 1) {
        if (value[selectionStart - 1] === ',') {
          e.preventDefault();
          const before = value.slice(0, selectionStart - 2);
          const after = value.slice(selectionStart);
          const updated = formatIndianNumberString(before + after);

          let newPos = 0;
          let count = 0;
          const target = selectionStart - 2;
          for (let i = 0; i < updated.length; i++) {
            if (count === target) {
              newPos = i;
              break;
            }
            if (updated[i] !== ',') count++;
            newPos = i + 1;
          }

          onChange(updated);
          requestAnimationFrame(() => {
            if (inputRef.current) {
              inputRef.current.setSelectionRange(newPos, newPos);
            }
          });
        }
      }
    }
  };

  return (
    <div className="relative">
      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-zinc-500 font-medium select-none pointer-events-none">
        ₹
      </span>
      <input
        ref={inputRef}
        id={id}
        name="amount"
        type="text"
        inputMode="decimal"
        autoComplete="off"
        required={required}
        disabled={disabled}
        autoFocus={autoFocus}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={
          className ||
          'w-full rounded-xl border border-white/10 bg-black/40 pl-8 pr-3.5 py-2.5 text-base sm:text-sm text-foreground font-mono placeholder-zinc-600 focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition'
        }
      />
    </div>
  );
}
