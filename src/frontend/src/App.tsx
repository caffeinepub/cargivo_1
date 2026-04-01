import { Toaster } from "@/components/ui/sonner";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { DashboardHeader } from "./components/DashboardHeader";
import { Sidebar } from "./components/Sidebar";
import { useLocalAuth } from "./hooks/useLocalAuth";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminSuppliers } from "./pages/AdminSuppliers";
import { AdminTeamMembers } from "./pages/AdminTeamMembers";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { DesignSystemPage } from "./pages/DesignSystemPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import { ProfilePage } from "./pages/ProfilePage";
import { SignupPage } from "./pages/SignupPage";
import { TeamDashboard } from "./pages/TeamDashboard";

const KNOWN_ROUTES = new Set([
  "dashboard",
  "design-system",
  "suppliers",
  "team-members",
  "assigned-orders",
  "requests",
  "orders",
  "customers",
  "payments",
  "documents",
  "profile",
  "quotations",
  "tracking",
  "settings",
  "request-quote",
  "my-orders",
]);

export default function App() {
  const { currentUser, logout, login, isLoggedIn } = useLocalAuth();
  const [activeItem, setActiveItem] = useState("dashboard");
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  if (!isLoggedIn) {
    if (showLogin) {
      return (
        <>
          <LoginPage
            login={login}
            onBack={() => setShowLogin(false)}
            onSignupClick={() => {
              setShowLogin(false);
              setShowSignup(true);
            }}
            onLoginSuccess={() => {
              setShowLogin(false);
              setActiveItem("dashboard");
            }}
          />
          <Toaster />
        </>
      );
    }
    if (showSignup) {
      return (
        <>
          <SignupPage
            onBack={() => setShowSignup(false)}
            onLoginClick={() => {
              setShowSignup(false);
              setShowLogin(true);
            }}
          />
          <Toaster />
        </>
      );
    }
    return (
      <>
        <HomePage
          onLoginClick={() => setShowLogin(true)}
          onSignupClick={() => setShowSignup(true)}
        />
        <Toaster />
      </>
    );
  }

  const role = currentUser!.role;
  const userName = currentUser!.name;
  const companyName = currentUser!.company ?? "";

  const sidebarRole: "admin" | "customer" | "teamMember" =
    role === "admin"
      ? "admin"
      : role === "teamMember"
        ? "teamMember"
        : "customer";

  const handleLogout = () => {
    logout();
    setActiveItem("dashboard");
  };

  const renderContent = () => {
    if (activeItem === "design-system") return <DesignSystemPage />;

    if (role === "admin") {
      if (activeItem === "suppliers") return <AdminSuppliers />;
      if (activeItem === "team-members") return <AdminTeamMembers />;
      return <AdminDashboard />;
    }

    if (role === "customer") {
      if (activeItem === "profile") return <ProfilePage user={currentUser!} />;
      return <CustomerDashboard />;
    }

    if (role === "teamMember") {
      if (activeItem === "profile") return <ProfilePage user={currentUser!} />;
      if (activeItem === "dashboard" || activeItem === "assigned-orders")
        return <TeamDashboard />;
      // suppliers, quotations, tracking — coming soon
      return (
        <div className="flex items-center justify-center h-64 bg-white border border-border rounded-xl">
          <div className="text-center">
            <div className="text-4xl mb-3">🚧</div>
            <p className="text-foreground font-medium">Coming Soon</p>
            <p className="text-muted-foreground text-sm mt-1">
              This section will be available soon.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        role={sidebarRole}
        activeItem={activeItem}
        onItemClick={(item) => {
          if (item === "logout") {
            handleLogout();
            return;
          }
          setActiveItem(item);
        }}
        userName={userName}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader userName={userName} role={sidebarRole} />

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
                Welcome back, {userName}
                {companyName ? ` — ${companyName}` : ""} 👋
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
                <div className="flex items-center justify-center h-64 bg-white border border-border rounded-xl">
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
