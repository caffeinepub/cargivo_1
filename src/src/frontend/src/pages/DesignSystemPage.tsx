import { Separator } from "@/components/ui/separator";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "../components/ds/Button";
import { Card } from "../components/ds/Card";
import { FormField } from "../components/ds/FormField";
import { Modal } from "../components/ds/Modal";
import { StatusBadge } from "../components/ds/StatusBadge";
import { Stepper } from "../components/ds/Stepper";
import { UploadBox } from "../components/ds/UploadBox";

const SECTION_STATUSES = [
  "new",
  "pending",
  "inReview",
  "quoted",
  "accepted",
  "inProduction",
  "shipped",
  "delivered",
  "rejected",
  "cancelled",
];

const STEPPER_STEPS = [
  { label: "Quote Requested", description: "Customer submitted request" },
  { label: "Under Review", description: "Team reviewing requirements" },
  { label: "In Production", description: "Manufacturing started" },
  { label: "Shipped", description: "En route to destination" },
  { label: "Delivered", description: "Order complete" },
];

function Section({
  title,
  children,
}: { title: string; children: React.ReactNode }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
      data-ocid="design_system.section"
    >
      <div>
        <h2 className="text-lg font-bold text-foreground">{title}</h2>
        <Separator className="mt-2" />
      </div>
      <div>{children}</div>
    </motion.section>
  );
}

const COLOR_SWATCHES = [
  { name: "Primary Blue", cls: "bg-primary", text: "text-primary-foreground" },
  { name: "Accent Orange", cls: "bg-accent", text: "text-accent-foreground" },
  {
    name: "Background",
    cls: "bg-background border border-border",
    text: "text-foreground",
  },
  { name: "Muted", cls: "bg-muted", text: "text-muted-foreground" },
  {
    name: "Destructive",
    cls: "bg-destructive",
    text: "text-destructive-foreground",
  },
  {
    name: "Status: New",
    cls: "bg-gray-100 border border-gray-200",
    text: "text-gray-600",
  },
  {
    name: "Status: Pending",
    cls: "bg-orange-100 border border-orange-200",
    text: "text-orange-700",
  },
  {
    name: "Status: Approved",
    cls: "bg-blue-100 border border-blue-200",
    text: "text-blue-700",
  },
  {
    name: "Status: Delivered",
    cls: "bg-green-100 border border-green-200",
    text: "text-green-700",
  },
  {
    name: "Status: Rejected",
    cls: "bg-red-100 border border-red-200",
    text: "text-red-700",
  },
];

export function DesignSystemPage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [stepperStep, setStepperStep] = useState(2);

  return (
    <div className="space-y-12 max-w-4xl" data-ocid="design_system.panel">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Design System</h1>
        <p className="text-muted-foreground mt-1">
          Cargivo UI component library — tokens, components, and usage examples.
        </p>
      </div>

      {/* Colors */}
      <Section title="Color Palette">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {COLOR_SWATCHES.map((swatch) => (
            <div key={swatch.name} className="flex flex-col gap-1.5">
              <div
                className={`h-16 rounded-lg ${swatch.cls} flex items-center justify-center`}
              >
                <span className={`text-xs font-semibold ${swatch.text}`}>
                  Aa
                </span>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {swatch.name}
              </p>
            </div>
          ))}
        </div>
      </Section>

      {/* Typography */}
      <Section title="Typography">
        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">H1 — 30px Bold</p>
            <p className="text-3xl font-bold text-foreground">
              Cargo Solutions Built Fast
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">H2 — 24px Bold</p>
            <p className="text-2xl font-bold text-foreground">
              Custom Industrial Boxes
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              H3 — 20px Semibold
            </p>
            <p className="text-xl font-semibold text-foreground">
              Order #CGV-2026-0042
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Body — 14px Regular
            </p>
            <p className="text-sm text-foreground">
              Cargivo helps businesses get custom cargo packaging quotes within
              24 hours.
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">
              Caption — 12px Muted
            </p>
            <p className="text-xs text-muted-foreground">
              Last updated: March 30, 2026 · Assigned to: Team Alpha
            </p>
          </div>
        </div>
      </Section>

      {/* Buttons */}
      <Section title="Buttons">
        <div className="space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary">Primary Button</Button>
            <Button variant="secondary">Secondary Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger">Danger Button</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary" size="sm">
              Small
            </Button>
            <Button variant="primary" size="md">
              Medium
            </Button>
            <Button variant="primary" size="lg">
              Large
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" loading>
              Loading…
            </Button>
          </div>
        </div>
      </Section>

      {/* Form Fields */}
      <Section title="Form Fields">
        <div className="grid sm:grid-cols-2 gap-5 max-w-2xl">
          <FormField
            label="Company Name"
            required
            placeholder="e.g. Acme Logistics"
          />
          <FormField
            label="Email Address"
            type="email"
            placeholder="hello@company.com"
          />
          <FormField
            label="Box Dimensions"
            placeholder="L × W × H in cm"
            hint="Enter dimensions in centimetres"
          />
          <FormField
            label="Invalid Field"
            placeholder="This has an error"
            error="This field is required"
          />
          <FormField
            as="textarea"
            label="Special Requirements"
            placeholder="Describe any special packaging needs…"
            className="sm:col-span-2"
          />
        </div>
      </Section>

      {/* Cards */}
      <Section title="Cards">
        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-muted-foreground">
              Simple card body. No header or footer.
            </p>
          </Card>
          <Card header="Card With Header">
            <p className="text-sm text-muted-foreground">
              This card has a header slot.
            </p>
          </Card>
          <Card
            header="Full Card"
            footer={
              <div className="flex justify-end">
                <Button variant="primary" size="sm">
                  Action
                </Button>
              </div>
            }
          >
            <p className="text-sm text-muted-foreground">
              This card has both a header and a footer with an action button.
            </p>
          </Card>
        </div>
      </Section>

      {/* Status Badges */}
      <Section title="Status Badges">
        <div className="flex flex-wrap gap-2">
          {SECTION_STATUSES.map((s) => (
            <StatusBadge key={s} status={s} />
          ))}
        </div>
      </Section>

      {/* Table */}
      <Section title="Table">
        <div className="card-base overflow-hidden">
          <table className="w-full text-sm">
            <thead className="table-header-row">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Order #
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Box Type
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Qty
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-semibold text-foreground">
                  Amount
                </th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {[
                {
                  id: "CGV-001",
                  type: "Wooden Pallet Box",
                  qty: 500,
                  status: "pending",
                  amount: 3200,
                },
                {
                  id: "CGV-002",
                  type: "Plastic Industrial",
                  qty: 200,
                  status: "inProduction",
                  amount: 1850,
                },
                {
                  id: "CGV-003",
                  type: "Custom Foam Insert",
                  qty: 1000,
                  status: "delivered",
                  amount: 5400,
                },
                {
                  id: "CGV-004",
                  type: "Heavy-Duty Wooden",
                  qty: 80,
                  status: "rejected",
                  amount: 0,
                },
              ].map((row, i) => (
                <tr
                  key={row.id}
                  className={i % 2 === 1 ? "bg-muted/20" : ""}
                  data-ocid={`design_system.item.${i + 1}`}
                >
                  <td className="px-4 py-3 font-mono font-medium">#{row.id}</td>
                  <td className="px-4 py-3">{row.type}</td>
                  <td className="px-4 py-3">{row.qty.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={row.status} />
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {row.amount > 0 ? `$${row.amount.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="secondary"
                      size="sm"
                      data-ocid={`design_system.edit_button.${i + 1}`}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Upload Box */}
      <Section title="Upload Box">
        <div className="max-w-md">
          <UploadBox
            label="Upload Order Documents"
            subLabel="PDF, PNG, JPG up to 10MB"
            accept=".pdf,.png,.jpg,.jpeg"
            multiple
          />
        </div>
      </Section>

      {/* Stepper */}
      <Section title="Stepper / Timeline">
        <div className="space-y-8">
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Horizontal
            </p>
            <Stepper
              steps={STEPPER_STEPS}
              currentStep={stepperStep}
              orientation="horizontal"
            />
            <div className="flex gap-2 mt-6">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setStepperStep((s) => Math.max(0, s - 1))}
                disabled={stepperStep === 0}
                data-ocid="design_system.pagination_prev"
              >
                ← Prev
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() =>
                  setStepperStep((s) =>
                    Math.min(STEPPER_STEPS.length - 1, s + 1),
                  )
                }
                disabled={stepperStep === STEPPER_STEPS.length - 1}
                data-ocid="design_system.pagination_next"
              >
                Next →
              </Button>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
              Vertical
            </p>
            <div className="max-w-xs">
              <Stepper
                steps={STEPPER_STEPS}
                currentStep={stepperStep}
                orientation="vertical"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Modal */}
      <Section title="Modal / Popup">
        <Button
          variant="primary"
          onClick={() => setModalOpen(true)}
          data-ocid="design_system.open_modal_button"
        >
          Open Demo Modal
        </Button>

        <Modal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Order Details"
          description="View and manage the full details for this order."
          size="md"
          footer={
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setModalOpen(false)}
                data-ocid="modal.cancel_button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={() => setModalOpen(false)}
                data-ocid="modal.confirm_button"
              >
                Confirm
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField label="Order Number" value="CGV-2026-0042" readOnly />
              <FormField label="Customer" value="Acme Logistics" readOnly />
            </div>
            <FormField
              as="textarea"
              label="Notes"
              placeholder="Add internal notes here…"
              rows={4}
            />
          </div>
        </Modal>
      </Section>
    </div>
  );
}
