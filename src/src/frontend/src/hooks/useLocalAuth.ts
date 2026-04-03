import { useCallback, useEffect, useState } from "react";

export type LocalRole = "customer" | "admin" | "teamMember";

export interface LocalUser {
  email: string;
  name: string;
  company?: string;
  role: LocalRole;
}

// Hardcoded test accounts
const TEST_ACCOUNTS: Array<LocalUser & { password: string }> = [
  {
    email: "customer@cargivo.com",
    password: "Customer@123",
    name: "Rajesh Sharma",
    company: "Acme Industries Pvt. Ltd.",
    role: "customer",
  },
  {
    email: "admin@cargivo.com",
    password: "Admin@123",
    name: "Admin User",
    role: "admin",
  },
  {
    email: "team@cargivo.com",
    password: "Team@123",
    name: "Priya Verma",
    role: "teamMember",
  },
];

const STORAGE_KEY = "cargivo_local_auth";

export function useLocalAuth() {
  const [currentUser, setCurrentUser] = useState<LocalUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as LocalUser) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback(
    (email: string, password: string): { success: boolean; error?: string } => {
      const account = TEST_ACCOUNTS.find(
        (a) =>
          a.email.toLowerCase() === email.toLowerCase() &&
          a.password === password,
      );
      if (!account) {
        return { success: false, error: "Invalid email or password" };
      }
      const user: LocalUser = {
        email: account.email,
        name: account.name,
        company: account.company,
        role: account.role,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      setCurrentUser(user);
      return { success: true };
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setCurrentUser(null);
  }, []);

  return { currentUser, login, logout, isLoggedIn: !!currentUser };
}
