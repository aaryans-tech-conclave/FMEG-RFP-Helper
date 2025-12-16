import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { cn } from "@/lib/utils";

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

interface DeadlineEvent {
  day: number;
  type: "qualified" | "in-progress" | "submitted" | "due";
}

const events: DeadlineEvent[] = [
  { day: 7, type: "qualified" },
  { day: 8, type: "in-progress" },
  { day: 14, type: "due" },
  { day: 18, type: "submitted" },
  { day: 25, type: "qualified" },
];

const eventColors: Record<string, string> = {
  qualified: "bg-info",
  "in-progress": "bg-warning",
  submitted: "bg-success",
  due: "bg-destructive",
};

export const CalendarWidget = () => {
  const [currentDate] = useState(new Date(2025, 10, 16)); // November 2025
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const getEventForDay = (day: number) => {
    return events.find(e => e.day === day);
  };

  return (
    <Card className="p-5 bg-card border border-border">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-secondary/50">
          <CalendarDays className="h-5 w-5 text-primary" />
        </div>
        <h3 className="font-semibold text-foreground">Calendar</h3>
      </div>

      <div className="text-center mb-4">
        <h4 className="font-medium text-foreground">{monthName}</h4>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, idx) => (
          <div key={idx} className="text-center text-xs font-medium text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const event = day ? getEventForDay(day) : null;
          const isToday = day === 7; // Highlight as current
          
          return (
            <div
              key={idx}
              className={cn(
                "aspect-square flex items-center justify-center text-sm rounded-md relative transition-all",
                day ? "hover:bg-secondary cursor-pointer" : "",
                isToday && "bg-primary/10 border border-primary/30 font-semibold"
              )}
            >
              {day && (
                <>
                  <span className={cn(
                    "text-foreground",
                    event && "font-medium"
                  )}>
                    {day}
                  </span>
                  {event && (
                    <span 
                      className={cn(
                        "absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full",
                        eventColors[event.type]
                      )}
                    />
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-border">
        <div className="flex flex-wrap gap-3 text-xs">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-info" />
            <span className="text-muted-foreground">Qualified</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-warning" />
            <span className="text-muted-foreground">In Progress</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Submitted</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Due</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
