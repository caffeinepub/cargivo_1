import { Bell, Menu } from "lucide-react";
import { UserRole } from "../backend";

interface DashboardHeaderProps {
  userName: string;
  role: UserRole;
  onMenuClick?: () => void;
}

const ROLE_LABELS: Record<string, string> = {
  [UserRole.admin]: "Admin",
  [UserRole.user]: "Customer",
  [UserRole.guest]: "Team Member",
};

const ROLE_COLORS: Record<string, string> = {
  [UserRole.admin]: "bg-primary/10 text-primary",
  [UserRole.user]: "bg-green-100 text-green-700",
  [UserRole.guest]: "bg-orange-100 text-orange-700",
};

export function DashboardHeader({
  userName,
  role,
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center px-6 gap-4 flex-shrink-0">
      <button
        type="button"
        className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
        onClick={onMenuClick}
        aria-label="Open menu"
        data-ocid="header.menu.button"
      >
        <Menu size={20} />
      </button>

      <div className="flex items-center gap-2">
        <span className="text-lg">📦</span>
        <span className="font-bold text-primary text-lg tracking-tight">
          Cargivo
        </span>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        className="relative text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Notifications"
        data-ocid="header.notifications.button"
      >
        <Bell size={18} />
        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-accent rounded-full" />
      </button>

      <div className="flex items-center gap-2 pl-3 border-l border-border">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div className="hidden sm:block">
          <p className="text-sm font-medium text-foreground leading-none">
            {userName}
          </p>
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium mt-0.5 ${
              ROLE_COLORS[role] ?? "bg-gray-100 text-gray-700"
            }`}
          >
            {ROLE_LABELS[role] ?? role}
          </span>
        </div>
      </div>
    </header>
  );
}
