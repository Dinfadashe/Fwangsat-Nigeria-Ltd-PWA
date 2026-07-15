import Image from "next/image";
import { formatDate, formatNaira } from "@/lib/utils";
import type { WaterInvoice } from "@/lib/types";
import { SITE, BANK_DETAILS } from "@/lib/constants";

/**
 * Rendered on a white background (not the app's dark theme) since this is
 * exported as a downloadable document — invoices should print & photocopy
 * cleanly for the customer.
 */
export function InvoiceTemplate({
  invoice,
  variant,
}: {
  invoice: WaterInvoice;
  variant: "invoice" | "receipt";
}) {
  const items = invoice.water_invoice_items ?? [];

  return (
    <div className="w-[720px] bg-white text-[#0D151F] p-10 font-body" id="invoice-template">
      <div className="flex items-start justify-between pb-6 border-b-2 border-[#14493B]">
        <div className="flex items-center gap-3">
          <div className="h-14 w-14 relative">
            <Image src="/logo-icon.png" alt="Fwangsat Ventures" width={56} height={56} />
          </div>
          <div>
            <p className="font-display font-bold text-lg leading-tight">Fwangsat Ventures</p>
            <p className="text-[11px] text-[#555]">{SITE.address}</p>
            <p className="text-[11px] text-[#555]">{SITE.phone} · {SITE.email}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-bold text-2xl text-[#14493B] uppercase">
            {variant === "invoice" ? "Invoice" : "Receipt"}
          </p>
          <p className="text-[12px] text-[#555] mt-1">
            No. {variant === "invoice" ? invoice.invoice_no : invoice.receipt_no}
          </p>
          <p className="text-[12px] text-[#555]">
            Date: {formatDate(variant === "invoice" ? invoice.created_at : invoice.paid_at)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        <div>
          <p className="text-[10px] uppercase tracking-wide text-[#888] mb-1">Billed to</p>
          <p className="font-medium">{invoice.customer_name}</p>
          {invoice.customer_phone && <p className="text-[12px] text-[#555]">{invoice.customer_phone}</p>}
          {invoice.customer_address && <p className="text-[12px] text-[#555]">{invoice.customer_address}</p>}
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-wide text-[#888] mb-1">Status</p>
          <p className={`font-semibold ${invoice.status === "paid" ? "text-[#14493B]" : "text-[#B45309]"}`}>
            {invoice.status.toUpperCase()}
          </p>
        </div>
      </div>

      <table className="w-full mt-8 text-[13px]">
        <thead>
          <tr className="border-b border-[#ddd] text-left text-[#888] text-[11px] uppercase">
            <th className="py-2">Description</th>
            <th className="py-2 text-right">Qty</th>
            <th className="py-2 text-right">Unit price</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-[#f0f0f0]">
              <td className="py-2.5">{item.description}</td>
              <td className="py-2.5 text-right">{item.quantity}</td>
              <td className="py-2.5 text-right">{formatNaira(item.unit_price)}</td>
              <td className="py-2.5 text-right">{formatNaira(item.line_total)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <div className="w-64 flex flex-col gap-1.5">
          <div className="flex justify-between text-[13px]">
            <span className="text-[#888]">Subtotal</span>
            <span>{formatNaira(invoice.subtotal)}</span>
          </div>
          {invoice.discount > 0 && (
            <div className="flex justify-between text-[13px]">
              <span className="text-[#888]">Discount</span>
              <span>-{formatNaira(invoice.discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold border-t border-[#ddd] pt-2 mt-1">
            <span>Total</span>
            <span>{formatNaira(invoice.total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-[#eee]">
        <p className="text-[10px] uppercase tracking-wide text-[#888] mb-2">Payment details</p>
        <div className="grid grid-cols-3 gap-4 text-[12px]">
          <div>
            <p className="text-[#888]">Bank</p>
            <p className="font-medium">{BANK_DETAILS.bankName}</p>
          </div>
          <div>
            <p className="text-[#888]">Account number</p>
            <p className="font-medium font-mono">{BANK_DETAILS.accountNumber}</p>
          </div>
          <div>
            <p className="text-[#888]">Account name</p>
            <p className="font-medium">{BANK_DETAILS.accountName}</p>
          </div>
        </div>
      </div>

      <p className="text-[11px] text-[#999] mt-6 text-center">
        Thank you for choosing Swan Water — a Fwangsat Ventures product.
      </p>
    </div>
  );
}