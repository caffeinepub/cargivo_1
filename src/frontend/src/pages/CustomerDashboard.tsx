import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  Package,
  PackageCheck,
  PackageSearch,
  Truck,
  UploadCloud,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { CustomerOrderDetailModal } from "../components/CustomerOrderDetailModal";
import { StatusBadge } from "../components/ds/StatusBadge";
import { useActor } from "../hooks/useActor";
import { SAMPLE_ORDERS, type SampleOrder } from "./sampleData";

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}) {
  return (
    <div className="bg-white border border-border rounded-xl p-5 shadow-card flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

const BOX_TYPES = ["Wooden Box", "Plastic Box", "Industrial Custom"];

const INDIAN_STATES = [
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal",
];

export function CustomerDashboard() {
  const { actor, isFetching } = useActor();
  const [selectedOrder, setSelectedOrder] = useState<SampleOrder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const [boxType, setBoxType] = useState("Wooden Box");
  const [length, setLength] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quantity, setQuantity] = useState("");
  const [deliveryState, setDeliveryState] = useState("");
  const [deliveryCity, setDeliveryCity] = useState("");
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);

  const { data: backendOrders, refetch } = useQuery({
    queryKey: ["ownOrders"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getOwnOrders();
    },
    enabled: !!actor && !isFetching,
  });

  const orders: SampleOrder[] =
    backendOrders && backendOrders.length > 0
      ? backendOrders.map((o) => ({
          id: o.id,
          status: o.status,
          boxType:
            o.items[0]?.description?.split("|")[0]?.trim() ?? "Custom Box",
          qty: Number(o.items[0]?.quantity ?? 0),
          amount: Number(o.totalAmount),
          date: new Date(Number(o.timestamp) / 1_000_000)
            .toISOString()
            .split("T")[0],
          customer: "Me",
        }))
      : SAMPLE_ORDERS;

  const stats = {
    total: orders.length,
    pending: orders.filter(
      (o) =>
        o.status === "pending" ||
        o.status === "inReview" ||
        o.status === "quoted",
    ).length,
    transit: orders.filter((o) =>
      ["accepted", "inProduction", "shipped", "inTransit"].includes(o.status),
    ).length,
    delivered: orders.filter((o) =>
      ["delivered", "completed"].includes(o.status),
    ).length,
  };

  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);
    await new Promise((r) => setTimeout(r, 800));
    toast.success(
      "Quote request submitted! Our team will get back to you shortly.",
    );
    setBoxType("Wooden Box");
    setLength("");
    setWidth("");
    setHeight("");
    setQuantity("");
    setDeliveryState("");
    setDeliveryCity("");
    setFileName(null);
    setIsSubmittingQuote(false);
    refetch();
  };

  return (
    <div className="space-y-6" data-ocid="customer_dashboard.panel">
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Package size={22} className="text-primary" />}
          label="Total Requests"
          value={stats.total}
          color="bg-primary/10"
        />
        <StatCard
          icon={<PackageSearch size={22} className="text-yellow-600" />}
          label="Quote Pending"
          value={stats.pending}
          color="bg-yellow-50"
        />
        <StatCard
          icon={<Truck size={22} className="text-orange-600" />}
          label="In Transit"
          value={stats.transit}
          color="bg-orange-50"
        />
        <StatCard
          icon={<PackageCheck size={22} className="text-emerald-600" />}
          label="Completed"
          value={stats.delivered}
          color="bg-emerald-50"
        />
      </div>

      {/* Row 2: Request Quote Form */}
      <div
        className="bg-white border border-border rounded-xl shadow-card"
        data-ocid="customer_dashboard.quote_form.panel"
      >
        <div className="px-6 py-4 border-b border-border">
          <h3 className="font-semibold text-foreground text-base">
            Request Quote
          </h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Fill in the details below to get a custom cargo box quote
          </p>
        </div>
        <form onSubmit={handleQuoteSubmit} className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="boxType"
              >
                Box Type
              </label>
              <select
                id="boxType"
                value={boxType}
                onChange={(e) => setBoxType(e.target.value)}
                className="form-input w-full"
                required
                data-ocid="customer_dashboard.box_type.select"
              >
                {BOX_TYPES.map((bt) => (
                  <option key={bt} value={bt}>
                    {bt}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="length"
              >
                Length
              </label>
              <input
                id="length"
                type="number"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                placeholder="cm"
                min="1"
                required
                className="form-input w-full"
                data-ocid="customer_dashboard.length.input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="width"
              >
                Width
              </label>
              <input
                id="width"
                type="number"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                placeholder="cm"
                min="1"
                required
                className="form-input w-full"
                data-ocid="customer_dashboard.width.input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="height"
              >
                Height
              </label>
              <input
                id="height"
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="cm"
                min="1"
                required
                className="form-input w-full"
                data-ocid="customer_dashboard.height.input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="quantity"
              >
                Quantity
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="No. of units"
                min="1"
                required
                className="form-input w-full"
                data-ocid="customer_dashboard.quantity.input"
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="deliveryState"
              >
                Delivery State
              </label>
              <select
                id="deliveryState"
                value={deliveryState}
                onChange={(e) => setDeliveryState(e.target.value)}
                className="form-input w-full"
                required
                data-ocid="customer_dashboard.delivery_state.select"
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label
                className="text-sm font-medium text-foreground"
                htmlFor="deliveryCity"
              >
                Delivery City
              </label>
              <input
                id="deliveryCity"
                type="text"
                value={deliveryCity}
                onChange={(e) => setDeliveryCity(e.target.value)}
                placeholder="e.g. Pune"
                required
                className="form-input w-full"
                data-ocid="customer_dashboard.delivery_city.input"
              />
            </div>
          </div>

          <div className="mb-5">
            <label
              htmlFor="fileUploadInput"
              className="text-sm font-medium text-foreground block mb-1.5"
            >
              Specification File (Optional)
            </label>
            <button
              type="button"
              className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors w-full"
              onClick={() => fileInputRef.current?.click()}
              data-ocid="customer_dashboard.dropzone"
            >
              <UploadCloud
                size={28}
                className="mx-auto text-muted-foreground mb-2"
              />
              {fileName ? (
                <p className="text-sm font-medium text-primary">{fileName}</p>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Upload specification file
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PDF, DOCX, or image — max 10MB
                  </p>
                </>
              )}
            </button>
            <input
              id="fileUploadInput"
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.docx,.doc,.png,.jpg,.jpeg"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setFileName(f.name);
              }}
              data-ocid="customer_dashboard.upload_button"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingQuote}
              className="btn-primary px-8 py-2.5 flex items-center gap-2 disabled:opacity-60"
              data-ocid="customer_dashboard.submit_request.primary_button"
            >
              {isSubmittingQuote && (
                <svg
                  aria-hidden="true"
                  className="animate-spin h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
              )}
              Submit Request
            </button>
          </div>
        </form>
      </div>

      {/* Row 3: Order Table */}
      <div
        className="bg-white border border-border rounded-xl shadow-card overflow-hidden"
        data-ocid="customer_dashboard.table"
      >
        <div className="px-5 py-4 border-b border-border flex items-center justify-between">
          <h3 className="font-semibold text-foreground">My Orders</h3>
          <span className="text-xs text-muted-foreground">
            {orders.length} total
          </span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>REQ ID</TableHead>
              <TableHead>Box Type</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="customer_dashboard.empty_state"
                >
                  No orders yet. Submit your first quote request above!
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, i) => (
                <TableRow
                  key={order.id.toString()}
                  className={i % 2 === 1 ? "bg-muted/20" : ""}
                  data-ocid={`customer_dashboard.item.${i + 1}`}
                >
                  <TableCell className="font-mono text-sm font-medium text-primary">
                    #CGV-00{order.id.toString()}
                  </TableCell>
                  <TableCell>{order.boxType}</TableCell>
                  <TableCell>{order.qty.toLocaleString()}</TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      className="btn-secondary text-xs px-3 py-1.5"
                      onClick={() => setSelectedOrder(order)}
                      data-ocid={`customer_dashboard.edit_button.${i + 1}`}
                    >
                      View Details
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <CustomerOrderDetailModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
