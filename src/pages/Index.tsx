import { useState } from "react";
import { Search, CheckSquare, RefreshCw, Upload, Trophy } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { LiveRFPStatus } from "@/components/dashboard/LiveRFPStatus";
import { CalendarWidget } from "@/components/dashboard/CalendarWidget";
import { DeadlinesTable } from "@/components/dashboard/DeadlinesTable";
import { ReviewPanel } from "@/components/dashboard/ReviewPanel";
import { InventoryPanel } from "@/components/dashboard/InventoryPanel";

const statsData = [
  {
    icon: Search,
    title: "RFPs Scanned",
    value: 256,
    subtitle: "this month",
    trend: { value: "+10%", isPositive: true },
    confidence: 89,
    iconColor: "text-info",
  },
  {
    icon: CheckSquare,
    title: "RFPs Qualified",
    value: 78,
    trend: { value: "+15%", isPositive: true },
    confidence: 92,
    iconColor: "text-warning",
  },
  {
    icon: RefreshCw,
    title: "RFPs In Progress",
    value: 12,
    trend: { value: "-5%", isPositive: false },
    confidence: 87,
    iconColor: "text-warning",
  },
  {
    icon: Upload,
    title: "Responses Submitted",
    value: 9,
    trend: { value: "+8%", isPositive: true },
    confidence: 95,
    iconColor: "text-success",
  },
  {
    icon: Trophy,
    title: "Success Rate",
    value: "33%",
    trend: { value: "+2%", isPositive: true },
    confidence: 90,
    iconColor: "text-warning",
  },
];

const Index = () => {
  const [selectedRFP, setSelectedRFP] = useState<string | null>("RFP-239");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-[1600px] mx-auto p-6 space-y-6">
        {/* Header */}
        <DashboardHeader />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {statsData.map((stat, idx) => (
            <StatsCard
              key={idx}
              icon={stat.icon}
              title={stat.title}
              value={stat.value}
              subtitle={stat.subtitle}
              trend={stat.trend}
              confidence={stat.confidence}
              iconColor={stat.iconColor}
            />
          ))}
        </div>

        {/* Live Status & Calendar Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LiveRFPStatus />
          </div>
          <div>
            <CalendarWidget />
          </div>
        </div>

        {/* Deadlines Table */}
        <DeadlinesTable onSelectRFP={setSelectedRFP} />

        {/* Review Panel */}
        {selectedRFP && (
          <ReviewPanel 
            rfpId={selectedRFP} 
            client={selectedRFP === "RFP-239" ? "NTPC" : "Client"}
            stage="Tech Mapped"
          />
        )}

        {/* Inventory Panel */}
        <InventoryPanel />
      </div>
    </div>
  );
};

export default Index;
