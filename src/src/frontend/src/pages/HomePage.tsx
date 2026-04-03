import {
  ArrowRight,
  BadgeCheck,
  CheckCircle,
  ClipboardList,
  CreditCard,
  DollarSign,
  FileText,
  Instagram,
  Linkedin,
  Menu,
  Package,
  ShieldCheck,
  Truck,
  Twitter,
  X,
  Youtube,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

interface HomePageProps {
  onLoginClick: () => void;
  onSignupClick?: () => void;
}

const HOW_IT_WORKS = [
  {
    icon: ClipboardList,
    title: "Submit Request",
    desc: "Tell us your box specs and quantity",
  },
  {
    icon: FileText,
    title: "Get Quote",
    desc: "Receive competitive quotes within hours",
  },
  {
    icon: CheckCircle,
    title: "Approve Price",
    desc: "Review and approve the best offer",
  },
  {
    icon: CreditCard,
    title: "Pay Advance",
    desc: "Secure your order with an advance payment",
  },
  {
    icon: Truck,
    title: "Delivery",
    desc: "Track your order to your doorstep",
  },
  {
    icon: BadgeCheck,
    title: "Final Payment",
    desc: "Pay balance on successful delivery",
  },
];

const WHY_CHOOSE = [
  {
    icon: Zap,
    title: "Fast Quotation",
    desc: "Get quotes in minutes, not days",
  },
  {
    icon: ShieldCheck,
    title: "Verified Suppliers",
    desc: "All suppliers are vetted and certified",
  },
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    desc: "No hidden fees, clear breakdowns",
  },
  {
    icon: Package,
    title: "Easy Order Handling",
    desc: "Simple dashboard to track every order",
  },
];

const INDUSTRIES = [
  { emoji: "🚗", title: "Automotive" },
  { emoji: "💊", title: "Pharma" },
  { emoji: "💻", title: "Electronics" },
  { emoji: "🚚", title: "Logistics" },
  { emoji: "🏭", title: "Manufacturing" },
  { emoji: "🛍️", title: "Retail" },
];

const BOX_TYPES = [
  {
    image: "/assets/generated/box-wooden.dim_600x400.jpg",
    title: "Wooden Box",
    desc: "Durable hardwood boxes for industrial shipping and heavy goods.",
  },
  {
    image: "/assets/generated/box-plastic.dim_600x400.jpg",
    title: "Plastic Box",
    desc: "Lightweight weatherproof containers for sensitive cargo.",
  },
  {
    image: "/assets/generated/box-custom.dim_600x400.jpg",
    title: "Custom Box",
    desc: "Fully custom boxes engineered to your exact specifications.",
  },
];

const NAV_LINKS = [
  { label: "How It Works", href: "#how-it-works" },
  { label: "Industries", href: "#industries" },
  { label: "Box Types", href: "#box-types" },
];

export function HomePage({ onLoginClick, onSignupClick }: HomePageProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-white" style={{ scrollBehavior: "smooth" }}>
      {/* ── SECTION 1: HEADER ── */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-2xl">📦</span>
            <span className="text-xl font-bold text-primary tracking-tight">
              Cargivo
            </span>
          </div>

          {/* Desktop Nav — anchor links only */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                type="button"
                onClick={() => scrollTo(l.href)}
                className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors rounded-lg hover:bg-muted"
                data-ocid={`nav.${l.label.toLowerCase().replace(/ /g, "_")}.link`}
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Desktop CTA — Login + Sign Up */}
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-5 py-2 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
              data-ocid="nav.login.button"
            >
              Login
            </button>
            <button
              type="button"
              onClick={onSignupClick || onLoginClick}
              className="px-5 py-2 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
              data-ocid="nav.signup.primary_button"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            data-ocid="nav.menu.toggle"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-white px-6 py-4 flex flex-col gap-2">
            {NAV_LINKS.map((l) => (
              <button
                key={l.label}
                type="button"
                onClick={() => scrollTo(l.href)}
                className="text-left px-3 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-muted"
              >
                {l.label}
              </button>
            ))}
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={onLoginClick}
                className="flex-1 px-4 py-2.5 rounded-lg border border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors"
                data-ocid="nav.mobile_login.button"
              >
                Login
              </button>
              <button
                type="button"
                onClick={onSignupClick || onLoginClick}
                className="flex-1 px-4 py-2.5 rounded-lg bg-accent text-accent-foreground text-sm font-semibold hover:bg-accent/90 transition-colors"
                data-ocid="nav.mobile_signup.primary_button"
              >
                Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ── SECTION 2: HERO ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-white to-accent/5 pt-16 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-5">
              B2B Cargo Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-5">
              Custom Cargo Boxes.{" "}
              <span className="text-primary">Quotes in Minutes.</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Get custom wooden, plastic, and industrial cargo box quotes
              quickly and easily.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                type="button"
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
                data-ocid="hero.request_quote.primary_button"
              >
                Request Quote <ArrowRight size={16} />
              </button>
              <button
                type="button"
                onClick={onLoginClick}
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-primary text-primary font-semibold hover:bg-primary/5 transition-colors"
                data-ocid="hero.login.secondary_button"
              >
                Login
              </button>
            </div>
            {/* Stat badges */}
            <div className="flex flex-wrap gap-2">
              {["150+ Suppliers", "20+ Cities", "Fast Quote Turnaround"].map(
                (stat) => (
                  <span
                    key={stat}
                    className="px-3 py-1.5 rounded-full bg-white border border-border text-xs font-semibold text-primary shadow-sm"
                  >
                    {stat}
                  </span>
                ),
              )}
            </div>
          </motion.div>

          {/* Right — hero image with floating stat cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="hidden md:block relative"
          >
            <img
              src="/assets/generated/hero-dashboard-mockup.dim_800x560.png"
              alt="Cargivo dashboard"
              className="w-full rounded-2xl shadow-xl object-cover"
            />
            {/* Floating cards */}
            <div className="absolute top-4 left-4 bg-white rounded-xl shadow-lg px-3 py-2 text-sm font-semibold text-primary border border-border">
              📦 150+ Suppliers
            </div>
            <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg px-3 py-2 text-sm font-semibold text-primary border border-border">
              ⚡ Fast Turnaround
            </div>
            <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-lg px-3 py-2 text-sm font-semibold text-primary border border-border">
              🏙️ 20+ Cities
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              How It Works
            </h2>
            <p className="text-muted-foreground">
              Six simple steps from request to delivery
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HOW_IT_WORKS.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="bg-blue-50/60 border border-blue-100 rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:shadow-card-hover transition-shadow"
                  data-ocid={`how_it_works.item.${i + 1}`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon size={22} className="text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 4: WHY CHOOSE CARGIVO ── */}
      <section className="py-20 px-6 bg-muted/40">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Why Choose Cargivo
            </h2>
            <p className="text-muted-foreground">
              Built to make cargo procurement simple and reliable
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_CHOOSE.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-border rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-shadow"
                  data-ocid={`why_choose.item.${i + 1}`}
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon size={22} className="text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── SECTION 5: INDUSTRIES SERVED ── */}
      <section id="industries" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Industries We Serve
            </h2>
            <p className="text-muted-foreground">
              Trusted by businesses across diverse sectors
            </p>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {INDUSTRIES.map((ind, i) => (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="bg-muted/40 border border-transparent hover:border-primary rounded-2xl p-6 flex flex-col items-center gap-3 cursor-default transition-all hover:bg-primary/5"
                data-ocid={`industries.item.${i + 1}`}
              >
                <span className="text-4xl">{ind.emoji}</span>
                <h3 className="font-semibold text-foreground text-sm">
                  {ind.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 6: BOX TYPES ── */}
      <section id="box-types" className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Box Types
            </h2>
            <p className="text-muted-foreground">
              Choose the right solution for your cargo needs
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {BOX_TYPES.map((box, i) => (
              <motion.div
                key={box.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border border-border rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow"
                data-ocid={`box_types.item.${i + 1}`}
              >
                <img
                  src={box.image}
                  alt={box.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {box.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {box.desc}
                  </p>
                  <button
                    type="button"
                    onClick={onLoginClick}
                    className="w-full py-2.5 rounded-full bg-accent text-accent-foreground font-semibold text-sm hover:bg-accent/90 transition-colors"
                    data-ocid={`box_types.request_quote.primary_button.${i + 1}`}
                  >
                    Request Quote
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FINAL CTA ── */}
      <section className="py-20 px-6 bg-primary">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get your custom cargo box quote?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Join hundreds of businesses that trust Cargivo.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              type="button"
              onClick={onLoginClick}
              className="px-8 py-3.5 rounded-full bg-accent text-accent-foreground font-semibold hover:bg-accent/90 transition-colors"
              data-ocid="cta.request_quote.primary_button"
            >
              Request Quote
            </button>
            <button
              type="button"
              onClick={onLoginClick}
              className="px-8 py-3.5 rounded-full border-2 border-white text-white font-semibold hover:bg-white/10 transition-colors"
              data-ocid="cta.contact_us.secondary_button"
            >
              Contact Us
            </button>
          </div>
        </motion.div>
      </section>

      {/* ── SECTION 8: FOOTER ── */}
      <footer className="bg-gray-900 text-gray-300">
        <div className="max-w-7xl mx-auto px-6 pt-14 pb-8">
          {/* Logo + tagline */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">📦</span>
              <span className="text-xl font-bold text-white">Cargivo</span>
            </div>
            <p className="text-sm text-gray-400 max-w-xs">
              Custom cargo box quotes, fast and easy.
            </p>
          </div>

          {/* 4 columns */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            {/* Company */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                {["About", "Careers", "Blog", "Press"].map((l) => (
                  <li key={l}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Policies */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">
                Policies
              </h4>
              <ul className="space-y-2 text-sm">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "Refund Policy",
                ].map((l) => (
                  <li key={l}>
                    <span className="hover:text-white transition-colors cursor-pointer">
                      {l}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {/* Contact */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li>support@cargivo.com</li>
                <li>+1 (800) 555-0199</li>
                <li>Mumbai, India</li>
              </ul>
            </div>
            {/* Social */}
            <div>
              <h4 className="text-white font-semibold text-sm mb-4">Social</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <span className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                    <Linkedin size={14} /> LinkedIn
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                    <Twitter size={14} /> Twitter
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                    <Instagram size={14} /> Instagram
                  </span>
                </li>
                <li>
                  <span className="inline-flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                    <Youtube size={14} /> YouTube
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
            <span>
              © {new Date().getFullYear()} Cargivo. All rights reserved.
            </span>
            <span>
              Built with ❤️ using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
