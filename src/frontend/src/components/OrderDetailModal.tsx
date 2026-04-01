import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { OrderStatus, UserRole } from "../backend";
import { useActor } from "../hooks/useActor";
import type { SampleOrder } from "../pages/sampleData";
import { StatusBadge } from "./StatusBadge";

interface OrderDetailModalProps {
  order: SampleOrder | null;
  open: boolean;
  onClose: () => void;
  viewerRole: UserRole;
  onRefresh?: () => void;
}

const STATUS_OPTIONS = [
  { value: OrderStatus.pending, label: "Pending" },
  { value: OrderStatus.inReview, label: "In Review" },
  { value: OrderStatus.quoted, label: "Quoted" },
  { value: OrderStatus.accepted, label: "Accepted" },
  { value: OrderStatus.inProduction, label: "In Production" },
  { value: OrderStatus.shipped, label: "Shipped" },
  { value: OrderStatus.delivered, label: "Delivered" },
  { value: OrderStatus.cancelled, label: "Cancelled" },
];

export function OrderDetailModal({
  order,
  open,
  onClose,
  viewerRole,
  onRefresh,
}: OrderDetailModalProps) {
  const { actor } = useActor();
  const [newStatus, setNewStatus] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);

  if (!order) return null;

  const handleStatusUpdate = async () => {
    if (!actor || !newStatus) return;
    setIsUpdating(true);
    try {
      await actor.updateOrderStatus(
        BigInt(order.id as bigint),
        newStatus as OrderStatus,
      );
      toast.success("Order status updated");
      onRefresh?.();
      onClose();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAcceptQuote = async () => {
    if (!actor) return;
    setIsAccepting(true);
    try {
      await actor.acceptQuote(BigInt(order.id as bigint));
      toast.success("Quote accepted!");
      onRefresh?.();
      onClose();
    } catch {
      toast.error("Failed to accept quote");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg" data-ocid="order_detail.dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Order #{order.id.toString()}
            <StatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground">Box Type</p>
              <p className="font-medium">{order.boxType}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Quantity</p>
              <p className="font-medium">{order.qty.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Order Date</p>
              <p className="font-medium">{order.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Amount</p>
              <p className="font-medium">
                {order.amount > 0 ? `$${order.amount.toLocaleString()}` : "—"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Customer</p>
              <p className="font-medium">{order.customer}</p>
            </div>
          </div>

          {/* Admin controls */}
          {viewerRole === UserRole.admin && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold text-sm">Admin Actions</h4>
              <div className="space-y-2">
                <Label htmlFor="status-select">Update Status</Label>
                <Select
                  value={newStatus || order.status}
                  onValueChange={setNewStatus}
                >
                  <SelectTrigger
                    id="status-select"
                    data-ocid="order_detail.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="amount-input">Set Amount ($)</Label>
                <Input
                  id="amount-input"
                  type="number"
                  placeholder={order.amount.toString()}
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  data-ocid="order_detail.input"
                />
              </div>
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating}
                className="w-full bg-primary hover:bg-primary/90"
                data-ocid="order_detail.save_button"
              >
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          )}

          {/* Customer accept quote */}
          {viewerRole === UserRole.user &&
            order.status === OrderStatus.quoted && (
              <div className="border-t pt-4">
                <div className="bg-blue-50 rounded-xl p-3 mb-3">
                  <p className="text-sm text-blue-700">
                    A quote of <strong>${order.amount.toLocaleString()}</strong>{" "}
                    has been provided for your order.
                  </p>
                </div>
                <Button
                  onClick={handleAcceptQuote}
                  disabled={isAccepting}
                  className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
                  data-ocid="order_detail.confirm_button"
                >
                  {isAccepting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Accept Quote
                </Button>
              </div>
            )}
        </div>

        <div className="flex justify-end pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            data-ocid="order_detail.close_button"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
