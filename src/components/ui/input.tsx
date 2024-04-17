import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/utils";

const inputVariants = cva(
  "flex h-10 w-full rounded-md border  bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50  dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900",
  {
    variants: {
      error: {
        true: "border-rose-500",
        false: "border-slate-300 dark:border-slate-700",
      },
    },
    defaultVariants: {
      error: false,
    },
  },
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof inputVariants> {
  errorText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, errorText, ...props }, ref) => {
    return (
      <>
        <input
          className={cn(inputVariants({ error, className }))}
          ref={ref}
          {...props}
        />
        {error && <p className="text-sm text-rose-500">{errorText}</p>}
      </>
    );
  },
);
Input.displayName = "Input";

export { Input };
