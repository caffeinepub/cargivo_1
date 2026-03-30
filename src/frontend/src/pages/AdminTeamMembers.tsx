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
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 1,
    name: "Rahul Verma",
    email: "rahul@cargivo.in",
    phone: "+91 98001 11111",
    state: "Maharashtra",
    area: "Pune West",
    role: "team_member",
    status: "active",
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@cargivo.in",
    phone: "+91 97002 22222",
    state: "Gujarat",
    area: "GIDC Naroda",
    role: "team_member",
    status: "active",
  },
  {
    id: 3,
    name: "Arjun Menon",
    email: "arjun@cargivo.in",
    phone: "+91 96003 33333",
    state: "Tamil Nadu",
    area: "Ambattur Industrial Estate",
    role: "team_member",
    status: "active",
  },
  {
    id: 4,
    name: "Sneha Reddy",
    email: "sneha@cargivo.in",
    phone: "+91 95004 44444",
    state: "Telangana",
    area: "Uppal Industrial Area",
    role: "team_member",
    status: "inactive",
  },
  {
    id: 5,
    name: "Vikram Singh",
    email: "vikram@cargivo.in",
    phone: "+91 94005 55555",
    state: "Haryana",
    area: "IMT Manesar",
    role: "team_member",
    status: "active",
  },
];

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  state: "",
  area: "",
  status: "active" as "active" | "inactive",
};

export function AdminTeamMembers() {
  const [members, setMembers] = useState<TeamMember[]>(INITIAL_MEMBERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

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
      setMembers((prev) =>
        prev.map((m) => (m.id === editingId ? { ...m, ...form } : m)),
      );
      toast.success("Member updated successfully");
    } else {
      const newId = Math.max(...members.map((m) => m.id)) + 1;
      setMembers((prev) => [
        ...prev,
        { id: newId, ...form, role: "team_member" },
      ]);
      toast.success("Member added successfully");
    }
    setDialogOpen(false);
  };

  const toggleStatus = (id: number) => {
    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, status: m.status === "active" ? "inactive" : "active" }
          : m,
      ),
    );
  };

  const resetPassword = (email: string) => {
    toast.success(`Password reset link sent to ${email}`);
  };

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
            {members.map((m, i) => (
              <TableRow
                key={m.id}
                className={i % 2 === 1 ? "bg-muted/20" : ""}
                data-ocid={`admin_team_members.item.${i + 1}`}
              >
                <TableCell className="font-medium text-sm">{m.name}</TableCell>
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
                      data-ocid={`admin_team_members.secondary_button.${i + 1}`}
                    >
                      Reset Password
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
    </div>
  );
}
