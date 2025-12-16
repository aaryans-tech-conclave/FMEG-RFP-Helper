import { useState } from "react";
import { Package, CheckCircle2, MessageSquare, XCircle, RotateCcw, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface AgentConfidence {
  name: string;
  status: "completed" | "active" | "pending";
  confidence: number;
  color: string;
}

interface SKUMatch {
  sku: string;
  inStock: boolean;
  stockLevel: "In Stock" | "Low Stock" | "Out of Stock";
  matchPercentage: number;
  leadTime: string;
}

interface StockInfo {
  product: string;
  available: string;
  location: string;
  leadTime: string;
  isAvailable: boolean;
}

interface ReviewPanelProps {
  rfpId?: string;
  client?: string;
  stage?: string;
}

const defaultAgents: AgentConfidence[] = [
  { name: "Sales Agent", status: "completed", confidence: 91, color: "bg-foreground" },
  { name: "Technical Agent", status: "active", confidence: 93, color: "bg-info" },
  { name: "Pricing Agent", status: "pending", confidence: 0, color: "bg-muted" },
];

const defaultSKUs: SKUMatch[] = [
  { sku: "CAB-240-HV-2K", inStock: true, stockLevel: "In Stock", matchPercentage: 96, leadTime: "2 days" },
  { sku: "CAB-240-MV-2K", inStock: true, stockLevel: "In Stock", matchPercentage: 89, leadTime: "5 days" },
  { sku: "CAB-250-HV-2K", inStock: false, stockLevel: "Low Stock", matchPercentage: 82, leadTime: "14 days" },
];

const defaultStock: StockInfo = {
  product: "2 km 240 mm² Cable",
  available: "2.5 km",
  location: "Warehouse A - Mumbai",
  leadTime: "2 days",
  isAvailable: true,
};

const statusConfig: Record<string, { label: string; className: string }> = {
  completed: { label: "completed", className: "bg-success/10 text-success" },
  active: { label: "active", className: "bg-info/10 text-info" },
  pending: { label: "pending", className: "bg-muted text-muted-foreground" },
};

const stockLevelConfig: Record<string, string> = {
  "In Stock": "bg-success/10 text-success border-success/20",
  "Low Stock": "bg-warning/10 text-warning border-warning/20",
  "Out of Stock": "bg-destructive/10 text-destructive border-destructive/20",
};

export const ReviewPanel = ({ 
  rfpId = "RFP-239", 
  client = "NTPC",
  stage = "Tech Mapped"
}: ReviewPanelProps) => {
  const [comment, setComment] = useState("");
  const [agents] = useState<AgentConfidence[]>(defaultAgents);
  const [skuMatches] = useState<SKUMatch[]>(defaultSKUs);
  const [stockInfo] = useState<StockInfo>(defaultStock);

  const getMatchColor = (percentage: number): string => {
    if (percentage >= 90) return "text-success";
    if (percentage >= 80) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="p-5 bg-card border border-border">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h3 className="font-semibold text-foreground text-lg">RFP Review & Analysis Panel</h3>
          <p className="text-sm text-muted-foreground">{rfpId} — {client}</p>
        </div>
        <Badge variant="outline" className="bg-info/10 text-info border-info/20">
          {stage}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Agent Confidence & SKU Matches */}
        <div className="space-y-6">
          {/* Agent Confidence Levels */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Agent Confidence Levels</h4>
            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">{agent.name}</span>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", statusConfig[agent.status].className)}
                      >
                        {statusConfig[agent.status].label}
                      </Badge>
                    </div>
                    <span className="text-sm font-semibold text-foreground">{agent.confidence}%</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-500", agent.color)}
                      style={{ width: `${agent.confidence}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top SKU Matches */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Top SKU Matches</h4>
            <div className="space-y-3">
              {skuMatches.map((sku) => (
                <div 
                  key={sku.sku} 
                  className="p-3 rounded-lg border border-border bg-secondary/20 hover:bg-secondary/40 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{sku.sku}</span>
                      <Badge 
                        variant="outline" 
                        className={cn("text-xs", stockLevelConfig[sku.stockLevel])}
                      >
                        {sku.stockLevel}
                      </Badge>
                    </div>
                    <span className={cn("text-sm font-semibold", getMatchColor(sku.matchPercentage))}>
                      {sku.matchPercentage}% Match
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-1.5 flex-1 bg-secondary rounded-full overflow-hidden mr-4">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          sku.matchPercentage >= 90 ? "bg-success" :
                          sku.matchPercentage >= 80 ? "bg-warning" : "bg-destructive"
                        )}
                        style={{ width: `${sku.matchPercentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground">Lead: {sku.leadTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Stock & Actions */}
        <div className="space-y-6">
          {/* Stock Availability */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Stock Availability</h4>
            <div className="p-4 rounded-lg bg-info/5 border border-info/20">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-info/10">
                  <Globe className="h-5 w-5 text-info" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-foreground">{stockInfo.product}</span>
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  </div>
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p><span className="text-foreground">Available:</span> {stockInfo.available}</p>
                    <p><span className="text-foreground">Location:</span> {stockInfo.location}</p>
                    <p><span className="text-foreground">Lead Time:</span> {stockInfo.leadTime}</p>
                  </div>
                  <div className="mt-3">
                    <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Stock Available
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reviewer Actions */}
          <div>
            <h4 className="font-medium text-foreground mb-4">Reviewer Actions</h4>
            <div className="space-y-3">
              <Textarea
                placeholder="Add comment to agent..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-[80px] resize-none"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <Button className="bg-success hover:bg-success/90 text-success-foreground">
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button variant="outline" className="border-warning text-warning hover:bg-warning/10">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Request Revision
                </Button>
                <Button variant="outline" className="text-muted-foreground hover:bg-secondary">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Comment
                </Button>
                <Button variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
