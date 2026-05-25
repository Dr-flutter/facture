import { forwardRef } from "react";
import type { InvoiceData } from "@/lib/invoice-types";
import { computeTotals, formatMoney } from "@/lib/invoice-types";
import { DigitalStamp } from "@/components/DigitalStamp";

type Props = { data: InvoiceData };

/**
 * Vercel-inspired dark monochrome invoice. Bold, technical, premium.
 */
export const MonoTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { total, remaining } = computeTotals(data);
  const cur = data.currency || "f";

  return (
    <div
      ref={ref}
      className="mx-auto"
      style={{
        width: "794px",
        minHeight: "1123px",
        fontFamily: '"Inter", -apple-system, sans-serif',
        background: "#0a0a0a",
        color: "#fafafa",
        letterSpacing: "-0.011em",
      }}
    >
      {/* Header bar */}
      <div
        className="px-16 py-10 flex items-end justify-between"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
      >
        <div>
          <div className="w-10 h-10 rounded-lg bg-white text-black flex items-center justify-center font-bold mb-4">
            F
          </div>
          <h1 className="text-[36px] font-semibold leading-none tracking-tight">
            {data.headerTitle}
          </h1>
          <p className="text-[12px] text-neutral-400 mt-2 uppercase tracking-wider">
            {data.headerTagline}
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500">Invoice</p>
          <p className="text-[14px] font-mono mt-1">{data.invoiceNumber}</p>
        </div>
      </div>

      {/* Meta grid */}
      <div className="px-16 py-8 grid grid-cols-4 gap-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        {[
          ["Date", data.date || "—"],
          ["Lieu", data.location || "—"],
          ["Objet", data.subject || "—"],
          ["Contact", data.headerPhones],
        ].map(([k, v]) => (
          <div key={k}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500">{k}</p>
            <p className="text-[13px] mt-1.5">{v}</p>
          </div>
        ))}
      </div>

      {/* Items */}
      <div className="px-16 py-8">
        <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-500 mb-4">
          {data.descriptionTitle}
        </p>
        <div>
          {data.items.map((it) => (
            <div
              key={it.id}
              className="flex items-baseline justify-between py-3.5"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
            >
              <div className="flex-1">
                <p className="text-[14px]">{it.description}</p>
                {it.quantity > 1 && (
                  <p className="text-[11px] text-neutral-500 mt-1 font-mono">
                    {it.quantity} × {formatMoney(it.unitPrice, cur)}
                  </p>
                )}
              </div>
              <p className="text-[14px] font-mono tabular-nums">
                {formatMoney(it.quantity * it.unitPrice, cur)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Totals */}
      <div className="px-16 pb-12">
        <div className="ml-auto w-[320px]">
          <div className="space-y-2 text-[13px] text-neutral-400">
            <div className="flex justify-between">
              <span>Sous-total</span>
              <span className="font-mono tabular-nums text-white">{formatMoney(total, cur)}</span>
            </div>
            <div className="flex justify-between">
              <span>Avance</span>
              <span className="font-mono tabular-nums text-white">−{formatMoney(data.advance, cur)}</span>
            </div>
          </div>
          <div
            className="mt-4 pt-4 flex justify-between items-baseline"
            style={{ borderTop: "1px solid rgba(255,255,255,0.2)" }}
          >
            <span className="text-[11px] uppercase tracking-[0.2em] text-neutral-400">Reste</span>
            <span className="text-[24px] font-semibold font-mono tabular-nums">
              {formatMoney(remaining, cur)}
            </span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-16 py-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <div className="flex items-end justify-between">
          <div className="max-w-md">
            {data.cautionText && (
              <p className="text-[11px] text-neutral-500 leading-relaxed">{data.cautionText}</p>
            )}
            {data.footerNote && (
              <p className="text-[11px] text-neutral-500 leading-relaxed mt-2">{data.footerNote}</p>
            )}
          </div>
          <div className="flex items-end gap-6">
            {data.signature && (
              <img src={data.signature} alt="" style={{ height: 55, filter: "invert(1)", opacity: 0.9 }} />
            )}
            {data.stamp && <DigitalStamp config={data.stamp} size={100} />}
          </div>
        </div>
      </div>
    </div>
  );
});

MonoTemplate.displayName = "MonoTemplate";
