import { forwardRef } from "react";
import type { InvoiceData } from "@/lib/invoice-types";
import { computeTotals, formatMoney } from "@/lib/invoice-types";
import { DigitalStamp } from "@/components/DigitalStamp";

type Props = { data: InvoiceData };

/**
 * Apple-inspired minimal invoice. Pure typography, generous whitespace,
 * hairline rules, monochrome. The opposite of the colorful Event template.
 */
export const MinimalTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { total, remaining } = computeTotals(data);
  const cur = data.currency || "f";

  return (
    <div
      ref={ref}
      className="bg-white text-black mx-auto"
      style={{
        width: "794px",
        minHeight: "1123px",
        fontFamily: '"Inter", -apple-system, sans-serif',
        padding: "80px 72px",
        letterSpacing: "-0.011em",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between pb-10" style={{ borderBottom: "1px solid #e5e5e5" }}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Facture</p>
          <h1 className="text-[42px] font-semibold mt-2 leading-none tracking-tight">
            {data.headerTitle}
          </h1>
          <p className="text-[13px] text-neutral-500 mt-2">{data.headerTagline}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">N°</p>
          <p className="text-[16px] font-medium mt-2 font-mono">{data.invoiceNumber}</p>
          {data.date && <p className="text-[13px] text-neutral-600 mt-1">{data.date}</p>}
        </div>
      </div>

      {/* Meta */}
      <div className="grid grid-cols-3 gap-8 py-8" style={{ borderBottom: "1px solid #e5e5e5" }}>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">De</p>
          <p className="text-[14px] font-medium mt-2">{data.headerTitle}</p>
          <p className="text-[13px] text-neutral-600 mt-0.5">{data.headerPhones}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Lieu</p>
          <p className="text-[14px] font-medium mt-2">{data.location || "—"}</p>
        </div>
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Objet</p>
          <p className="text-[14px] font-medium mt-2">{data.subject || "—"}</p>
        </div>
      </div>

      {/* Items table */}
      <div className="py-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500 mb-4">
          {data.descriptionTitle}
        </p>
        <div className="space-y-3">
          {data.items.map((it) => (
            <div
              key={it.id}
              className="flex items-baseline justify-between py-3"
              style={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <div className="flex-1">
                <p className="text-[14px]">{it.description}</p>
                {it.quantity > 1 && (
                  <p className="text-[12px] text-neutral-500 mt-0.5">
                    {it.quantity} × {formatMoney(it.unitPrice, cur)}
                  </p>
                )}
              </div>
              <p className="text-[14px] font-medium font-mono tabular-nums">
                {formatMoney(it.quantity * it.unitPrice, cur)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-[300px] space-y-2 text-[14px]">
          <div className="flex justify-between text-neutral-600">
            <span>Sous-total</span>
            <span className="font-mono tabular-nums">{formatMoney(total, cur)}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Transport</span>
            <span>{data.transport}</span>
          </div>
          <div className="flex justify-between text-neutral-600">
            <span>Avance</span>
            <span className="font-mono tabular-nums">−{formatMoney(data.advance, cur)}</span>
          </div>
          <div
            className="flex justify-between pt-3 mt-3 text-[18px] font-semibold"
            style={{ borderTop: "1px solid #000" }}
          >
            <span>Reste à payer</span>
            <span className="font-mono tabular-nums">{formatMoney(remaining, cur)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div className="mt-12 space-y-2">
        {data.cautionText && (
          <p className="text-[12px] text-neutral-500 leading-relaxed">{data.cautionText}</p>
        )}
        {data.footerNote && (
          <p className="text-[12px] text-neutral-500 leading-relaxed">{data.footerNote}</p>
        )}
      </div>

      {/* Signature + stamp */}
      <div className="mt-16 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-neutral-500">Signature</p>
          <div className="mt-2 h-[60px] w-[200px] flex items-end" style={{ borderBottom: "1px solid #000" }}>
            {data.signature && <img src={data.signature} alt="" style={{ height: 55 }} />}
          </div>
        </div>
        {data.stamp && <DigitalStamp config={data.stamp} size={110} />}
      </div>
    </div>
  );
});

MinimalTemplate.displayName = "MinimalTemplate";
