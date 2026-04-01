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
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  state: string;
  area: string;
  category: string;
  status: "active" | "inactive";
  notes: string;
}

const INITIAL_SUPPLIERS: Supplier[] = [];

const EMPTY_FORM = {
  name: "",
  contact: "",
  email: "",
  state: "",
  area: "",
  category: "Wooden Box",
  notes: "",
};

export function AdminSuppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  };

  const openEdit = (s: Supplier) => {
    setEditingId(s.id);
    setForm({
      name: s.name,
      contact: s.contact,
      email: s.email,
      state: s.state,
      area: s.area,
      category: s.category,
      notes: s.notes,
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) {
      toast.error("Supplier name is required");
      return;
    }
    if (editingId !== null) {
      setSuppliers((prev) =>
        prev.map((s) => (s.id === editingId ? { ...s, ...form } : s)),
      );
    } else {
      const newId = Math.max(...suppliers.map((s) => s.id)) + 1;
      setSuppliers((prev) => [
        ...prev,
        { id: newId, ...form, status: "active" } as Supplier,
      ]);
    }
    toast.success("Supplier saved");
    setDialogOpen(false);
  };

  const toggleStatus = (id: number) => {
    setSuppliers((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "active" ? "inactive" : "active" }
          : s,
      ),
    );
  };

  return (
    <div className="space-y-6" data-ocid="admin_suppliers.panel">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Suppliers</h2>
        <button
          type="button"
          className="btn-primary flex items-center gap-2"
          onClick={openAdd}
          data-ocid="admin_suppliers.open_modal_button"
        >
          <Plus size={16} />
          Add Supplier
        </button>
      </div>

      <div
        className="bg-white border border-border rounded-xl shadow-card overflow-hidden"
        data-ocid="admin_suppliers.table"
      >
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/40">
              <TableHead>Supplier Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Area</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((s, i) => (
              <TableRow
                key={s.id}
                className={i % 2 === 1 ? "bg-muted/20" : ""}
                data-ocid={`admin_suppliers.item.${i + 1}`}
              >
                <TableCell className="font-medium text-sm">{s.name}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {s.contact}
                </TableCell>
                <TableCell className="text-sm">{s.state}</TableCell>
                <TableCell className="text-sm">{s.area}</TableCell>
                <TableCell className="text-sm">{s.category}</TableCell>
                <TableCell>
                  {s.status === "active" ? (
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
                      onClick={() => openEdit(s)}
                      data-ocid={`admin_suppliers.edit_button.${i + 1}`}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className={`btn-ghost text-xs px-2 py-1 ${
                        s.status === "active"
                          ? "text-red-500 hover:text-red-700"
                          : "text-emerald-600 hover:text-emerald-800"
                      }`}
                      onClick={() => toggleStatus(s.id)}
                      data-ocid={`admin_suppliers.toggle.${i + 1}`}
                    >
                      {s.status === "active" ? "Deactivate" : "Activate"}
                    </button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg" data-ocid="admin_suppliers.dialog">
          <DialogHeader>
            <DialogTitle>
              {editingId !== null ? "Edit Supplier" : "Add Supplier"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label className="text-sm font-medium mb-1 block">
                Supplier Name
              </Label>
              <input
                type="text"
                className="form-input"
                placeholder="Supplier name"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                data-ocid="admin_suppliers.input"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-1 block">Phone</Label>
                <input
                  type="tel"
                  className="form-input"
                  placeholder="+91 98xxx xxxxx"
                  value={form.contact}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, contact: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label className="text-sm font-medium mb-1 block">Email</Label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="supplier@email.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium mb-1 block">State</Label>
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
                <Label className="text-sm font-medium mb-1 block">Area</Label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Pune"
                  value={form.area}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, area: e.target.value }))
                  }
                />
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">Box Type</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger
                  className="form-input h-auto"
                  data-ocid="admin_suppliers.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Wooden Box">Wooden Box</SelectItem>
                  <SelectItem value="Plastic Box">Plastic Box</SelectItem>
                  <SelectItem value="Industrial Custom">
                    Industrial Custom
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-medium mb-1 block">Notes</Label>
              <Textarea
                className="form-input min-h-[72px]"
                placeholder="Any notes..."
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
                data-ocid="admin_suppliers.textarea"
              />
            </div>
          </div>

          <DialogFooter>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => setDialogOpen(false)}
              data-ocid="admin_suppliers.cancel_button"
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleSave}
              data-ocid="admin_suppliers.submit_button"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
