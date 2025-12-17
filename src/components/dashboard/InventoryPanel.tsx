import { useEffect, useMemo, useState } from "react";
import { Search, Plus, ArrowUpDown } from "lucide-react";

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
import { supabase } from "@/lib/supabase";

type MarginBand = "low" | "mid" | "high" | "unknown";
type Unit = "m" | "nos" | string;

type InventoryRow = {
  sku_id: string;
  current_stock_qty: number;
  unit: Unit;
  lead_time_days: number;
  avg_cost: number;
  base_price: number;
  margin_band: string;
  created_at: string;
  updated_at: string;
};

type SortKey =
  | "sku_id"
  | "current_stock_qty"
  | "lead_time_days"
  | "avg_cost"
  | "base_price"
  | "margin_band"
  | "updated_at";

export const InventoryPanel = () => {
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI controls
  const [searchQuery, setSearchQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState<"all" | "m" | "nos">("all");
  const [marginFilter, setMarginFilter] = useState<"all" | "low" | "mid" | "high">("all");
  const [stockFilter, setStockFilter] = useState<"all" | "in_stock" | "out_of_stock">("all");

  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("inventory")
          .select(
            "sku_id,current_stock_qty,unit,lead_time_days,avg_cost,base_price,margin_band,created_at,updated_at"
          );

        if (error) throw error;

        // supabase returns numeric possibly as number; keep defensive parsing
        const mapped: InventoryRow[] = (data ?? []).map((r: any) => ({
          sku_id: r.sku_id,
          current_stock_qty: Number(r.current_stock_qty),
          unit: r.unit,
          lead_time_days: Number(r.lead_time_days),
          avg_cost: Number(r.avg_cost),
          base_price: Number(r.base_price),
          margin_band: String(r.margin_band ?? "unknown"),
          created_at: r.created_at,
          updated_at: r.updated_at,
        }));

        setItems(mapped);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load inventory");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  const filteredSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let arr = items.filter((x) => {
      const matchesSearch =
        !q ||
        x.sku_id.toLowerCase().includes(q);

      const matchesUnit =
        unitFilter === "all" || x.unit === unitFilter;

      const mb = (x.margin_band?.toLowerCase() as MarginBand) || "unknown";
      const matchesMargin =
        marginFilter === "all" || mb === marginFilter;

      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "in_stock" && x.current_stock_qty > 0) ||
        (stockFilter === "out_of_stock" && x.current_stock_qty === 0);

      return matchesSearch && matchesUnit && matchesMargin && matchesStock;
    });

    const dir = sortDir === "asc" ? 1 : -1;

    arr.sort((a, b) => {
      const va: any = a[sortKey];
      const vb: any = b[sortKey];

      // handle string sort vs numeric sort
      if (sortKey === "sku_id" || sortKey === "margin_band") {
        return String(va).localeCompare(String(vb)) * dir;
      }
      if (sortKey === "updated_at") {
        return (new Date(va).getTime() - new Date(vb).getTime()) * dir;
      }
      return (Number(va) - Number(vb)) * dir;
    });

    return arr;
  }, [items, searchQuery, unitFilter, marginFilter, stockFilter, sortKey, sortDir]);

  const totals = useMemo(() => {
    const totalSkus = filteredSorted.length;
    const outOfStock = filteredSorted.filter((x) => x.current_stock_qty === 0).length;
    return { totalSkus, outOfStock };
  }, [filteredSorted]);

  const marginBadge = (mb: string) => {
    const v = mb.toLowerCase();
    if (v === "high") return "bg-warning/10 text-warning border-warning/20";
    if (v === "mid") return "bg-info/10 text-info border-info/20";
    if (v === "low") return "bg-success/10 text-success border-success/20";
    return "bg-muted text-muted-foreground";
  };

  const toggleSortDir = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  return (
    <Card className="p-5 bg-card border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground text-lg">Manage your Inventory</h3>
          <p className="text-xs text-muted-foreground">
            {loading ? "Loading…" : `${totals.totalSkus} SKUs • ${totals.outOfStock} out of stock`}
          </p>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search SKU…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full sm:w-56 h-9"
            />
          </div>

          <Select value={unitFilter} onValueChange={(v) => setUnitFilter(v as any)}>
            <SelectTrigger className="w-28 h-9">
              <SelectValue placeholder="Unit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Units</SelectItem>
              <SelectItem value="m">m</SelectItem>
              <SelectItem value="nos">nos</SelectItem>
            </SelectContent>
          </Select>

          <Select value={marginFilter} onValueChange={(v) => setMarginFilter(v as any)}>
            <SelectTrigger className="w-32 h-9">
              <SelectValue placeholder="Margin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Margin</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="mid">Mid</SelectItem>
              <SelectItem value="high">High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={stockFilter} onValueChange={(v) => setStockFilter(v as any)}>
            <SelectTrigger className="w-36 h-9">
              <SelectValue placeholder="Stock" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stock</SelectItem>
              <SelectItem value="in_stock">In Stock</SelectItem>
              <SelectItem value="out_of_stock">Out of Stock</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortKey} onValueChange={(v) => setSortKey(v as any)}>
            <SelectTrigger className="w-40 h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="updated_at">Sort: Updated</SelectItem>
              <SelectItem value="sku_id">Sort: SKU</SelectItem>
              <SelectItem value="current_stock_qty">Sort: Stock Qty</SelectItem>
              <SelectItem value="lead_time_days">Sort: Lead Time</SelectItem>
              <SelectItem value="avg_cost">Sort: Avg Cost</SelectItem>
              <SelectItem value="base_price">Sort: Base Price</SelectItem>
              <SelectItem value="margin_band">Sort: Margin Band</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" className="h-9" onClick={toggleSortDir}>
            <ArrowUpDown className="h-4 w-4 mr-2" />
            {sortDir === "asc" ? "Asc" : "Desc"}
          </Button>

          <Button className="h-9">
            <Plus className="h-4 w-4 mr-2" />
            Add to Inventory
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">SKU</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Stock</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Unit</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Lead Time</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Avg Cost</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Base Price</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Margin</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Created</th>
              <th className="text-left py-3 px-4 text-sm font-semibold text-foreground">Updated</th>
            </tr>
          </thead>

          <tbody>
            {filteredSorted.map((x) => (
              <tr key={x.sku_id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                <td className="py-3 px-4 text-sm font-medium text-foreground">{x.sku_id}</td>

                <td className="py-3 px-4 text-sm">
                  <span className={cn(x.current_stock_qty === 0 ? "text-destructive font-medium" : "text-foreground")}>
                    {x.current_stock_qty}
                  </span>
                </td>

                <td className="py-3 px-4 text-sm text-muted-foreground">{x.unit}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{x.lead_time_days} days</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{x.avg_cost}</td>
                <td className="py-3 px-4 text-sm text-muted-foreground">{x.base_price}</td>

                <td className="py-3 px-4">
                  <Badge variant="outline" className={cn("text-xs", marginBadge(x.margin_band))}>
                    {x.margin_band}
                  </Badge>
                </td>

                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {new Date(x.created_at).toLocaleDateString()}
                </td>

                <td className="py-3 px-4 text-sm text-muted-foreground">
                  {new Date(x.updated_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Showing {filteredSorted.length} of {items.length} SKUs
        </span>
        <span className="text-sm text-muted-foreground">
          Tip: search by SKU like <span className="font-medium">CU_XLPE</span>
        </span>
      </div>
    </Card>
  );
};
