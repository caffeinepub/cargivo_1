import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LoginPageProps {
  onBack: () => void;
  onSignupClick?: () => void;
  onLoginSuccess?: () => void;
  login: (
    email: string,
    password: string,
  ) => { success: boolean; error?: string };
}

type View = "login" | "forgot" | "resetSent" | "internalLogin";
type InternalRole = "admin" | "teamMember";

export function LoginPage({
  onBack,
  onSignupClick,
  onLoginSuccess,
  login,
}: LoginPageProps) {
  const [view, setView] = useState<View>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [internalRole, setInternalRole] = useState<InternalRole>("admin");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      const result = login(email, password);
      setIsLoggingIn(false);
      if (result.success) {
        onLoginSuccess?.();
      } else {
        toast.error(result.error ?? "Invalid credentials");
      }
    }, 400);
  }

  function handleInternalLogin(e: React.FormEvent) {
    e.preventDefault();
    setIsLoggingIn(true);
    setTimeout(() => {
      const result = login(email, password);
      setIsLoggingIn(false);
      if (result.success) {
        onLoginSuccess?.();
      } else {
        toast.error(result.error ?? "Invalid credentials");
      }
    }, 400);
  }

  function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setView("resetSent");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {view === "login" && (
            <>
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="text-3xl">📦</span>
                  <span className="text-2xl font-bold text-primary tracking-tight">
                    Cargivo
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Login</h1>
                <p className="text-sm text-gray-500">Access your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    data-ocid="login.input"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label
                      className="block text-sm font-medium text-gray-700"
                      htmlFor="password"
                    >
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                      data-ocid="login.textarea"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex justify-end mt-1">
                    <button
                      type="button"
                      onClick={() => setView("forgot")}
                      className="text-xs text-primary hover:underline"
                    >
                      Forgot Password?
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 rounded-xl font-semibold text-sm mt-1"
                  data-ocid="login.submit_button"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Login"
                  )}
                </Button>
              </form>

              {/* Test credentials hint */}
              <div className="mt-5 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-2">
                  Test Credentials
                </p>
                <div className="space-y-1 text-xs text-blue-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Customer:</span>
                    <span>customer@cargivo.com / Customer@123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Admin:</span>
                    <span>admin@cargivo.com / Admin@123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Team:</span>
                    <span>team@cargivo.com / Team@123</span>
                  </div>
                </div>
              </div>

              <p className="text-center text-sm text-gray-500 mt-5">
                Don&apos;t have an account?{" "}
                <button
                  type="button"
                  className="text-primary font-medium hover:underline"
                  onClick={onSignupClick}
                >
                  Signup
                </button>
              </p>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setEmail("");
                    setPassword("");
                    setView("internalLogin");
                  }}
                  className="text-xs text-gray-400 hover:text-gray-600 transition"
                >
                  Internal team login →
                </button>
              </div>
            </>
          )}

          {view === "internalLogin" && (
            <>
              <button
                type="button"
                onClick={() => setView("login")}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6 transition"
              >
                <ArrowLeft size={14} />
                Back to customer login
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-xl mb-3">
                  <ShieldCheck size={22} className="text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Team Login
                </h1>
                <p className="text-sm text-gray-500">
                  For Cargivo internal staff
                </p>
              </div>

              <div className="flex rounded-xl border border-gray-200 overflow-hidden mb-5">
                <button
                  type="button"
                  onClick={() => setInternalRole("admin")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    internalRole === "admin"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setInternalRole("teamMember")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                    internalRole === "teamMember"
                      ? "bg-primary text-white"
                      : "bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Team Member
                </button>
              </div>

              <form onSubmit={handleInternalLogin} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="internal-email"
                  >
                    Email
                  </label>
                  <input
                    id="internal-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={
                      internalRole === "admin"
                        ? "admin@cargivo.com"
                        : "team@cargivo.com"
                    }
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    data-ocid="login.input"
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="internal-password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="internal-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-2.5 pr-10 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoggingIn}
                  className="w-full bg-primary hover:bg-primary/90 text-white h-11 rounded-xl font-semibold text-sm"
                  data-ocid="login.submit_button"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    `Login as ${internalRole === "admin" ? "Admin" : "Team Member"}`
                  )}
                </Button>
              </form>

              <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
                <p className="text-xs font-semibold text-blue-700 mb-2">
                  Test Credentials
                </p>
                <div className="space-y-1 text-xs text-blue-600">
                  <div className="flex justify-between">
                    <span className="font-medium">Admin:</span>
                    <span>admin@cargivo.com / Admin@123</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Team Member:</span>
                    <span>team@cargivo.com / Team@123</span>
                  </div>
                </div>
              </div>
            </>
          )}

          {view === "forgot" && (
            <>
              <button
                type="button"
                onClick={() => setView("login")}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-6 transition"
              >
                <ArrowLeft size={14} />
                Back to login
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 mb-3">
                  <span className="text-3xl">📦</span>
                  <span className="text-2xl font-bold text-primary tracking-tight">
                    Cargivo
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  Reset Password
                </h1>
                <p className="text-sm text-gray-500">
                  Enter your email and we&apos;ll send a reset link.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor="forgot-email"
                  >
                    Email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition"
                    data-ocid="login.input"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white h-11 rounded-xl font-semibold text-sm"
                  data-ocid="login.submit_button"
                >
                  Send Reset Link
                </Button>
              </form>
            </>
          )}

          {view === "resetSent" && (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4">
                <div className="bg-green-50 rounded-full p-4">
                  <Mail className="text-green-500" size={32} />
                </div>
              </div>
              <CheckCircle className="mx-auto mb-2 text-green-500" size={20} />
              <h1 className="text-xl font-bold text-gray-900 mb-2">
                Check your email
              </h1>
              <p className="text-sm text-gray-500 mb-6">
                If an account exists for that email, a reset link has been sent.
              </p>
              <button
                type="button"
                onClick={() => setView("login")}
                className="text-sm text-primary font-medium hover:underline"
              >
                Back to Login
              </button>
            </div>
          )}
        </div>

        <div className="text-center mt-5">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-400 hover:text-primary transition-colors"
            data-ocid="login.back.button"
          >
            ← Back to homepage
          </button>
        </div>
      </div>
    </div>
  );
}
