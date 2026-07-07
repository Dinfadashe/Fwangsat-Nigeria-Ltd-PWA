"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, PackagePlus, Pencil, AlertTriangle, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, formatNumber } from "@/lib/utils";
import { Modal } from "@/components/ui/Modal";
import { Badge } from "@/components/ui/Badge";
import type { WaterProduct } from "@/lib/types";

export function WaterInventoryManager({
  products,
  globalThreshold,
}: {
  products: WaterProduct[];
  globalThreshold: number;
}) {
  const router = useRouter();
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState<WaterProduct | null>(null);
  const [restocking, setRestocking] = useState<WaterProduct | null>(null);
  const [threshold, setThreshold] = useState(String(globalThreshold));
  const [savingThreshold, setSavingThreshold] = useState(false);

  async function saveThreshold() {
    setSavingThreshold(true);
    const supabase = createClient();
    await supabase.from("app_settings").update({ water_low_stock_threshold: Number(threshold) }).eq("id", true);
    setSavingThreshold(false);
    router.refresh();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="glass-panel p-5 flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
        <div>
          <p className="text-sm text-white font-medium">Low-stock alert threshold</p>
          <p className="text-xs text-white/40">Applies to products without their own custom level.</p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="number"
            className="input-field !w-24 !py-2 text-sm"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
          />
          <button onClick={saveThreshold} disabled={savingThreshold} className="btn-secondary !py-2 !px-4 text-xs">
            {savingThreshold ? <Loader2 className="animate-spin" size={14} /> : "Save"}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-white">Product inventory</h3>
        <button onClick={() => setAddOpen(true)} className="btn-primary !py-2.5 !px-5 text-sm">
          <Plus size={16} /> New product
        </button>
      </div>

      {products.length === 0 ? (
        <div className="glass-panel py-16 text-center text-white/40">No products yet — add your first one.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {products.map((p) => {
            const effectiveThreshold = p.reorder_level ?? globalThreshold;
            const isLow = p.quantity_on_hand <= effectiveThreshold;
            return (
              <div key={p.id} className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-display text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-white/40 font-mono">{formatNaira(p.unit_price)} / unit</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-mono text-white">{formatNumber(p.quantity_on_hand)} units</span>
                  {isLow && (
                    <Badge tone="danger">
                      <AlertTriangle size={11} className="mr-1" /> Low stock
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setRestocking(p)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full bg-signal text-ink-950 font-medium"
                  >
                    <PackagePlus size={13} /> Restock
                  </button>
                  <button
                    onClick={() => setEditing(p)}
                    className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-full border border-white/15 text-white/60"
                  >
                    <Pencil size={13} /> Edit
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ProductModal open={addOpen} onClose={() => setAddOpen(false)} mode="create" />
      <ProductModal open={!!editing} onClose={() => setEditing(null)} mode="edit" product={editing ?? undefined} />
      <RestockModal open={!!restocking} onClose={() => setRestocking(null)} product={restocking ?? undefined} />
    </div>
  );
}

function ProductModal({
  open,
  onClose,
  mode,
  product,
}: {
  open: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  product?: WaterProduct;
}) {
  const router = useRouter();
  const [name, setName] = useState(product?.name ?? "");
  const [price, setPrice] = useState(product?.unit_price?.toString() ?? "");
  const [qty, setQty] = useState(product?.quantity_on_hand?.toString() ?? "0");
  const [reorder, setReorder] = useState(product?.reorder_level?.toString() ?? "");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const supabase = createClient();
    const payload = {
      name,
      unit_price: Number(price),
      reorder_level: reorder ? Number(reorder) : null,
    };
    if (mode === "create") {
      await supabase.from("water_products").insert({ ...payload, quantity_on_hand: Number(qty) });
    } else if (product) {
      await supabase.from("water_products").update(payload).eq("id", product.id);
    }
    setSubmitting(false);
    onClose();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title={mode === "create" ? "New product" : "Edit product"}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label-field">Product name</label>
          <input required className="input-field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Swan Table Water 75cl (Carton of 24)" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label-field">Unit price (₦)</label>
            <input required type="number" className="input-field" value={price} onChange={(e) => setPrice(e.target.value)} />
          </div>
          {mode === "create" && (
            <div>
              <label className="label-field">Opening quantity</label>
              <input required type="number" className="input-field" value={qty} onChange={(e) => setQty(e.target.value)} />
            </div>
          )}
        </div>
        <div>
          <label className="label-field">Custom low-stock level (optional)</label>
          <input type="number" className="input-field" value={reorder} onChange={(e) => setReorder(e.target.value)} placeholder="Leave blank to use the global threshold" />
        </div>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Loader2 className="animate-spin" size={16} /> : mode === "create" ? "Add product" : "Save changes"}
        </button>
      </form>
    </Modal>
  );
}

function RestockModal({ open, onClose, product }: { open: boolean; onClose: () => void; product?: WaterProduct }) {
  const router = useRouter();
  const [qty, setQty] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product) return;
    setSubmitting(true);
    const supabase = createClient();
    await supabase
      .from("water_products")
      .update({ quantity_on_hand: product.quantity_on_hand + Number(qty) })
      .eq("id", product.id);
    await supabase.from("stock_movements").insert({
      product_id: product.id,
      change: Number(qty),
      reason: "restock",
    });
    setSubmitting(false);
    setQty("");
    onClose();
    router.refresh();
  }

  return (
    <Modal open={open} onClose={onClose} title={`Restock ${product?.name ?? ""}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="label-field">Quantity to add</label>
          <input required type="number" min={1} className="input-field" value={qty} onChange={(e) => setQty(e.target.value)} />
        </div>
        <p className="text-xs text-white/40">
          Current stock: {product ? formatNumber(product.quantity_on_hand) : 0} units
        </p>
        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? <Loader2 className="animate-spin" size={16} /> : "Confirm restock"}
        </button>
      </form>
    </Modal>
  );
}
