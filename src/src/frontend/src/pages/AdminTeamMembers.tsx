import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "../components/ds/StatusBadge";
import { getQuoteRequests } from "../utils/quoteStore";

const TEAM_MEMBERS_KEY = "cargivo_team_members";

interface TeamMember {
  id: number;
  name: string;
  email: string;
  phone: string;
  state: string;
  area: string;
  role: string;
  status: "active" | "inactive";
}

function loadMembers(): TeamMember[] {
  try {
    const s = localStorage.getItem(TEAM_MEMBERS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveMembers(members: TeamMember[]) {
  localStorage.setItem(TEAM_MEMBERS_KEY, JSON.stringify(members));
}

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  state: "",
  area: "",
  status: "active" as "active" | "inactive",
};

export function AdminTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(() => loadMembers());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [viewingMember, setViewingMember] = useState<TeamMember | null>(null);

  function persistMembers(updated: TeamMember[]) {
    setMembers(updated);
    saveMembers(updated);
  }

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (m: TeamMember) => {
    setEditingId(m.id);
    setForm({
      name: m.name,
      email: m.email,
      phone: m.phone,
      state: m.state,
      area: m.area,
      status: m.status,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) {
      toast.error("Name and email are required");
      return;
    }
    if (editingId !== null) {
      const updated = members.map((m) =>
        m.id === editingId ? { ...m, ...form } : m,
      );
      persistMembers(updated);
      toast.success("Member updated successfully");
    } else {
      const maxId =
        members.length > 0 ? Math.max(...members.map((m) => m.id)) : 0;
      const updated = [
        ...members,
        { id: maxId + 1, ...form, role: "team_member" },
      ];
      persistMembers(updated);
      toast.success("Member added successfully");
    }
    setDialogOpen(false);
  };

  const toggleStatus = (id: number) => {
    const updated = members.map((m) =>
      m.id === id
        ? {
            ...m,
            status:
              m.status === "active"
                ? ("inactive" as const)
                : ("active" as const),
          }
        : m,
    );
    persistMembers(updated);
  };

  const resetPassword = (email: string) => {
    toast.success(`Password reset link sent to ${email}`);
  };

  // Detail modal data
  const memberOrders = viewingMember
    ? getQuoteRequests().filter((q) => q.assignedTo === viewingMember.name)
    : [];
  const inProgressOrders = memberOrders.filter(
    (q) => q.status === "inProduction" || q.status === "shipped",
  );
  const completedOrders = memberOrders.filter((q) => q.status === "delivered");

  return (
    <div className="space-y-6" data-ocid="admin_team_members.panel">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Team Members</h2>
        <button
          type="button"
          className="btn-primary flex items-center gap-2"
          onClick={openAdd}
          data-ocid="admin_team_members.open_modal_button"
        >
          <UserPlus size={16} />
          Add Member
        </button>
      </div>

      <div
        className="bg-white border border-border rounded-xl shadow-card overflow-hidden"
        data-ocid="admin_team_members.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Assigned State</TableHead>
              <TableHead>Assigned Area</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-12 text-muted-foreground"
                  data-ocid="admin_team_members.empty_state"
                >
                  No team members yet. Click "Add Member" to get started.
                </TableCell>
              </TableRow>
            ) : (
              members.map((m, i) => (
                <TableRow
                  key={m.id}
                  className={i % 2 === 1 ? "bg-muted/20" : ""}
                  data-ocid={`admin_team_members.item.${i + 1}`}
                >
                  <TableCell className="font-medium text-sm">
                    {m.name}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {m.email}
                  </TableCell>
                  <TableCell className="text-sm">{m.phone}</TableCell>
                  <TableCell className="text-sm">{m.state}</TableCell>
                  <TableCell className="text-sm">{m.area}</TableCell>
                  <TableCell>
                    {m.status === "active" ? (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="btn-secondary text-xs px-2 py-1 flex items-center gap-1"
                        onClick={() => setViewingMember(m)}
                        data-ocid={`admin_team_members.secondary_button.${i + 1}`}
                      >
                        <Eye size={12} />
                        View
                      </button>
                      <button
                        type="button"
                        className="btn-secondary text-xs px-2 py-1"
                        onClick={() => openEdit(m)}
                        data-ocid={`admin_team_members.edit_button.${i + 1}`}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className={`btn-ghost text-xs px-2 py-1 ${
                          m.status === "active"
                            ? "text-red-500 hover:text-red-700"
                            : "text-emerald-600 hover:text-emerald-800"
                        }`}
                        onClick={() => toggleStatus(m.id)}
                        data-ocid={`admin_team_members.toggle.${i + 1}`}
                      >
                        {m.status === "active" ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        className="btn-ghost text-xs px-2 py-1 text-muted-foreground hover:text-foreground"
                        onClick={() => resetPassword(m.email)}
                        data-ocid={`admin_team_members.button.${i + 1}`}
                      >
                        Reset Password
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="max-w-lg"
          data-ocid="admin_team_members.dialog"
        >
          <DialogHeader>
            <DialogTitle>
              {editingId !== null ? "Edit Member" : "Add Member"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Full Name
              </Label>
              <input
                type="text"
                className="form-input"
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="admin_team_members.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-1 block">Email</Label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="member@cargivo.in"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1 block">Phone</Label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98xxx xxxxx"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-1 block">
                  Assigned State
                </Label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Maharashtra"
                  value={form.state}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, state: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1 block">
                  Assigned Area
                </Label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pune West"
                  value={form.area}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, area: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">Role</Label>
              <input
                type="text"
                className="form-input bg-muted/50 cursor-not-allowed"
                value="team_member"
                disabled
              />
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">Status</Label>
              <Select
                value={form.status}
                onValueChange={(v: "active" | "inactive") =>
                  setForm((f) => ({ ...f, status: v }))
                }
              >
                <SelectTrigger
                  className="form-input h-auto"
                  data-ocid="admin_team_members.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin_team_members.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              data-ocid="admin_team_members.submit_button"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Member Detail Dialog */}
      <Dialog
        open={!!viewingMember}
        onOpenChange={(open) => !open && setViewingMember(null)}
      >
        <DialogContent
          className="max-w-2xl"
          data-ocid="admin_team_members.modal"
        >
          <DialogHeader>
            <DialogTitle>Team Member Details</DialogTitle>
          </DialogHeader>

          {viewingMember && (
            <div className="max-h-[70vh] overflow-y-auto space-y-6 pr-1">
              {/* Profile section */}
              <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
                  {viewingMember.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-foreground">
                    {viewingMember.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {viewingMember.email}
                  </p>
                  {viewingMember.phone && (
                    <p className="text-sm text-muted-foreground">
                      {viewingMember.phone}
                    </p>
                  )}
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium">
                      Team Member
                    </span>
                    {viewingMember.status === "active" ? (
                      <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full text-xs font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                        Inactive
                      </span>
                    )}
                    {viewingMember.state && (
                      <span className="bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full text-xs font-medium">
                        📍 {viewingMember.state}
                        {viewingMember.area ? ` — ${viewingMember.area}` : ""}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Summary stat cards */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-border rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-primary">
                    {memberOrders.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Total Assigned
                  </div>
                </div>
                <div className="bg-white border border-border rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-orange-500">
                    {inProgressOrders.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    In Progress
                  </div>
                </div>
                <div className="bg-white border border-border rounded-lg p-3 text-center shadow-sm">
                  <div className="text-2xl font-bold text-emerald-600">
                    {completedOrders.length}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">
                    Completed
                  </div>
                </div>
              </div>

              {/* Assigned Orders table */}
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Assigned Orders
                </h4>
                <div className="border border-border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead className="text-xs">Order ID</TableHead>
                        <TableHead className="text-xs">Box Type</TableHead>
                        <TableHead className="text-xs">Qty</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Customer</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {memberOrders.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="text-center py-8 text-muted-foreground text-sm"
                            data-ocid="admin_team_members.empty_state"
                          >
                            No orders assigned yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        memberOrders.map((order, idx) => (
                          <TableRow
                            key={order.id}
                            className={idx % 2 === 1 ? "bg-muted/20" : ""}
                            data-ocid={`admin_team_members.row.${idx + 1}`}
                          >
                            <TableCell className="text-xs font-mono font-medium">
                              {order.id}
                            </TableCell>
                            <TableCell className="text-xs">
                              {order.boxType}
                            </TableCell>
                            <TableCell className="text-xs">
                              {order.quantity}
                            </TableCell>
                            <TableCell>
                              <StatusBadge status={order.status} />
                            </TableCell>
                            <TableCell className="text-xs">
                              {order.customerName}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(order.submittedAt).toLocaleDateString(
                                "en-IN",
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setViewingMember(null)}
              data-ocid="admin_team_members.close_button"
            >
              Close
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
