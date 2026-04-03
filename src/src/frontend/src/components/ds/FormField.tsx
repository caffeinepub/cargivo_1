import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  as?: "input" | "textarea";
  rows?: number;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  (
    {
      label,
      required,
      error,
      hint,
      as = "input",
      rows = 3,
      className,
      id,
      ...props
    },
    ref,
  ) => {
    const fieldId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={fieldId}
            className="text-sm font-medium text-foreground"
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {as === "textarea" ? (
          <textarea
            id={fieldId}
            rows={rows}
            className={cn(
              "form-input resize-none",
              error && "border-destructive focus:ring-destructive/40",
              className,
            )}
            {...(props as any)}
          />
        ) : (
          <input
            ref={ref}
            id={fieldId}
            className={cn(
              "form-input",
              error && "border-destructive focus:ring-destructive/40",
              className,
            )}
            {...props}
          />
        )}

        {error && (
          <p className="text-xs text-destructive font-medium">{error}</p>
        )}
        {hint && !error && (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    );
  },
);

FormField.displayName = "FormField";
