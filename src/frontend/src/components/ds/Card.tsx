import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
  className?: string;
  bodyClassName?: string;
}

export function Card({
  children,
  header,
  footer,
  className,
  bodyClassName,
}: CardProps) {
  return (
    <div className={cn("card-base overflow-hidden", className)}>
      {header && (
        <div className="px-5 py-4 border-b border-border font-semibold text-foreground">
          {header}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-border bg-muted/30">
          {footer}
        </div>
      )}
    </div>
  );
}
