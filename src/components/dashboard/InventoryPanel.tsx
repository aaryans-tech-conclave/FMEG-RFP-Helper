import { useEffect, useMemo, useState } from "react";
import { Search, Plus, ArrowUpDown } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

const CONDUCTORS = ["CU", "AL"] as const;
const INSULATIONS = ["XLPE", "PVC", "FR-XLPE", "HRXLPE", "EPR"] as const;
const CORES = ["1C", "2C", "3C", "3.5C", "4C"] as const;
const CSAS = [50, 70, 95, 120, 150, 185, 240, 300, 400, 630] as const;

// Single final segment for now (per your current DB schema)
const SPECIALS = ["AR", "UA", "STA", "ATA", "LT", "HT", "FR", "FRLS"] as const;

const MARGINS = ["low", "mid", "high"] as const;
const UNITS = ["m", "nos"] as const;

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

const PAGE_SIZE = 10;

export const InventoryPanel = () => {
  const [items, setItems] = useState<InventoryRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI controls
  const [searchQuery, setSearchQuery] = useState("");
  const [unitFilter, setUnitFilter] = useState<"all" | "m" | "nos">("all");
  const [marginFilter, setMarginFilter] = useState<
    "all" | "low" | "mid" | "high"
  >("all");
  const [stockFilter, setStockFilter] = useState<
    "all" | "in_stock" | "out_of_stock"
  >("all");

  const [sortKey, setSortKey] = useState<SortKey>("updated_at");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // pagination
  const [page, setPage] = useState(1);

  // add dialog state
  const [addOpen, setAddOpen] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);

  // add form state
  const [form, setForm] = useState({
    conductor: "CU",
    insulation: "XLPE",
    cores: "3C",
    csa: 240,
    special: "AR",

    current_stock_qty: 0,
    unit: "m",
    lead_time_days: 0,
    avg_cost: 0,
    base_price: 0,
    margin_band: "mid",
  });

  const fetchInventory = async () => {
    const { data, error } = await supabase
      .from("inventory")
      .select(
        "sku_id,current_stock_qty,unit,lead_time_days,avg_cost,base_price,margin_band,created_at,updated_at"
      );

    if (error) throw error;

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
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchInventory();
      } catch (e: any) {
        setError(e?.message ?? "Failed to load inventory");
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const buildSkuId = () =>
    `${form.conductor}_${form.insulation}_${form.cores}_${form.csa}_${form.special}`;

  const handleAddToInventory = async () => {
    try {
      setAdding(true);
      setAddError(null);

      const sku_id = buildSkuId();

      if (!sku_id) throw new Error("SKU is invalid");
      if (Number(form.current_stock_qty) < 0) throw new Error("Stock cannot be negative");
      if (Number(form.lead_time_days) < 0) throw new Error("Lead time cannot be negative");
      if (Number(form.avg_cost) < 0) throw new Error("Avg cost cannot be negative");
      if (Number(form.base_price) < 0) throw new Error("Base price cannot be negative");

      // ✅ UPSERT: insert if new, update if sku_id already exists
      const { error } = await supabase
        .from("inventory")
        .upsert(
          {
            sku_id,
            current_stock_qty: Number(form.current_stock_qty),
            unit: form.unit,
            lead_time_days: Number(form.lead_time_days),
            avg_cost: Number(form.avg_cost),
            base_price: Number(form.base_price),
            margin_band: form.margin_band,
          },
          { onConflict: "sku_id" }
        );

      if (error) throw new Error(error.message);

      await fetchInventory();

      setAddOpen(false);
      setForm((f) => ({
        ...f,
        current_stock_qty: 0,
        lead_time_days: 0,
        avg_cost: 0,
        base_price: 0,
      }));
    } catch (e: any) {
      setAddError(e?.message ?? "Failed to add item");
    } finally {
      setAdding(false);
    }
  };

  const filteredSorted = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let arr = items.filter((x) => {
      const matchesSearch = !q || x.sku_id.toLowerCase().includes(q);

      const matchesUnit = unitFilter === "all" || x.unit === unitFilter;

      const mb = (x.margin_band?.toLowerCase() as MarginBand) || "unknown";
      const matchesMargin = marginFilter === "all" || mb === marginFilter;

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

  // reset to page 1 when filters/sort/search change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, unitFilter, marginFilter, stockFilter, sortKey, sortDir]);

  const totals = useMemo(() => {
    const totalSkus = filteredSorted.length;
    const outOfStock = filteredSorted.filter((x) => x.current_stock_qty === 0).length;
    return { totalSkus, outOfStock };
  }, [filteredSorted]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredSorted.length / PAGE_SIZE)),
    [filteredSorted.length]
  );

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredSorted.slice(start, start + PAGE_SIZE);
  }, [filteredSorted, page]);

  // keep page valid if results shrink
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const marginBadge = (mb: string) => {
    const v = mb.toLowerCase();
    if (v === "high") return "bg-warning/10 text-warning border-warning/20";
    if (v === "mid") return "bg-info/10 text-info border-info/20";
    if (v === "low") return "bg-success/10 text-success border-success/20";
    return "bg-muted text-muted-foreground";
  };

  const toggleSortDir = () => setSortDir((d) => (d === "asc" ? "desc" : "asc"));

  if (loading) return <Card className="p-5">Loading…</Card>;
  if (error) return <Card className="p-5">Error: {error}</Card>;

  const startNum = filteredSorted.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endNum = Math.min(page * PAGE_SIZE, filteredSorted.length);

  return (
    <Card className="p-5 bg-card border border-border">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground text-lg">Manage your Inventory</h3>
          <p className="text-xs text-muted-foreground">
            {`${totals.totalSkus} SKUs • ${totals.outOfStock} out of stock`}
          </p>
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

          <Button
            className="h-9"
            onClick={() => {
              setAddError(null);
              setAddOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add to Inventory
          </Button>

          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogContent className="w-[700px] max-w-[92vw] origin-top [transform:scale(0.75)_translateX(-60%)_translateY(-50%)]">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
              </DialogHeader>

              <div className="rounded-md border border-border bg-secondary/30 p-3">
                <p className="text-xs text-muted-foreground">SKU Preview</p>
                <p className="text-sm font-semibold text-foreground">{buildSkuId()}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-2">
                <div className="space-y-2">
                  <Label>Conductor</Label>
                  <Select
                    value={form.conductor}
                    onValueChange={(v) => setForm((f) => ({ ...f, conductor: v }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONDUCTORS.map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Insulation / Construction</Label>
                  <Select
                    value={form.insulation}
                    onValueChange={(v) => setForm((f) => ({ ...f, insulation: v }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {INSULATIONS.map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Cores</Label>
                  <Select
                    value={form.cores}
                    onValueChange={(v) => setForm((f) => ({ ...f, cores: v }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CORES.map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>CSA</Label>
                  <Select
                    value={String(form.csa)}
                    onValueChange={(v) => setForm((f) => ({ ...f, csa: Number(v) }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CSAS.map((x) => (
                        <SelectItem key={x} value={String(x)}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Sheath / Armour / Special</Label>
                  <Select
                    value={form.special}
                    onValueChange={(v) => setForm((f) => ({ ...f, special: v }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SPECIALS.map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Margin</Label>
                  <Select
                    value={form.margin_band}
                    onValueChange={(v) => setForm((f) => ({ ...f, margin_band: v }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MARGINS.map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Stock</Label>
                  <Input
                    className="h-9"
                    type="number"
                    min={0}
                    value={form.current_stock_qty}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, current_stock_qty: Number(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Unit</Label>
                  <Select
                    value={form.unit}
                    onValueChange={(v) => setForm((f) => ({ ...f, unit: v }))}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {UNITS.map((x) => (
                        <SelectItem key={x} value={x}>
                          {x}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Lead Time (days)</Label>
                  <Input
                    className="h-9"
                    type="number"
                    min={0}
                    value={form.lead_time_days}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, lead_time_days: Number(e.target.value) }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Avg Cost</Label>
                  <Input
                    className="h-9"
                    type="number"
                    min={0}
                    value={form.avg_cost}
                    onChange={(e) => setForm((f) => ({ ...f, avg_cost: Number(e.target.value) }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Base Price</Label>
                  <Input
                    className="h-9"
                    type="number"
                    min={0}
                    value={form.base_price}
                    onChange={(e) =>
                      setForm((f) => ({ ...f, base_price: Number(e.target.value) }))
                    }
                  />
                </div>
              </div>

              {addError && <p className="text-sm text-destructive mt-2">{addError}</p>}

              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setAddOpen(false)} disabled={adding}>
                  Cancel
                </Button>
                <Button onClick={handleAddToInventory} disabled={adding}>
                  {adding ? "Adding…" : "Add Item"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
            {pageItems.map((x) => (
              <tr
                key={x.sku_id}
                className="border-b border-border/50 hover:bg-secondary/30 transition-colors"
              >
                <td className="py-3 px-4 text-sm font-medium text-foreground">{x.sku_id}</td>

                <td className="py-3 px-4 text-sm">
                  <span
                    className={cn(
                      x.current_stock_qty === 0 ? "text-destructive font-medium" : "text-foreground"
                    )}
                  >
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

            {pageItems.length === 0 && (
              <tr>
                <td colSpan={9} className="py-10 text-center text-sm text-muted-foreground">
                  No results found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          Showing {startNum}-{endNum} of {filteredSorted.length} (filtered) • {items.length} total
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="h-9"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Prev
          </Button>

          <span className="text-sm text-muted-foreground">
            Page <span className="font-medium text-foreground">{page}</span> /{" "}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>

          <Button
            variant="outline"
            className="h-9"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
};
