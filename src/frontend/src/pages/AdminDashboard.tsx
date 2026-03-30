import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Clock,
  CreditCard,
  Mail,
  MapPin,
  Package,
  PackageCheck,
  PackageSearch,
  RefreshCcw,
  Truck,
  UserCheck,
  UserX,
} from "lucide-react";
import { useState } from "react";
import { AdminOrderDetailModal } from "../components/AdminOrderDetailModal";
import { StatusBadge } from "../components/ds/StatusBadge";
import { SAMPLE_ORDERS, type SampleOrder } from "./sampleData";

// ── helpers ──────────────────────────────────────────────────────────────────
function count(status: string | string[]) {
  const statuses = Array.isArray(status) ? status : [status];
  return SAMPLE_ORDERS.filter((o) => statuses.includes(o.status.toLowerCase()))
    .length;
}

// ── Needs-Action cards ────────────────────────────────────────────────────────
const ACTION_CARDS = [
  {
    label: "Not Assigned",
    count: SAMPLE_ORDERS.filter((o) => !o.assignedTo).length,
    border: "border-l-red-500",
    icon: <UserX size={20} className="text-red-500" />,
    bg: "bg-red-50",
  },
  {
    label: "Quote Not Sent",
    count: count(["assigned"]),
    border: "border-l-orange-500",
    icon: <PackageSearch size={20} className="text-orange-500" />,
    bg: "bg-orange-50",
  },
  {
    label: "Pending Approval",
    count: count(["quoted"]),
    border: "border-l-yellow-500",
    icon: <Clock size={20} className="text-yellow-600" />,
    bg: "bg-yellow-50",
  },
  {
    label: "Advance Payment Verification",
    count: SAMPLE_ORDERS.filter(
      (o) => o.status === "accepted" && o.paymentSubmitted,
    ).length,
    border: "border-l-blue-500",
    icon: <CreditCard size={20} className="text-blue-500" />,
    bg: "bg-blue-50",
  },
  {
    label: "Final Payment Verification",
    count: count(["finalpaymentpending", "finalPaymentPending"]),
    border: "border-l-purple-500",
    icon: <CheckCircle2 size={20} className="text-purple-500" />,
    bg: "bg-purple-50",
  },
  {
    label: "Stuck Orders",
    count: 1,
    border: "border-l-gray-500",
    icon: <AlertTriangle size={20} className="text-gray-500" />,
    bg: "bg-gray-50",
  },
];

// ── Summary card config ───────────────────────────────────────────────────────
const SUMMARY_CARDS = [
  {
    label: "New Orders",
    status: ["new"],
    icon: <Package size={18} className="text-slate-600" />,
    bg: "bg-slate-50",
  },
  {
    label: "Assigned",
    status: ["assigned"],
    icon: <UserCheck size={18} className="text-blue-600" />,
    bg: "bg-blue-50",
  },
  {
    label: "Quotation Sent",
    status: ["quoted"],
    icon: <PackageSearch size={18} className="text-orange-600" />,
    bg: "bg-orange-50",
  },
  {
    label: "Pending Approval",
    status: ["accepted"],
    icon: <Clock size={18} className="text-yellow-600" />,
    bg: "bg-yellow-50",
  },
  {
    label: "Preparing",
    status: ["advanceVerified", "preparing"],
    icon: <Boxes size={18} className="text-indigo-600" />,
    bg: "bg-indigo-50",
  },
  {
    label: "In Transit",
    status: ["inTransit"],
    icon: <Truck size={18} className="text-cyan-600" />,
    bg: "bg-cyan-50",
  },
  {
    label: "Delivered",
    status: ["delivered"],
    icon: <PackageCheck size={18} className="text-emerald-600" />,
    bg: "bg-emerald-50",
  },
  {
    label: "Completed",
    status: ["completed"],
    icon: <CheckCircle2 size={18} className="text-green-600" />,
    bg: "bg-green-50",
  },
  {
    label: "Total Orders Done",
    status: ["delivered", "completed"],
    icon: <PackageCheck size={18} className="text-teal-600" />,
    bg: "bg-teal-50",
  },
  {
    label: "Total Pending",
    status: [
      "new",
      "assigned",
      "quoted",
      "accepted",
      "advanceVerified",
      "preparing",
      "inTransit",
    ],
    icon: <RefreshCcw size={18} className="text-rose-600" />,
    bg: "bg-rose-50",
  },
];

// ── State-wise table data ─────────────────────────────────────────────────────
const STATE_ROWS = [
  {
    state: "Maharashtra",
    new: 2,
    assigned: 1,
    quotePending: 1,
    preparing: 1,
    inTransit: 1,
    completed: 2,
  },
  {
    state: "Gujarat",
    new: 1,
    assigned: 0,
    quotePending: 1,
    preparing: 0,
    inTransit: 0,
    completed: 1,
  },
  {
    state: "Karnataka",
    new: 0,
    assigned: 1,
    quotePending: 0,
    preparing: 0,
    inTransit: 1,
    completed: 0,
  },
  {
    state: "Tamil Nadu",
    new: 1,
    assigned: 1,
    quotePending: 0,
    preparing: 1,
    inTransit: 0,
    completed: 0,
  },
  {
    state: "Delhi",
    new: 0,
    assigned: 0,
    quotePending: 1,
    preparing: 0,
    inTransit: 0,
    completed: 1,
  },
  {
    state: "Rajasthan",
    new: 0,
    assigned: 1,
    quotePending: 0,
    preparing: 1,
    inTransit: 0,
    completed: 0,
  },
];

export function AdminDashboard() {
  const [selectedOrder, setSelectedOrder] = useState<SampleOrder | null>(null);

  return (
    <div className="space-y-6" data-ocid="admin_dashboard.panel">
      {/* Internal Top Bar */}
      <div className="flex items-center justify-between pb-2 border-b border-border">
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="btn-ghost w-9 h-9 flex items-center justify-center rounded-xl relative"
            data-ocid="admin_dashboard.mail.button"
          >
            <Mail size={18} className="text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
          <div className="flex items-center gap-2 bg-muted/40 border border-border rounded-xl px-3 py-1.5">
            <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">AD</span>
            </div>
            <span className="text-sm font-medium text-foreground">Admin</span>
          </div>
        </div>
      </div>

      {/* Section 1: Needs Action */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-base font-bold text-foreground">
            Orders Needing Action
          </h2>
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs text-muted-foreground bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">
            Requires attention
          </span>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {ACTION_CARDS.map((card) => (
            <div
              key={card.label}
              className={`bg-white border border-border border-l-4 ${card.border} rounded-xl p-4 flex items-center gap-3`}
            >
              <div
                className={`w-10 h-10 ${card.bg} rounded-xl flex items-center justify-center flex-shrink-0`}
              >
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl font-bold text-foreground">
                  {card.count}
                </p>
                <p className="text-xs text-muted-foreground leading-tight">
                  {card.label}
                </p>
              </div>
              <button
                type="button"
                className="btn-secondary text-xs px-3 py-1.5 flex-shrink-0"
                data-ocid={`admin_dashboard.action_${card.label.replace(/\s+/g, "_").toLowerCase()}.button`}
              >
                View
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Section 2: Summary Cards */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3">Overview</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SUMMARY_CARDS.map((card) => {
            const c = SAMPLE_ORDERS.filter((o) =>
              card.status.includes(o.status),
            ).length;
            return (
              <div
                key={card.label}
                className="bg-white border border-border rounded-xl p-4 text-center"
              >
                <div
                  className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center mx-auto mb-2`}
                >
                  {card.icon}
                </div>
                <p className="text-2xl font-bold text-foreground">{c}</p>
                <p className="text-xs text-muted-foreground leading-tight mt-0.5">
                  {card.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 3: State-wise Table */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={16} className="text-primary" />
          <h2 className="text-base font-bold text-foreground">
            Orders by State
          </h2>
        </div>
        <div className="bg-white border border-border rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>State</TableHead>
                <TableHead className="text-center">New</TableHead>
                <TableHead className="text-center">Assigned</TableHead>
                <TableHead className="text-center">Quote Pending</TableHead>
                <TableHead className="text-center">Preparing</TableHead>
                <TableHead className="text-center">In Transit</TableHead>
                <TableHead className="text-center">Completed</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {STATE_ROWS.map((row, i) => (
                <TableRow
                  key={row.state}
                  className={i % 2 === 1 ? "bg-muted/20" : ""}
                  data-ocid={`admin_dashboard.state_table.item.${i + 1}`}
                >
                  <TableCell className="font-medium">{row.state}</TableCell>
                  <TableCell className="text-center">{row.new}</TableCell>
                  <TableCell className="text-center">{row.assigned}</TableCell>
                  <TableCell className="text-center">
                    {row.quotePending}
                  </TableCell>
                  <TableCell className="text-center">{row.preparing}</TableCell>
                  <TableCell className="text-center">{row.inTransit}</TableCell>
                  <TableCell className="text-center">{row.completed}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Section 4: Recent Orders Table */}
      <section>
        <h2 className="text-base font-bold text-foreground mb-3">
          Recent Orders
        </h2>
        <div
          className="bg-white border border-border rounded-xl overflow-hidden"
          data-ocid="admin_dashboard.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>REQ ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {SAMPLE_ORDERS.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-12 text-muted-foreground"
                    data-ocid="admin_dashboard.empty_state"
                  >
                    No orders found.
                  </TableCell>
                </TableRow>
              ) : (
                SAMPLE_ORDERS.map((order, i) => (
                  <TableRow
                    key={order.id.toString()}
                    className={i % 2 === 1 ? "bg-muted/20" : ""}
                    data-ocid={`admin_dashboard.item.${i + 1}`}
                  >
                    <TableCell className="font-mono text-sm font-medium text-primary">
                      #CGV-00{order.id.toString()}
                    </TableCell>
                    <TableCell className="text-sm">{order.customer}</TableCell>
                    <TableCell className="text-sm">
                      {order.state ?? "—"}
                    </TableCell>
                    <TableCell className="text-sm">
                      {order.assignedTo ? (
                        <span className="text-foreground">
                          {order.assignedTo}
                        </span>
                      ) : (
                        <span className="text-muted-foreground italic">
                          Not assigned
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          className="btn-secondary text-xs px-2.5 py-1.5"
                          onClick={() => setSelectedOrder(order)}
                          data-ocid={`admin_dashboard.view.button.${i + 1}`}
                        >
                          View
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs px-2.5 py-1.5"
                          data-ocid={`admin_dashboard.assign.button.${i + 1}`}
                        >
                          Assign
                        </button>
                        <button
                          type="button"
                          className="btn-ghost text-xs px-2.5 py-1.5"
                          data-ocid={`admin_dashboard.check_payment.button.${i + 1}`}
                        >
                          Check Payment
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <AdminOrderDetailModal
        order={selectedOrder}
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </div>
  );
}
