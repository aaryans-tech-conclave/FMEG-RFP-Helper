import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  icon: LucideIcon;
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  confidence?: number;
  iconColor?: string;
}

export const StatsCard = ({
  icon: Icon,
  title,
  value,
  subtitle,
  trend,
  confidence,
  iconColor = "text-primary",
}: StatsCardProps) => {
  return (
    <Card className="p-5 bg-card border border-border hover:shadow-card-hover transition-all duration-200 animate-fade-in">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("p-2 rounded-lg bg-secondary/50", iconColor)}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && (
          <span
            className={cn(
              "text-sm font-medium flex items-center gap-0.5",
              trend.isPositive ? "text-success" : "text-destructive"
            )}
          >
            {trend.isPositive ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-bold text-foreground">{value}</p>
        <p className="text-sm font-medium text-foreground">{title}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      {confidence !== undefined && (
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Avg Confidence</span>
          <span className="text-sm font-semibold text-foreground">{confidence}%</span>
        </div>
      )}
    </Card>
  );
};
