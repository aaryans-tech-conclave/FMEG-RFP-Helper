import { CalendarDays } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

// Map your DB "stage" -> dot color class
const stageToDotColor: Record<string, string> = {
  qualified: "bg-info",
  "tech-mapped": "bg-warning", // treat as in-progress-ish
  priced: "bg-warning",
  submitted: "bg-success",
  due: "bg-destructive",
};

// what we actually need from Supabase
type RfpRow = {
  id: string;
  client: string;
  due_date: string; // YYYY-MM-DD
  stage: string;
};

type DayEvent = {
  day: number;
  stage: string;
};

export const CalendarWidget = () => {
  // make it show the real current month
  const [currentDate] = useState(() => new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const [events, setEvents] = useState<DayEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const weekDays = ["S", "M", "T", "W", "T", "F", "S"];

  // build calendar grid
  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  // Fetch RFPs whose due_date is in this month
  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        // first day of month (YYYY-MM-DD)
        const start = new Date(year, month, 1);
        // first day of next month
        const end = new Date(year, month + 1, 1);

        const startStr = start.toISOString().slice(0, 10);
        const endStr = end.toISOString().slice(0, 10);

        const { data, error } = await supabase
          .from("rfps")
          .select("id,client,due_date,stage")
          .gte("due_date", startStr)
          .lt("due_date", endStr)
          .order("due_date", { ascending: true });

        if (error) throw error;

        const rows = (data ?? []) as RfpRow[];

        const mapped: DayEvent[] = rows
          .map((r) => {
            const d = new Date(r.due_date);
            const dayNum = d.getDate();
            return { day: dayNum, stage: r.stage };
          })
          .filter((e) => e.day >= 1 && e.day <= daysInMonth);

        setEvents(mapped);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load calendar events");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [year, month, daysInMonth]);

  // If multiple RFPs share same day, we want "some dot" (or you can show multiple later)
  const eventsByDay = useMemo(() => {
    const map = new Map<number, DayEvent[]>();
    for (const ev of events) {
      const arr = map.get(ev.day) ?? [];
      arr.push(ev);
      map.set(ev.day, arr);
    }
    return map;
  }, [events]);

  const today = new Date();
  const isSameMonth =
    today.getFullYear() === year && today.getMonth() === month;

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
        {loading && (
          <p className="text-xs text-muted-foreground mt-1">Loading deadlines…</p>
        )}
        {error && (
          <p className="text-xs text-destructive mt-1">{error}</p>
        )}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map((day, idx) => (
          <div
            key={idx}
            className="text-center text-xs font-medium text-muted-foreground py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const dayEvents = day ? eventsByDay.get(day) ?? [] : [];
          const hasAnyEvent = dayEvents.length > 0;

          // If multiple events on same day, you can show 1 dot or multiple dots.
          // Here: show one dot representing the "most important" stage.
          const stagePriority = ["submitted", "priced", "tech-mapped", "qualified"];
          const chosenStage =
            dayEvents
              .map((e) => e.stage)
              .sort(
                (a, b) => stagePriority.indexOf(a) - stagePriority.indexOf(b)
              )[0] ?? null;

          const dotClass =
            chosenStage ? stageToDotColor[chosenStage] ?? "bg-muted" : "";

          const isToday =
            isSameMonth && day !== null && day === today.getDate();

          return (
            <div
              key={idx}
              className={cn(
                "aspect-square flex items-center justify-center text-sm rounded-md relative transition-all",
                day ? "hover:bg-secondary cursor-pointer" : "",
                isToday && "bg-primary/10 border border-primary/30 font-semibold"
              )}
              title={
                hasAnyEvent
                  ? `${dayEvents.length} deadline(s)`
                  : undefined
              }
            >
              {day && (
                <>
                  <span className={cn("text-foreground", hasAnyEvent && "font-medium")}>
                    {day}
                  </span>

                  {hasAnyEvent && (
                    <span
                      className={cn(
                        "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                        dotClass
                      )}
                    />
                  )}

                  {/* Optional: show count if multiple deadlines on same day */}
                  {dayEvents.length > 1 && (
                    <span className="absolute top-1 right-1 text-[10px] text-muted-foreground">
                      {dayEvents.length}
                    </span>
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
            <span className="text-muted-foreground">Tech/Priced</span>
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
