import React from "react";

/**
 * Minimal Button component inspired by shadcn/ui.
 * Supports variants: "default" | "outline" | "ghost"
 * Supports sizes: "default" | "sm" | "lg" | "icon"
 */

const base =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  outline: "border border-slate-700 bg-transparent text-white hover:bg-slate-800",
  ghost: "bg-transparent hover:bg-slate-800 text-slate-300",
};

const sizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 px-3 text-xs",
  lg: "h-12 px-8 text-base",
  icon: "h-10 w-10",
};

export function Button({
  className = "",
  variant = "default",
  size = "default",
  children,
  ...props
}) {
  const cls = [base, variants[variant] || variants.default, sizes[size] || sizes.default, className]
    .filter(Boolean)
    .join(" ");

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
