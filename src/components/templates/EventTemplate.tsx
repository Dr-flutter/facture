import { forwardRef } from "react";
import type { InvoiceData } from "@/lib/invoice-types";
import { computeTotals, formatMoney } from "@/lib/invoice-types";
import { DigitalStamp } from "@/components/DigitalStamp";

type Props = { data: InvoiceData };

/**
 * Pixel-faithful reproduction of the colourful event-style reference invoice.
 * Fixed A4 portrait coordinates (794 x 1123 @ 96dpi) so PDF export is consistent.
 * Scaled by parent container via CSS transform.
 */
export const EventTemplate = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const { total, remaining } = computeTotals(data);
  const cur = data.currency || "f";

  return (
    <div
      ref={ref}
      className="bg-white text-black relative overflow-hidden mx-auto"
      style={{
        width: "794px",
        minHeight: "1123px",
        fontFamily: '"JetBrains Mono", "Courier New", monospace',
      }}
    >
      {/* === HEADER bandeau dégradé rose/violet === */}
      <div
        className="relative px-10 pt-10 pb-8"
        style={{
          background:
            "linear-gradient(135deg, #c43a8a 0%, #a82d7b 45%, #7b2068 100%)",
          color: "white",
        }}
      >
        {/* Decorative pattern overlay */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent 0 6px, rgba(255,255,255,0.08) 6px 7px)",
          }}
        />
        <h1
          className="font-bold uppercase tracking-tight leading-[0.95] relative z-10"
          style={{ fontSize: "44px", letterSpacing: "0.02em" }}
        >
          {data.headerTitle || "VOTRE ENTREPRISE"}
        </h1>
        <h2
          className="font-bold leading-[0.95] mt-1 relative z-10"
          style={{ fontSize: "42px" }}
        >
          {data.headerPhones || "6 XX XX XX XX"}
        </h2>

        {/* Decorative arrows top-right */}
        <div className="absolute top-10 right-10 text-white/90 text-3xl leading-none">
          {">>>"}
        </div>
      </div>

      {/* === Pink banner with arrows + tagline === */}
      <div
        className="px-10 py-3 flex items-center gap-3"
        style={{ background: "#e8579e", color: "white" }}
      >
        <span className="text-xl font-bold leading-none">{">>>"}</span>
        <span
          className="uppercase font-bold tracking-wider"
          style={{ fontSize: "15px", letterSpacing: "0.12em" }}
        >
          {data.headerTagline}
        </span>
      </div>

      {/* === BODY === */}
      <div className="px-10 pt-8 pb-10 relative">
        {/* Subject */}
        {data.subject && (
          <p className="text-[18px] mb-5">{data.subject}</p>
        )}

        {/* Date/Lieu pink highlight box */}
        {(data.date || data.location) && (
          <div
            className="inline-block px-5 py-4 mb-6"
            style={{ background: "#f593c4" }}
          >
            {data.date && (
              <div className="font-bold uppercase text-[18px] leading-tight">
                DATE:{data.date}
              </div>
            )}
            {data.location && (
              <div className="font-bold uppercase text-[18px] leading-tight mt-1">
                LIEU: {data.location}
              </div>
            )}
          </div>
        )}

        {/* Two-column layout: items on left, totals on right */}
        <div className="flex gap-8">
          {/* Description / items */}
          <div className="flex-1 min-w-0">
            <div
              className="font-sans italic text-[13px] mb-2"
              style={{ color: "#2c6fb8" }}
            >
              Description
            </div>
            <div
              className="pl-3 font-sans"
              style={{ borderLeft: "2px solid #2c6fb8" }}
            >
              <div className="text-[13px] font-medium mb-1">
                {data.descriptionTitle}
              </div>
              {data.items.map((it) => (
                <div key={it.id} className="text-[12.5px] leading-tight">
                  -{it.description}
                  {it.quantity > 1 || it.unitPrice > 0 ? (
                    <span className="text-gray-600">
                      {it.quantity > 1 ? ` (×${it.quantity})` : ""}
                      {it.unitPrice > 0
                        ? ` — ${formatMoney(it.unitPrice * it.quantity, cur)}`
                        : ""}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>

          {/* Right column: totals */}
          <div className="w-[320px] flex-shrink-0 font-sans mt-8">
            {/* Total amount box */}
            <div
              className="border-2 rounded px-4 py-3 flex items-center justify-between"
              style={{ borderColor: "#2c6fb8" }}
            >
              <span className="font-semibold text-[15px]" style={{ color: "#2c6fb8" }}>
                Total Amount
              </span>
              <span className="font-medium text-[15px]">
                {formatMoney(total, cur)}
              </span>
            </div>

            {/* Transport */}
            <div className="mt-4 text-[14px]" style={{ color: "#2c6fb8" }}>
              Transport : <span className="text-black">{data.transport}</span>
            </div>

            {/* Caution */}
            <p className="mt-3 text-[13px] leading-snug">{data.cautionText}</p>

            {/* Avance / reste */}
            <div className="mt-4 flex gap-6 text-[14px]" style={{ color: "#2c6fb8" }}>
              <span>
                Avance: <span className="text-black">{formatMoney(data.advance, cur)}</span>
              </span>
              <span>
                reste:<span className="text-black">{formatMoney(remaining, cur)}</span>
              </span>
            </div>

            {/* Footer note */}
            <p className="mt-3 text-[13px] leading-snug">{data.footerNote}</p>

            {/* Bottom inline signature */}
            <p className="mt-4 text-[12px]" style={{ color: "#2c6fb8" }}>
              {(data.headerTitle || "").split(" ").slice(0, 3).join(" ").toLowerCase()}{" "}
              {data.headerPhones}
            </p>
          </div>
        </div>

        {/* Signature + stamp overlay area */}
        <div className="absolute right-10 bottom-24 flex items-end gap-6 pointer-events-none">
          {data.signature && (
            <img
              src={data.signature}
              alt="signature"
              style={{ height: 70, opacity: 0.9 }}
            />
          )}
          {data.stamp && <DigitalStamp config={data.stamp} size={120} />}
        </div>
      </div>

      {/* === Bottom pink bandeau === */}
      <div
        className="absolute bottom-0 left-0 right-0 h-5"
        style={{ background: "#e8579e" }}
      />
    </div>
  );
});

EventTemplate.displayName = "EventTemplate";
