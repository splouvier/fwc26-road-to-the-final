"use client";

import { useMemo } from "react";

/* Deterministic per-venue skyline: same city always renders the same silhouette,
   no image assets. Purely decorative — sits subtly behind the hero. */
function hashStr(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function mulberry32(a: number) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const W = 800;
const H = 120;

export default function VenueSilhouette({
  venue,
  accentA,
  accentB,
}: {
  venue?: string | null;
  accentA: string;
  accentB: string;
}) {
  const { path, lights } = useMemo(() => {
    if (!venue) return { path: "", lights: [] as { x: number; y: number }[] };
    const rnd = mulberry32(hashStr(venue));
    let d = `M0,${H} `;
    let x = 0;
    while (x < W) {
      const w = 16 + rnd() * 46;
      const h = 22 + rnd() * 82;
      const top = H - h;
      if (rnd() < 0.22 && h > 60) {
        // building with a thin spire/antenna
        const cx = x + w / 2;
        d += `L${x},${H} L${x},${top} L${cx - 1.2},${top} L${cx - 1.2},${top - 14} L${cx + 1.2},${top - 14} L${cx + 1.2},${top} L${x + w},${top} L${x + w},${H} `;
      } else {
        d += `L${x},${H} L${x},${top} L${x + w},${top} L${x + w},${H} `;
      }
      x += w + 2 + rnd() * 7;
    }
    d += `L${W},${H} Z`;
    // a couple of stadium floodlight poles
    const lights = [
      { x: 110 + rnd() * 130, y: 12 + rnd() * 8 },
      { x: 520 + rnd() * 170, y: 16 + rnd() * 10 },
    ];
    return { path: d, lights };
  }, [venue]);

  if (!path) return null;
  const id = `vs${hashStr(venue ?? "")}`;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[58%] overflow-hidden rounded-b-2xl"
      aria-hidden
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="absolute bottom-0 left-0 h-full w-full"
      >
        <defs>
          <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={accentA} />
            <stop offset="100%" stopColor={accentB} />
          </linearGradient>
          <linearGradient id={`${id}-fade`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0.08" />
            <stop offset="35%" stopColor="#fff" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#fff" stopOpacity="1" />
          </linearGradient>
          <mask id={`${id}-mask`}>
            <rect x="0" y="0" width={W} height={H} fill={`url(#${id}-fade)`} />
          </mask>
          <filter id={`${id}-glow`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.4" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <g mask={`url(#${id}-mask)`}>
          <path d={path} fill={`url(#${id}-fill)`} opacity="0.26" />
          {/* glowing rooflines give the skyline its shape */}
          <path d={path} fill="none" stroke={`url(#${id}-fill)`} strokeWidth="1.2" opacity="0.9" />
        </g>
        {/* floodlights sit above the fade so their tips stay visible */}
        {lights.map((l, i) => (
          <g key={i}>
            <line
              x1={l.x}
              y1={H}
              x2={l.x}
              y2={l.y}
              stroke={`url(#${id}-fill)`}
              strokeWidth="1.2"
              opacity="0.4"
            />
            <circle cx={l.x} cy={l.y} r="2.2" fill={accentB} opacity="0.95" filter={`url(#${id}-glow)`} />
          </g>
        ))}
      </svg>
    </div>
  );
}
