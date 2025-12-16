import { useState } from "react";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Stage = "tech-mapped" | "priced" | "submitted" | "qualified";
type Agent = "Technical Agent" | "Pricing Agent" | "Main Agent" | "Sales Agent";

interface RFPDeadline {
  id: string;
  client: string;
  dueDate: string;
  daysLeft?: number;
  stage: Stage;
  confidence: number;
  assignedAgent: Agent;
  stockRequirement: string;
}

const stageConfig: Record<Stage, { label: string; className: string }> = {
  "tech-mapped": { label: "Tech Mapped", className: "bg-info/10 text-info border-info/20" },
  priced: { label: "Priced", className: "bg-warning/10 text-warning border-warning/20" },
  submitted: { label: "Submitted", className: "bg-success/10 text-success border-success/20" },
  qualified: { label: "Qualified", className: "bg-info/10 text-info border-info/20" },
};

const agentConfig: Record<Agent, string> = {
  "Technical Agent": "bg-muted text-muted-foreground",
  "Pricing Agent": "bg-warning/10 text-warning",
  "Main Agent": "bg-foreground/10 text-foreground",
  "Sales Agent": "bg-destructive/10 text-destructive",
};

const mockDeadlines: RFPDeadline[] = [
  { id: "RFP-239", client: "NTPC", dueDate: "Nov 18, 2025", stage: "tech-mapped", confidence: 93, assignedAgent: "Technical Agent", stockRequirement: "2 km 240 mm² Cable" },
  { id: "RFP-240", client: "GAIL", dueDate: "Nov 22, 2025", stage: "priced", confidence: 88, assignedAgent: "Pricing Agent", stockRequirement: "800 m Copper Wire" },
  { id: "RFP-241", client: "PWD Tamil Nadu", dueDate: "Nov 25, 2025", stage: "submitted", confidence: 96, assignedAgent: "Main Agent", stockRequirement: "—" },
  { id: "RFP-242", client: "Tech Solutions Inc.", dueDate: "Nov 10, 2025", daysLeft: 3, stage: "qualified", confidence: 91, assignedAgent: "Sales Agent", stockRequirement: "500 m Fiber Cable" },
  { id: "RFP-243", client: "Global Manufacturing Co.", dueDate: "Nov 12, 2025", daysLeft: 5, stage: "tech-mapped", confidence: 85, assignedAgent: "Technical Agent", stockRequirement: "1.2 km Power Line" },
  { id: "RFP-244", client: "Healthcare Systems Ltd.", dueDate: "Nov 8, 2025", daysLeft: 1, stage: "submitted", confidence: 94, assignedAgent: "Pricing Agent", stockRequirement: "—" },
  { id: "RFP-245", client: "Finance Corp", dueDate: "Nov 15, 2025", stage: "priced", confidence: 72, assignedAgent: "Pricing Agent", stockRequirement: "300 m Cat6 Cable" },
  { id: "RFP-246", client: "Energy Solutions Group", dueDate: "Nov 9, 2025", daysLeft: 2, stage: "qualified", confidence: 68, assignedAgent: "Sales Agent", stockRequirement: "900 m HT Cable" },
];

const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 90) return "bg-success";
  if (confidence >= 75) return "bg-warning";
  return "bg-destructive";
};

export const DeadlinesTable = ({ onSelectRFP }: { onSelectRFP?: (id: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeadline, setSelectedDeadline] = useState("all");
  const [selectedConfidence, setSelectedConfidence] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const filteredDeadlines = mockDeadlines.filter((rfp) => {
    const matchesSearch = rfp.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rfp.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || rfp.stage === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const urgentCount = mockDeadlines.filter(d => d.daysLeft && d.daysLeft <= 7).length;

  return (
    <Card className="p-5 bg-card border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <h3 className="font-semibold text-foreground text-lg">Upcoming Deadlines</h3>
        
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search RFPs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-48 h-9"
            />
          </div>
          
          <Select value={selectedDeadline} onValueChange={setSelectedDeadline}>
            <SelectTrigger className="w-32 h-9">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Deadline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Deadlines</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedConfidence} onValueChange={setSelectedConfidence}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Confidence" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Confidence</SelectItem>
              <SelectItem value="high">High (90%+)</SelectItem>
              <SelectItem value="medium">Medium (75-89%)</SelectItem>
              <SelectItem value="low">Low (&lt;75%)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-28 h-9">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="tech-mapped">Tech Mapped</SelectItem>
              <SelectItem value="priced">Priced</SelectItem>
              <SelectItem value="submitted">Submitted</SelectItem>
              <SelectItem value="qualified">Qualified</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">RFP ID</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Client</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Due Date</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Stage</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Confidence</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Assigned Agent</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Stock Requirement</th>
            </tr>
          </thead>
          <tbody>
            {filteredDeadlines.map((rfp) => (
              <tr 
                key={rfp.id} 
                className="border-b border-border/50 hover:bg-secondary/30 cursor-pointer transition-colors"
                onClick={() => onSelectRFP?.(rfp.id)}
              >
                <td className="py-3 px-4 text-sm font-medium text-foreground">{rfp.id}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{rfp.client}</td>
                <td className="py-3 px-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-foreground">{rfp.dueDate}</span>
                    {rfp.daysLeft && (
                      <span className={cn(
                        "text-xs font-medium",
                        rfp.daysLeft <= 3 ? "text-destructive" : "text-warning"
                      )}>
                        {rfp.daysLeft} days left
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className={cn("text-xs", stageConfig[rfp.stage].className)}>
                    {stageConfig[rfp.stage].label}
                  </Badge>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className={cn("h-full rounded-full", getConfidenceColor(rfp.confidence))}
                        style={{ width: `${rfp.confidence}%` }}
                      />
                    </div>
                    <span className="text-sm text-foreground">{rfp.confidence}%</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <Badge variant="outline" className={cn("text-xs", agentConfig[rfp.assignedAgent])}>
                    {rfp.assignedAgent}
                  </Badge>
                </td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{rfp.stockRequirement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Showing {filteredDeadlines.length} of {mockDeadlines.length} RFPs
        </span>
        <span className="text-sm text-warning font-medium">
          {urgentCount} due within 7 days
        </span>
      </div>
    </Card>
  );
};
