"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { formatNaira, generateInvoiceNumber } from "@/lib/utils";
import type { WaterProduct } from "@/lib/types";

interface LineItem {
  productId: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
}

export function InvoiceBuilder({ products }: { products: WaterProduct[] }) {
  const router = useRouter();
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [discount, setDiscount] = useState("0");
  const [items, setItems] = useState<LineItem[]>([{ productId: null, description: "", quantity: 1, unitPrice: 0 }]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0), [items]);
  const total = Math.max(0, subtotal - Number(discount || 0));

  function updateItem(idx: number, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  }

  function selectProduct(idx: number, productId: string) {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    updateItem(idx, { productId, description: product.name, unitPrice: product.unit_price });
  }

  function addRow() {
    setItems((prev) => [...prev, { productId: null, description: "", quantity: 1, unitPrice: 0 }]);
  }
  function removeRow(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data: invoice, error: invoiceError } = await supabase
      .from("water_invoices")
      .insert({
        invoice_no: generateInvoiceNumber(),
        customer_name: customerName,
        customer_phone: customerPhone || null,
        customer_address: customerAddress || null,
        subtotal,
        discount: Number(discount || 0),
        total,
        created_by: user?.id ?? null,
      })
      .select("id")
      .single();

    if (invoiceError || !invoice) {
      setSubmitting(false);
      setError("Could not create invoice.");
      return;
    }

    const rows = items
      .filter((i) => i.description && i.quantity > 0)
      .map((i) => ({
        invoice_id: invoice.id,
        product_id: i.productId,
        description: i.description,
        quantity: i.quantity,
        unit_price: i.unitPrice,
        line_total: i.quantity * i.unitPrice,
      }));

    const { error: itemsError } = await supabase.from("water_invoice_items").insert(rows);
    if (itemsError) {
      setSubmitting(false);
      setError("Invoice created but line items failed to save.");
      return;
    }

    setSubmitting(false);
    router.push("/sales/invoices");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-6 md:p-8 flex flex-col gap-6 max-w-3xl">
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <label className="label-field">Customer name</label>
          <input required className="input-field" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
        </div>
        <div>
          <label className="label-field">Phone</label>
          <input className="input-field" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
        </div>
        <div className="sm:col-span-3">
          <label className="label-field">Delivery address (optional)</label>
          <input className="input-field" value={customerAddress} onChange={(e) => setCustomerAddress(e.target.value)} />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <label className="label-field !mb-0">Items</label>
          <button type="button" onClick={addRow} className="flex items-center gap-1 text-xs text-signal">
            <Plus size={13} /> Add item
          </button>
        </div>

        {items.map((item, idx) => (
          <div key={idx} className="grid grid-cols-12 gap-2 items-center">
            <select
              className="input-field col-span-4 !py-2.5 text-xs"
              value={item.productId ?? ""}
              onChange={(e) => selectProduct(idx, e.target.value)}
            >
              <option value="">Custom item…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              className="input-field col-span-3 !py-2.5 text-xs"
              placeholder="Description"
              value={item.description}
              onChange={(e) => updateItem(idx, { description: e.target.value })}
            />
            <input
              type="number"
              min={1}
              className="input-field col-span-2 !py-2.5 text-xs"
              value={item.quantity}
              onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })}
            />
            <input
              type="number"
              className="input-field col-span-2 !py-2.5 text-xs"
              value={item.unitPrice}
              onChange={(e) => updateItem(idx, { unitPrice: Number(e.target.value) })}
            />
            <button type="button" onClick={() => removeRow(idx)} className="col-span-1 text-white/30 hover:text-danger">
              <Trash2 size={15} />
            </button>
          </div>
        ))}
      </div>

      <div className="border-t border-white/[0.06] pt-5 flex flex-col gap-2 max-w-xs self-end w-full">
        <div className="flex justify-between text-sm text-white/60">
          <span>Subtotal</span>
          <span className="font-mono">{formatNaira(subtotal)}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-white/60">
          <span>Discount</span>
          <input
            type="number"
            className="input-field !w-28 !py-1.5 text-xs text-right"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
        </div>
        <div className="flex justify-between text-base font-semibold text-white border-t border-white/[0.06] pt-2">
          <span>Total</span>
          <span className="font-mono text-signal">{formatNaira(total)}</span>
        </div>
      </div>

      {error && <p className="text-sm text-danger">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto self-start">
        {submitting ? <Loader2 className="animate-spin" size={16} /> : "Generate invoice"}
      </button>
    </form>
  );
}
