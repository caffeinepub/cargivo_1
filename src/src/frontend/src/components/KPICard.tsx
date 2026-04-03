import { Card, CardContent } from "@/components/ui/card";
import { TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";

interface KPICardProps {
  title: string;
  value: string;
  delta?: string;
  deltaType?: "positive" | "negative" | "neutral";
  icon: React.ComponentType<{ size?: number; className?: string }>;
  index: number;
}

export function KPICard({
  title,
  value,
  delta,
  deltaType = "positive",
  icon: Icon,
  index,
}: KPICardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <Card className="bg-card border-border shadow-card hover:shadow-card-hover transition-shadow">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1.5">
                {value}
              </p>
              {delta && (
                <div
                  className={`flex items-center gap-1 mt-1.5 text-xs font-medium ${
                    deltaType === "positive"
                      ? "text-emerald-600"
                      : deltaType === "negative"
                        ? "text-destructive"
                        : "text-muted-foreground"
                  }`}
                >
                  {deltaType === "positive" ? (
                    <TrendingUp size={12} />
                  ) : (
                    <TrendingDown size={12} />
                  )}
                  <span>{delta}</span>
                </div>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon size={18} className="text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
