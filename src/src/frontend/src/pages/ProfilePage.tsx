import { Building2, Mail, Shield, User } from "lucide-react";

interface ProfilePageProps {
  user: {
    name: string;
    email: string;
    company?: string;
    role: string;
  };
}

const ROLE_LABELS: Record<string, string> = {
  customer: "Customer",
  admin: "Admin",
  teamMember: "Team Member",
};

const ROLE_COLORS: Record<string, string> = {
  customer: "bg-blue-100 text-blue-700",
  admin: "bg-orange-100 text-orange-700",
  teamMember: "bg-green-100 text-green-700",
};

export function ProfilePage({ user }: ProfilePageProps) {
  const roleLabel = ROLE_LABELS[user.role] ?? user.role;
  const roleColor = ROLE_COLORS[user.role] ?? "bg-gray-100 text-gray-700";

  return (
    <div className="max-w-2xl mx-auto space-y-6" data-ocid="profile.page">
      {/* Header card */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6 flex items-center gap-5">
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <User size={30} className="text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-muted-foreground text-sm mt-0.5">{user.email}</p>
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-0.5 mt-2 rounded-full text-xs font-semibold ${roleColor}`}
          >
            <Shield size={11} />
            {roleLabel}
          </span>
        </div>
      </div>

      {/* Account Info */}
      <div className="bg-white rounded-xl border border-border shadow-sm p-6">
        <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
          Account Info
        </h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <User size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium text-foreground">{user.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Mail size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email Address</p>
              <p className="text-sm font-medium text-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Shield size={16} className="text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Role</p>
              <p className="text-sm font-medium text-foreground">{roleLabel}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Company Info — only for customers */}
      {user.company && (
        <div className="bg-white rounded-xl border border-border shadow-sm p-6">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
            Company Info
          </h3>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
              <Building2 size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Company Name</p>
              <p className="text-sm font-medium text-foreground">
                {user.company}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
