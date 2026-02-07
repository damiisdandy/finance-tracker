"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

function formatWithCommas(value: string): string {
  if (!value) return "";
  const parts = value.split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.join(".");
}

function stripNonNumeric(value: string): string {
  return value.replace(/[^0-9.\-]/g, "");
}

const NumberInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<"input">, "type" | "onChange"> & {
    onChange?: (e: React.ChangeEvent<HTMLInputElement> | string) => void;
  }
>(({ className, onChange, value, onFocus, onBlur, ...props }, ref) => {
  const [focused, setFocused] = React.useState(false);

  const rawValue = typeof value === "number" ? String(value) : (value as string) ?? "";

  const displayValue = focused ? rawValue : formatWithCommas(rawValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = stripNonNumeric(e.target.value);
    if (onChange) {
      const syntheticEvent = {
        ...e,
        target: { ...e.target, value: stripped },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(syntheticEvent);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(false);
    onBlur?.(e);
  };

  return (
    <input
      ref={ref}
      type="text"
      inputMode="decimal"
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      {...props}
    />
  );
});
NumberInput.displayName = "NumberInput";

export { NumberInput };
