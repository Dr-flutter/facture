import { useMemo } from "react";
import type { StampConfig } from "@/lib/invoice-types";

type Props = { config: StampConfig; size?: number };

/**
 * Clean official circular ink-stamp SVG, inspired by real embassy / administrative stamps.
 * - Double outer ring
 * - Curved text on top arc (main text)
 * - Curved text on bottom arc (subtext) separated by bullet points
 * - Central emblem (stylised coat-of-arms style mark)
 * - Subtle ink imperfections only (no heavy distress)
 */
export function DigitalStamp({ config, size = 160 }: Props) {
  const { text, subtext, shape, color } = config;
  const isOval = shape === "oval";
  const w = size;
  const h = isOval ? Math.round(size * 0.78) : size;
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - 4;
  const ry = h / 2 - 4;

  const uid = useMemo(
    () => Math.random().toString(36).slice(2, 9),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [text, subtext, color, shape]
  );
  const arcTopId = `arc-top-${uid}`;
  const arcBottomId = `arc-bot-${uid}`;
  const grainId = `grain-${uid}`;

  // Slight rotation for realism
  const rotation = useMemo(() => {
    const seed = (text || "").length + (subtext || "").length;
    return -4 + ((seed * 17) % 7);
  }, [text, subtext]);

  const topFontSize = Math.max(9, size / 13);
  const bottomFontSize = Math.max(9, size / 14);

  // Arc radii — text sits just inside the inner ring
  const textRx = rx - 11;
  const textRy = ry - 11;
  const bottomTextRy = ry - 9;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      style={{
        transform: `rotate(${rotation}deg)`,
        mixBlendMode: "multiply",
      }}
    >
      <defs>
        {/* Very subtle grain to break up perfect digital edges */}
        <filter id={grainId} x="0%" y="0%" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="4" />
          <feColorMatrix
            values="0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 0 1
                    0 0 0 -3 1.6"
          />
        </filter>

        <path
          id={arcTopId}
          d={`M ${cx - textRx} ${cy} A ${textRx} ${textRy} 0 0 1 ${cx + textRx} ${cy}`}
          fill="none"
        />
        <path
          id={arcBottomId}
          d={`M ${cx - textRx} ${cy} A ${textRx} ${bottomTextRy} 0 0 0 ${cx + textRx} ${cy}`}
          fill="none"
        />
      </defs>

      <g opacity={0.92}>
        {/* Outer ring */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx}
          ry={ry}
          fill="none"
          stroke={color}
          strokeWidth={2.5}
        />
        {/* Inner ring (close, for the text band) */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={rx - 5}
          ry={ry - 5}
          fill="none"
          stroke={color}
          strokeWidth={1}
        />

        {/* Top curved text */}
        <text
          fill={color}
          fontFamily="'Times New Roman', Times, serif"
          fontSize={topFontSize}
          fontWeight="bold"
          letterSpacing="1.5"
        >
          <textPath href={`#${arcTopId}`} startOffset="50%" textAnchor="middle">
            {(text || "").toUpperCase()}
          </textPath>
        </text>

        {/* Bottom curved subtext with bullets */}
        {subtext && (
          <text
            fill={color}
            fontFamily="'Times New Roman', Times, serif"
            fontSize={bottomFontSize}
            fontWeight="bold"
            letterSpacing="2"
          >
            <textPath href={`#${arcBottomId}`} startOffset="50%" textAnchor="middle">
              {`•  ${(subtext || "").toUpperCase()}  •`}
            </textPath>
          </text>
        )}

        {/* Central emblem — stylised shield / star composition */}
        <g transform={`translate(${cx}, ${cy})`}>
          {/* shield outline */}
          <path
            d={`M ${-size * 0.11} ${-size * 0.1}
                L ${size * 0.11} ${-size * 0.1}
                L ${size * 0.11} ${size * 0.04}
                Q ${size * 0.11} ${size * 0.13} 0 ${size * 0.16}
                Q ${-size * 0.11} ${size * 0.13} ${-size * 0.11} ${size * 0.04}
                Z`}
            fill="none"
            stroke={color}
            strokeWidth={1.4}
          />
          {/* inner star */}
          <text
            x={0}
            y={size * 0.035}
            fill={color}
            fontFamily="'Times New Roman', Times, serif"
            fontSize={size * 0.13}
            textAnchor="middle"
            fontWeight="bold"
          >
            ★
          </text>
          {/* horizontal banner line */}
          <line
            x1={-size * 0.085}
            y1={size * 0.055}
            x2={size * 0.085}
            y2={size * 0.055}
            stroke={color}
            strokeWidth={0.8}
          />
        </g>

        {/* Side ornament dots on the text band (3 and 9 o'clock) */}
        <circle cx={cx - textRx - 2} cy={cy} r={1.5} fill={color} />
        <circle cx={cx + textRx + 2} cy={cy} r={1.5} fill={color} />

        {/* Very subtle ink grain overlay (lightens random pixels) */}
        <rect
          x={0}
          y={0}
          width={w}
          height={h}
          fill="white"
          filter={`url(#${grainId})`}
          opacity={0.35}
          style={{ mixBlendMode: "screen" as const }}
        />
      </g>
    </svg>
  );
}
