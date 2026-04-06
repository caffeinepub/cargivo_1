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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useActor } from "../hooks/useActor";

interface QuoteRequestModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const BOX_TYPES = ["Wooden Box", "Plastic Box", "Industrial Custom"];

export function QuoteRequestModal({
  open,
  onClose,
  onSuccess,
}: QuoteRequestModalProps) {
  const { actor } = useActor();
  const [boxType, setBoxType] = useState("");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor || !boxType || !quantity) {
      toast.error("Please fill in all required fields");
      return;
    }
    setIsSubmitting(true);
    try {
      const desc = `${boxType} | ${length}x${width}x${height}mm | ${description}`;
      await actor.submitQuoteRequest([
        { description: desc, quantity: BigInt(Number(quantity)) },
      ]);
      toast.success("Quote request submitted! We'll get back to you shortly.");
      onSuccess?.();
      onClose();
      // reset
      setBoxType("");
      setLength("");
      setWidth("");
      setHeight("");
      setQuantity("");
      setDescription("");
    } catch {
      toast.error("Failed to submit quote request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md" data-ocid="quote_request.dialog">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Box Type *</Label>
            <Select value={boxType} onValueChange={setBoxType}>
              <SelectTrigger data-ocid="quote_request.select">
                <SelectValue placeholder="Select box type" />
              </SelectTrigger>
              <SelectContent>
                {BOX_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Dimensions (mm)</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                placeholder="Length"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                data-ocid="quote_request.input"
              />
              <Input
                placeholder="Width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <Input
                placeholder="Height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Quantity *</Label>
            <Input
              type="number"
              placeholder="e.g. 100"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              required
              data-ocid="quote_request.input"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Additional Notes</Label>
            <Textarea
              placeholder="Special requirements, materials, finish..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              data-ocid="quote_request.textarea"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              data-ocid="quote_request.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
              data-ocid="quote_request.submit_button"
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
