import { Skeleton } from "@/components/ui/skeleton";
import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { UserRole } from "./backend";
import { DashboardHeader } from "./components/DashboardHeader";
import { Sidebar } from "./components/Sidebar";
import { DEMO_ROLE_LABELS, getDemoRole, setDemoRole } from "./demoMode";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useCallerProfile, useCallerRole } from "./hooks/useQueries";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminSuppliers } from "./pages/AdminSuppliers";
import { AdminTeamMembers } from "./pages/AdminTeamMembers";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { SignupPage } from "./pages/SignupPage";
import { TeamDashboard } from "./pages/TeamDashboard";

function getProfileName(
  profile: ReturnType<typeof useCallerProfile>["data"] | undefined,
): string {
  if (!profile) return "";
  if (profile.__kind__ === "customer") return profile.customer.name;
  if (profile.__kind__ === "admin") return profile.admin.name;
  if (profile.__kind__ === "teamMember") return profile.teamMember.name;
  return "";
}

const KNOWN_ROUTES = new Set([
  "dashboard",
  "design-system",
  "suppliers",
  "team-members",
  "assigned-orders",
]);

function DemoBanner({ role }: { role: string }) {
  function exitDemo() {
    setDemoRole(null);
    window.location.reload();
  }

  return (
    <div
      className="flex items-center justify-between px-4 py-1.5 bg-blue-600 text-white text-xs font-medium"
      data-ocid="demo.panel"
    >
      <span>
        🧪 <strong>Demo Mode</strong> — {role}
      </span>
      <button
        type="button"
        onClick={exitDemo}
        className="ml-4 px-3 py-0.5 rounded bg-white/20 hover:bg-white/30 transition text-xs font-semibold"
        data-ocid="demo.exit.button"
      >
        Exit Demo →
      </button>
    </div>
  );
}

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: role, isLoading: roleLoading } = useCallerRole();
  const { data: profile, isLoading: profileLoading } = useCallerProfile();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showLogin, setShowLogin] = useState(false);

  // Check demo mode first — skip II auth entirely
  const demoRole = getDemoRole();
  if (demoRole) {
    const demoRoleLabel = DEMO_ROLE_LABELS[demoRole];
    const currentRole =
      demoRole === "admin"
        ? UserRole.admin
        : demoRole === "customer"
          ? UserRole.user
          : UserRole.guest;
    const userName =
      demoRole === "customer"
        ? "Demo Customer"
        : demoRole === "admin"
          ? "Demo Admin"
          : "Demo Team Member";

    const renderDemoContent = () => {
      if (activeItem === "design-system") return <DesignSystemPage />;
      if (currentRole === UserRole.admin) {
        if (activeItem === "suppliers") return <AdminSuppliers />;
        if (activeItem === "team-members") return <AdminTeamMembers />;
        return <AdminDashboard />;
      }
      if (currentRole === UserRole.user) return <CustomerDashboard />;
      if (activeItem === "assigned-orders") return <TeamDashboard />;
      return <TeamDashboard />;
    };

    return (
      <div className="flex flex-col h-screen bg-background overflow-hidden">
        <DemoBanner role={demoRoleLabel} />
        <div className="flex flex-1 min-h-0 overflow-hidden">
          <Sidebar
            role={currentRole}
            activeItem={activeItem}
            onItemClick={setActiveItem}
            userName={userName}
          />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <DashboardHeader userName={userName} role={currentRole} />
            <main className="flex-1 overflow-y-auto p-6">
              {activeItem === "dashboard" && (
                <div className="mb-6">
                  <p className="text-muted-foreground text-sm">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <h1 className="text-2xl font-bold text-foreground mt-0.5">
                    Welcome back, {userName} 👋
                  </h1>
                </div>
              )}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeItem}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {KNOWN_ROUTES.has(activeItem) ? (
                    renderDemoContent()
                  ) : (
                    <div
                      className="flex items-center justify-center h-64 bg-white border border-border rounded-xl"
                      data-ocid={`${activeItem.replace("-", "_")}.panel`}
                    >
                      <div className="text-center">
                        <div className="text-4xl mb-3">🚧</div>
                        <p className="text-foreground font-medium">
                          Coming Soon
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          This section will be available soon.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </main>
            <footer className="px-6 py-3 border-t border-border text-center text-xs text-muted-foreground bg-white">
              © {new Date().getFullYear()} Cargivo. Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </footer>
          </div>
        </div>
        <Toaster />
      </div>
    );
  }

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-3 w-64" data-ocid="app.loading_state">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isLoggedIn) {
    if (showLogin) {
      return (
        <>
          <LoginPage onBack={() => setShowLogin(false)} />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <HomePage onLoginClick={() => setShowLogin(true)} />
        <Toaster />
      </>
    );
  }

  // Logged in but loading profile
  if (profileLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="space-y-3 w-64" data-ocid="app.loading_state">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-8 w-1/2" />
        </div>
      </div>
    );
  }

  // Logged in but no profile — show signup
  if (!profile) {
    return (
      <>
        <SignupPage />
        <Toaster />
      </>
    );
  }

  const userName =
    getProfileName(profile) ||
    identity?.getPrincipal().toString().slice(0, 8) ||
    "User";
  const currentRole = role ?? UserRole.guest;

  const renderContent = () => {
    if (activeItem === "design-system") return <DesignSystemPage />;
    if (currentRole === UserRole.admin) {
      if (activeItem === "suppliers") return <AdminSuppliers />;
      if (activeItem === "team-members") return <AdminTeamMembers />;
      return <AdminDashboard />;
    }
    if (currentRole === UserRole.user) return <CustomerDashboard />;
    // Team member
    if (activeItem === "assigned-orders") return <TeamDashboard />;
    return <TeamDashboard />;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        role={currentRole}
        activeItem={activeItem}
        onItemClick={setActiveItem}
        userName={userName}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader userName={userName} role={currentRole} />

        <main className="flex-1 overflow-y-auto p-6">
          {activeItem === "dashboard" && (
            <div className="mb-6">
              <p className="text-muted-foreground text-sm">
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <h1 className="text-2xl font-bold text-foreground mt-0.5">
                Welcome back, {userName} 👋
              </h1>
            </div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeItem}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {KNOWN_ROUTES.has(activeItem) ? (
                renderContent()
              ) : (
                <div
                  className="flex items-center justify-center h-64 bg-white border border-border rounded-xl"
                  data-ocid={`${activeItem.replace("-", "_")}.panel`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">🚧</div>
                    <p className="text-foreground font-medium">Coming Soon</p>
                    <p className="text-muted-foreground text-sm mt-1">
                      This section will be available soon.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="px-6 py-3 border-t border-border text-center text-xs text-muted-foreground bg-white">
          © {new Date().getFullYear()} Cargivo. Built with ❤️ using{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            caffeine.ai
          </a>
        </footer>
      </div>

      <Toaster />
    </div>
  );
}
