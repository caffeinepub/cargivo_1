import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { motion } from "motion/react";

export interface StepItem {
  label: string;
  description?: string;
}

type StepState = "completed" | "active" | "upcoming";

interface StepperProps {
  steps: StepItem[];
  currentStep: number; // 0-indexed
  orientation?: "horizontal" | "vertical";
  className?: string;
}

function getStepState(index: number, current: number): StepState {
  if (index < current) return "completed";
  if (index === current) return "active";
  return "upcoming";
}

const circleBase =
  "relative z-10 flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold shrink-0 transition-all duration-300";

const circleVariants: Record<StepState, string> = {
  completed: "bg-green-500 text-white",
  active: "bg-accent text-accent-foreground ring-4 ring-accent/25",
  upcoming: "bg-muted border-2 border-border text-muted-foreground",
};

const labelVariants: Record<StepState, string> = {
  completed: "text-foreground",
  active: "text-accent font-semibold",
  upcoming: "text-muted-foreground",
};

export function Stepper({
  steps,
  currentStep,
  orientation = "horizontal",
  className,
}: StepperProps) {
  if (orientation === "vertical") {
    return (
      <div className={cn("flex flex-col gap-0", className)}>
        {steps.map((step, i) => {
          const state = getStepState(i, currentStep);
          const isLast = i === steps.length - 1;
          return (
            <div key={step.label} className="flex gap-4">
              {/* Circle + line */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08, duration: 0.25 }}
                  className={cn(circleBase, circleVariants[state])}
                >
                  {state === "completed" ? <Check size={14} /> : i + 1}
                </motion.div>
                {!isLast && (
                  <div
                    className={cn(
                      "w-0.5 flex-1 min-h-[2rem] transition-colors duration-500",
                      state === "completed" ? "bg-green-400" : "bg-border",
                    )}
                  />
                )}
              </div>

              {/* Labels */}
              <div className="pb-6">
                <p className={cn("text-sm", labelVariants[state])}>
                  {step.label}
                </p>
                {step.description && (
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal
  return (
    <div className={cn("flex items-start", className)}>
      {steps.map((step, i) => {
        const state = getStepState(i, currentStep);
        const isLast = i === steps.length - 1;
        return (
          <div
            key={step.label}
            className="flex flex-1 flex-col items-center last:flex-none"
          >
            <div className="flex items-center w-full">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08, duration: 0.25 }}
                className={cn(circleBase, circleVariants[state])}
              >
                {state === "completed" ? <Check size={14} /> : i + 1}
              </motion.div>
              {!isLast && (
                <div
                  className={cn(
                    "flex-1 h-0.5 transition-colors duration-500 mx-1",
                    state === "completed" ? "bg-green-400" : "bg-border",
                  )}
                />
              )}
            </div>
            <div className="mt-2 text-center max-w-[100px]">
              <p className={cn("text-xs", labelVariants[state])}>
                {step.label}
              </p>
              {step.description && (
                <p className="text-xs text-muted-foreground mt-0.5 hidden sm:block">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
