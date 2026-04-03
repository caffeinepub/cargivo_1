import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Eye, EyeOff, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface SignupPageProps {
  onBack?: () => void;
  onLoginClick?: () => void;
}

export function SignupPage({ onBack, onLoginClick }: SignupPageProps = {}) {
  const [step, setStep] = useState(1);

  // Step 1 fields
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [phoneOtp, setPhoneOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 fields
  const [companyName, setCompanyName] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (!emailOtp || !phoneOtp) {
      toast.error("Please enter both OTP codes");
      return;
    }
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Account created! Welcome to Cargivo.");
      onLoginClick?.();
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-white to-accent/5 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <span className="text-3xl">📦</span>
              <span className="text-2xl font-bold text-foreground tracking-tight">
                Cargivo
              </span>
            </div>
            <h1 className="text-xl font-semibold text-foreground">
              Create Your Account
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Register to start requesting custom cargo box quotes
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center mb-8">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 1
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {step > 1 ? <CheckCircle2 size={16} /> : "1"}
              </div>
              <span
                className={`text-sm font-medium ${step === 1 ? "text-primary" : "text-muted-foreground"}`}
              >
                Account Details
              </span>
            </div>
            <div
              className={`flex-1 h-0.5 mx-4 ${step >= 2 ? "bg-primary" : "bg-gray-200"}`}
            />
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  step >= 2
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${step === 2 ? "text-primary" : "text-muted-foreground"}`}
              >
                Business Details
              </span>
            </div>
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    required
                    data-ocid="signup.email.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                    data-ocid="signup.phone.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 8 characters"
                      required
                      className="pr-10"
                      data-ocid="signup.password.input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      data-ocid="signup.show_password.toggle"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      required
                      className="pr-10"
                      data-ocid="signup.confirm_password.input"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      data-ocid="signup.show_confirm_password.toggle"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border border-border rounded-xl p-4 bg-muted/30">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  OTP Verification
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="emailOtp" className="text-sm">
                      Email OTP
                    </Label>
                    <Input
                      id="emailOtp"
                      value={emailOtp}
                      onChange={(e) =>
                        setEmailOtp(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="Enter email OTP"
                      maxLength={6}
                      className="font-mono tracking-widest text-center bg-white"
                      data-ocid="signup.email_otp.input"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="phoneOtp" className="text-sm">
                      Phone OTP
                    </Label>
                    <Input
                      id="phoneOtp"
                      value={phoneOtp}
                      onChange={(e) =>
                        setPhoneOtp(
                          e.target.value.replace(/\D/g, "").slice(0, 6),
                        )
                      }
                      placeholder="Enter phone OTP"
                      maxLength={6}
                      className="font-mono tracking-widest text-center bg-white"
                      data-ocid="signup.phone_otp.input"
                    />
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-11 rounded-xl"
                data-ocid="signup.verify_continue.primary_button"
              >
                Verify & Continue
              </Button>

              {onBack && (
                <button
                  type="button"
                  onClick={onBack}
                  className="text-sm text-gray-500 hover:text-gray-700 transition block w-full text-center"
                  data-ocid="signup.cancel_button"
                >
                  ← Back
                </button>
              )}
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Acme Industries Pvt. Ltd."
                    required
                    data-ocid="signup.company_name.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="gstNumber">GST Number *</Label>
                  <Input
                    id="gstNumber"
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                    placeholder="22AAAAA0000A1Z5"
                    required
                    className="font-mono"
                    data-ocid="signup.gst_number.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="state">State *</Label>
                  <Input
                    id="state"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="Maharashtra"
                    required
                    data-ocid="signup.state.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="Mumbai"
                    required
                    data-ocid="signup.city.input"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="contactPerson">Contact Person Name *</Label>
                  <Input
                    id="contactPerson"
                    value={contactPerson}
                    onChange={(e) => setContactPerson(e.target.value)}
                    placeholder="Rajesh Sharma"
                    required
                    data-ocid="signup.contact_person.input"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address">Full Address *</Label>
                <Textarea
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 12, MIDC Industrial Area, Andheri East, Mumbai – 400093"
                  required
                  rows={3}
                  data-ocid="signup.address.textarea"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 h-11 rounded-xl"
                  onClick={() => setStep(1)}
                  data-ocid="signup.back.button"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground h-11 rounded-xl"
                  data-ocid="signup.create_account.primary_button"
                >
                  {isSubmitting && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Create Account
                </Button>
              </div>
            </form>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-primary font-medium hover:underline"
              data-ocid="signup.login.link"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
