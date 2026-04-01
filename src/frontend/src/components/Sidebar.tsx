import {
  Box,
  Building2,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  CreditCard,
  FileText,
  Inbox,
  LayoutDashboard,
  LogOut,
  Package,
  Palette,
  Settings,
  Truck,
  User,
  UserCog,
  Users,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const CUSTOMER_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "request-quote", label: "Request Quote", icon: <Box size={18} /> },
  { id: "my-orders", label: "My Orders", icon: <ClipboardList size={18} /> },
  { id: "payments", label: "Payments", icon: <CreditCard size={18} /> },
  { id: "documents", label: "Documents", icon: <FileText size={18} /> },
  { id: "profile", label: "Profile", icon: <User size={18} /> },
];

const ADMIN_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { id: "requests", label: "Requests", icon: <Inbox size={18} /> },
  { id: "orders", label: "Orders", icon: <Package size={18} /> },
  { id: "customers", label: "Customers", icon: <Users size={18} /> },
  { id: "suppliers", label: "Suppliers", icon: <Building2 size={18} /> },
  { id: "team-members", label: "Team Members", icon: <UserCog size={18} /> },
  { id: "payments", label: "Payments", icon: <CreditCard size={18} /> },
  { id: "settings", label: "Settings", icon: <Settings size={18} /> },
  { id: "design-system", label: "Design System", icon: <Palette size={18} /> },
];

const TEAM_NAV: NavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  {
    id: "assigned-orders",
    label: "Assigned Orders",
    icon: <ClipboardList size={18} />,
  },
  { id: "suppliers", label: "Suppliers", icon: <Building2 size={18} /> },
  { id: "quotations", label: "Quotations", icon: <FileText size={18} /> },
  { id: "tracking", label: "Tracking", icon: <Truck size={18} /> },
  { id: "profile", label: "Profile", icon: <User size={18} /> },
];

interface SidebarProps {
  role: "admin" | "customer" | "teamMember";
  activeItem: string;
  onItemClick: (id: string) => void;
  userName: string;
}

export function Sidebar({
  role,
  activeItem,
  onItemClick,
  userName,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  const navItems =
    role === "admin"
      ? ADMIN_NAV
      : role === "customer"
        ? CUSTOMER_NAV
        : TEAM_NAV;

  const roleLabel =
    role === "admin" ? "Admin" : role === "customer" ? "Customer" : "Team";

  return (
    <aside
      className={`flex flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 ${
        collapsed ? "w-16" : "w-60"
      } min-h-screen flex-shrink-0`}
      data-ocid="sidebar.panel"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="text-lg font-bold text-white tracking-tight">
              Cargivo
            </span>
          </div>
        )}
        {collapsed && <span className="text-2xl mx-auto">📦</span>}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:text-white transition-colors ml-auto"
          aria-label="Toggle sidebar"
          data-ocid="sidebar.toggle"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/60 uppercase tracking-widest mb-0.5">
            Logged in as
          </p>
          <p className="text-sm font-semibold text-white truncate">
            {userName}
          </p>
          <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded-full text-xs font-medium bg-sidebar-accent text-white">
            {roleLabel}
          </span>
        </div>
      )}

      {/* Nav items */}
      <nav
        className="flex-1 py-4 space-y-1 px-2"
        aria-label="Sidebar navigation"
      >
        {navItems.map((item) => (
          <button
            type="button"
            key={item.id}
            onClick={() => onItemClick(item.id)}
            data-ocid={`sidebar.${item.id.replace("-", "_")}.link`}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeItem === item.id
                ? "bg-sidebar-primary text-white shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-white"
            } ${collapsed ? "justify-center" : ""}`}
            title={collapsed ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="p-2 border-t border-sidebar-border">
        <button
          type="button"
          onClick={() => onItemClick("logout")}
          data-ocid="sidebar.logout.button"
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-red-500/20 hover:text-red-300 transition-all ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}
