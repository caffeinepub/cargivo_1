export type DemoRole = "customer" | "admin" | "team";

const KEY = "cargivo_demo_role";

export function getDemoRole(): DemoRole | null {
  return (localStorage.getItem(KEY) as DemoRole) || null;
}

export function setDemoRole(role: DemoRole | null) {
  if (role) localStorage.setItem(KEY, role);
  else localStorage.removeItem(KEY);
}

export const DEMO_PROFILES = {
  customer: { name: "Demo Customer", company: "Acme Corp" },
  admin: { name: "Demo Admin", company: "" },
  team: { name: "Demo Team Member", company: "" },
};

export const DEMO_ROLE_LABELS: Record<DemoRole, string> = {
  customer: "Customer",
  admin: "Admin",
  team: "Team Member",
};
