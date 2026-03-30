import { cn } from "@/lib/utils";

type BadgeVariant = "new" | "pending" | "approved" | "delivered" | "rejected";

const STATUS_MAP: Record<string, { variant: BadgeVariant; label: string }> = {
  new: { variant: "new", label: "New" },
  pending: { variant: "pending", label: "Pending" },
  inreview: { variant: "pending", label: "In Review" },
  quoted: { variant: "pending", label: "Quoted" },
  accepted: { variant: "approved", label: "Accepted" },
  approved: { variant: "approved", label: "Approved" },
  inproduction: { variant: "approved", label: "In Production" },
  shipped: { variant: "delivered", label: "Shipped" },
  delivered: { variant: "delivered", label: "Delivered" },
  rejected: { variant: "rejected", label: "Rejected" },
  closed: { variant: "rejected", label: "Closed" },
  cancelled: { variant: "rejected", label: "Cancelled" },
};

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  new: "badge-new",
  pending: "badge-pending",
  approved: "badge-approved",
  delivered: "badge-delivered",
  rejected: "badge-rejected",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const key = status.toLowerCase().replace(/[^a-z]/g, "");
  const config = STATUS_MAP[key] ?? {
    variant: "new" as BadgeVariant,
    label: status,
  };
  return (
    <span className={cn(VARIANT_CLASSES[config.variant], className)}>
      {config.label}
    </span>
  );
}
