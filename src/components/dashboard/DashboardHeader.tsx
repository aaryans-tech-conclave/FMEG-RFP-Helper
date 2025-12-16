import { Bell, Settings, Sun, Moon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const DashboardHeader = () => {
  const [isDark, setIsDark] = useState(false);
  const [hasNotification, setHasNotification] = useState(true);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="flex items-center justify-between pb-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Agentic AI RFP Console
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Live status of RFP responses powered by Sales, Technical & Pricing Agents
        </p>
        <p className="text-muted-foreground text-xs mt-1 flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-muted-foreground/50" />
          Last updated: {new Date().toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
          })}
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {hasNotification && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-warning rounded-full" />
          )}
        </Button>
        
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
        
        <div className="flex items-center gap-2 pl-4 border-l border-border">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
          <Moon className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};
