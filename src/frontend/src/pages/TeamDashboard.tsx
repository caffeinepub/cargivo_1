import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CheckCircle2, ClipboardList, PackageCheck, Truck } from "lucide-react";
import { useState } from "react";
import { StatusBadge } from "../components/ds/StatusBadge";
import { TeamOrderDetail } from "./TeamOrderDetail";
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
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}
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

export function TeamDashboard() {
  const [selectedOrderId, setSelectedOrderId] = useState<bigint | null>(null);

  const orders: SampleOrder[] = SAMPLE_ORDERS.filter((o) => !!o.assignedTo);

  const assigned = orders.length;
  const quotePending = orders.filter((o) =>
    ["assigned", "quoted"].includes(o.status),
  ).length;
  const inProgress = orders.filter((o) =>
    ["advanceVerified", "preparing", "inTransit"].includes(o.status),
  ).length;
  const delivered = orders.filter((o) => o.status === "delivered").length;

  const selectedOrder = orders.find((o) => o.id === selectedOrderId) ?? null;

  if (selectedOrder) {
    return (
      <TeamOrderDetail
        order={selectedOrder}
        onBack={() => setSelectedOrderId(null)}
      />
    );
  }

  return (
    <div className="space-y-6" data-ocid="team_dashboard.panel">
      <h2 className="text-xl font-bold text-foreground">My Assigned Orders</h2>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<ClipboardList size={22} className="text-primary" />}
          label="Assigned Orders"
          value={assigned}
          color="bg-primary/10"
        />
        <StatCard
          icon={<PackageCheck size={22} className="text-orange-600" />}
          label="Quote Pending"
          value={quotePending}
          color="bg-orange-50"
        />
        <StatCard
          icon={<Truck size={22} className="text-blue-500" />}
          label="In Progress"
          value={inProgress}
          color="bg-blue-50"
        />
        <StatCard
          icon={<CheckCircle2 size={22} className="text-emerald-600" />}
          label="Delivered"
          value={delivered}
          color="bg-emerald-50"
        />
      </div>

      <div
        className="bg-white border border-border rounded-xl shadow-card overflow-hidden"
        data-ocid="team_dashboard.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>REQ ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>State</TableHead>
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
                  data-ocid="team_dashboard.empty_state"
                >
                  No orders assigned to you yet.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, i) => (
                <TableRow
                  key={order.id.toString()}
                  className={i % 2 === 1 ? "bg-muted/20" : ""}
                  data-ocid={`team_dashboard.item.${i + 1}`}
                >
                  <TableCell className="font-mono text-sm font-semibold text-primary">
                    #CGV-00{order.id.toString()}
                  </TableCell>
                  <TableCell className="text-sm font-medium">
                    {order.customer}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {order.state ?? "—"}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.status} />
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      onClick={() => setSelectedOrderId(order.id)}
                      className="btn-secondary text-xs px-3 py-1.5"
                      data-ocid={`team_dashboard.edit_button.${i + 1}`}
                    >
                      Open
                    </button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
