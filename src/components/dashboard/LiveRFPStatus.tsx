import { Activity, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type RFPStatus = "scanning" | "qualification" | "in-progress" | "tech-mapped" | "priced" | "submitted" | "qualified";

interface RFPItem {
  id: string;
  client: string;
  status: RFPStatus;
  activity: string;
  confidence: number;
  timeAgo: string;
  progress: number;
  isUrgent?: boolean;
}

const statusConfig: Record<RFPStatus, { label: string; className: string }> = {
  scanning: { label: "Scanning", className: "bg-info/10 text-info border-info/20" },
  qualification: { label: "Qualification", className: "bg-warning/10 text-warning border-warning/20" },
  "in-progress": { label: "In Progress", className: "bg-success/10 text-success border-success/20" },
  "tech-mapped": { label: "Tech Mapped", className: "bg-info/10 text-info border-info/20" },
  priced: { label: "Priced", className: "bg-warning/10 text-warning border-warning/20" },
  submitted: { label: "Submitted", className: "bg-success/10 text-success border-success/20" },
  qualified: { label: "Qualified", className: "bg-info/10 text-info border-info/20" },
};

const getProgressColor = (status: RFPStatus): string => {
  switch (status) {
    case "scanning":
    case "tech-mapped":
    case "qualified":
      return "bg-info";
    case "qualification":
    case "priced":
      return "bg-warning";
    case "in-progress":
    case "submitted":
      return "bg-success";
    default:
      return "bg-primary";
  }
};

const mockRFPs: RFPItem[] = [
  {
    id: "RFP-2025-001",
    client: "TechCorp India",
    status: "scanning",
    activity: "AI analyzing requirements",
    confidence: 92,
    timeAgo: "2 mins ago",
    progress: 92,
  },
  {
    id: "RFP-2025-015",
    client: "National Infrastructure",
    status: "qualification",
    activity: "Matching capabilities",
    confidence: 88,
    timeAgo: "5 mins ago",
    progress: 75,
  },
  {
    id: "RFP-2025-023",
    client: "Smart Cities Initiative",
    status: "in-progress",
    activity: "Drafting response",
    confidence: 95,
    timeAgo: "12 mins ago",
    progress: 95,
    isUrgent: true,
  },
];

export const LiveRFPStatus = () => {
  return (
    <Card className="p-5 bg-card border border-border">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary/50">
            <Activity className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Live RFP Status</h3>
            <p className="text-xs text-muted-foreground">Real-time activity across all stages</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm text-muted-foreground">Live</span>
        </div>
      </div>

      <div className="space-y-4">
        {mockRFPs.map((rfp) => (
          <div
            key={rfp.id}
            className={cn(
              "p-4 rounded-lg border transition-all duration-200 hover:shadow-card",
              rfp.isUrgent 
                ? "border-warning/30 bg-warning/5" 
                : "border-border bg-card"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">{rfp.id}</span>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", statusConfig[rfp.status].className)}
                >
                  <Activity className="w-3 h-3 mr-1" />
                  {statusConfig[rfp.status].label}
                </Badge>
              </div>
              <div className="text-right">
                <span className={cn(
                  "text-sm font-semibold",
                  rfp.confidence >= 90 ? "text-success" : 
                  rfp.confidence >= 80 ? "text-warning" : "text-destructive"
                )}>
                  {rfp.confidence}%
                </span>
                <p className="text-xs text-muted-foreground">{rfp.timeAgo}</p>
              </div>
            </div>

            <h4 className="font-medium text-foreground mb-1">{rfp.client}</h4>
            <p className="text-xs text-muted-foreground mb-3">{rfp.activity}</p>

            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
              <div
                className={cn(
                  "absolute inset-y-0 left-0 rounded-full transition-all duration-500",
                  getProgressColor(rfp.status),
                  rfp.status === "scanning" && "progress-animate"
                )}
                style={{ width: `${rfp.progress}%` }}
              />
            </div>

            {rfp.isUrgent && (
              <div className="absolute -top-2 -right-2">
                <AlertCircle className="w-5 h-5 text-warning" />
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};
