export function Divider({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 text-gold ${className}`} aria-hidden>
      <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold" />
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1l2.6 6.4L21 10l-6.4 2.6L12 19l-2.6-6.4L3 10l6.4-2.6z" />
      </svg>
      <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold" />
    </div>
  );
}

// Fixed positions so server and client render the same markup.
const starPositions = [
  [8, 18, 0], [22, 35, 1.2], [15, 62, 2.1], [32, 12, 0.6], [70, 15, 1.8], [85, 30, 0.3],
  [78, 55, 2.4], [90, 70, 1], [55, 8, 2.8], [45, 40, 1.5], [62, 70, 0.9], [5, 80, 2],
] as const;

export function Stars({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden>
      {starPositions.map(([left, top, delay], i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          className="twinkle absolute text-gold-light"
          style={{ left: `${left}%`, top: `${top}%`, width: 8 + (i % 3) * 4, animationDelay: `${delay}s` }}
          fill="currentColor"
        >
          <path d="M12 1l2.6 8.4L23 12l-8.4 2.6L12 23l-2.6-8.4L1 12l8.4-2.6z" />
        </svg>
      ))}
    </div>
  );
}

// Five round petals around a centre, used by the vine and the garden.
function Bloom({ x, y, r, petal = "", centre = "text-gold" }: { x: number; y: number; r: number; petal?: string; centre?: string }) {
  return (
    <g className={petal}>
      {[0, 72, 144, 216, 288].map((deg) => {
        const a = ((deg - 90) * Math.PI) / 180;
        return <circle key={deg} cx={+(x + Math.cos(a) * r).toFixed(2)} cy={+(y + Math.sin(a) * r).toFixed(2)} r={r * 0.75} fill="currentColor" />;
      })}
      <circle cx={x} cy={y} r={r * 0.55} fill="currentColor" className={centre} />
    </g>
  );
}

const leaf = (x: number, y: number, dir: 1 | -1) =>
  `M${x} ${y} q${10 * dir} -8 ${16 * dir} 0 q${-6 * dir} 8 ${-16 * dir} 0 Z`;

// A flowering vine hanging from the top edge, with leaves and blossoms.
export function FlowerVine({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 44 150" className={className} aria-hidden>
      <path d="M22 0 C30 20 14 36 22 56 C30 76 14 92 22 112" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <g fill="currentColor" fillOpacity="0.7">
        {([[24, 14, 1], [19, 34, -1], [25, 62, 1], [19, 86, -1], [24, 100, 1]] as const).map(([x, y, d]) => (
          <path key={y} d={leaf(x, y, d)} />
        ))}
      </g>
      <Bloom x={17} y={46} r={4} petal="text-rose" />
      <Bloom x={27} y={76} r={4} petal="text-blush" />
      <Bloom x={22} y={122} r={7} petal="text-rose" centre="text-gold-light" />
      <path d="M22 132 v8" stroke="currentColor" strokeWidth="1.2" />
      <ellipse cx="22" cy="144" rx="3" ry="5" fill="currentColor" className="text-blush" />
    </svg>
  );
}

// A garden at the edge of a forest: round trees and pines behind, rolling
// bushes in front, and flowers on tall stems.
export function Garden({ className = "" }: { className?: string }) {
  const flowers = [
    [28, 138, 5, "text-rose"], [70, 128, 4, "text-blush"], [118, 136, 5, "text-gold-light"], [162, 130, 4, "text-rose"],
    [240, 132, 4, "text-blush"], [284, 126, 5, "text-rose"], [330, 134, 4, "text-gold-light"], [374, 128, 5, "text-blush"],
  ] as const;
  return (
    <svg viewBox="0 0 400 200" className={className} fill="currentColor" aria-hidden>
      {/* far forest */}
      <g opacity="0.55">
        <path d="M118 150 L134 70 L150 150 Z M110 120 L134 40 L158 120 Z M116 90 L134 20 L152 90 Z" />
        <path d="M268 150 L284 76 L300 150 Z M260 122 L284 46 L308 122 Z M266 94 L284 26 L302 94 Z" />
        <circle cx="30" cy="112" r="24" />
        <circle cx="372" cy="108" r="26" />
      </g>
      {/* trees */}
      <rect x="57" y="100" width="7" height="100" />
      <circle cx="60" cy="82" r="26" />
      <circle cx="40" cy="100" r="19" />
      <circle cx="80" cy="100" r="19" />
      <rect x="196" y="90" width="9" height="110" />
      <circle cx="200" cy="58" r="36" />
      <circle cx="170" cy="84" r="25" />
      <circle cx="230" cy="84" r="25" />
      <circle cx="200" cy="92" r="26" />
      <rect x="336" y="104" width="7" height="96" />
      <circle cx="340" cy="86" r="24" />
      <circle cx="322" cy="102" r="17" />
      <circle cx="358" cy="102" r="17" />
      {/* bushes */}
      <path d="M0 200 V158 Q20 138 46 150 Q70 128 100 148 Q126 134 150 152 Q176 138 200 150 Q226 136 252 152 Q282 130 306 150 Q332 134 356 150 Q382 138 400 154 V200 Z" />
      {/* flower stems and leaves */}
      <g stroke="currentColor" strokeWidth="1.5" fill="none">
        {flowers.map(([x, y]) => (
          <path key={x} d={`M${x} ${y} Q${x - 4} ${y + 14} ${x} ${y + 26}`} />
        ))}
      </g>
      {flowers.map(([x, y, r, tone]) => (
        <Bloom key={x} x={x} y={y} r={r} petal={tone} />
      ))}
      {/* grass */}
      <path d="M0 200 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 l6 -16 l4 16 l6 -12 l4 12 l6 -18 l4 18 l6 -10 l4 10 Z" />
    </svg>
  );
}

// Strip of songket weave: gold pucuak rabuang (bamboo shoot) triangles with a
// light sweeping across, used to separate sections.
export function SongketBand({ className = "" }: { className?: string }) {
  return <div className={`songket-band ${className}`} aria-hidden />;
}

// Kaluak paku (fern curl), the classic Minang wood-carving motif, for corners.
// Draws itself in when it scrolls into view.
export function FernCorner({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={`reveal draw pointer-events-none ${className}`} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden>
      <path pathLength="1" d="M2 2 C50 4 92 22 96 58 C99 82 82 94 68 90 C54 86 54 66 68 64 C78 63 82 74 74 78" />
      <path pathLength="1" d="M2 2 C4 40 18 70 46 86 C60 94 70 108 60 116" />
      <path pathLength="1" d="M30 10 C40 22 38 34 28 36 C20 37 20 28 27 28" />
      <path pathLength="1" d="M10 30 C22 40 34 38 36 28" />
      <path pathLength="1" d="M58 22 C62 36 56 46 48 44" />
    </svg>
  );
}

// Fixed petal positions so server and client render the same markup.
const petalPositions = [
  [6, 0, 9], [18, 3.5, 11], [29, 1.2, 10], [41, 6, 12], [52, 2.4, 9], [63, 7.5, 11],
  [74, 0.8, 10], [85, 4.6, 12], [94, 2, 9], [12, 8.5, 13], [47, 9.5, 11], [80, 10.5, 12],
] as const;

// Rose and blush petals drifting down, for the cover, the hero and the closing.
export function Petals({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {petalPositions.map(([left, delay, duration], i) => (
        <span
          key={i}
          className={`petal ${i % 3 === 0 ? "bg-blush" : i % 3 === 1 ? "bg-rose" : "bg-gold-light"}`}
          style={{ left: `${left}%`, animationDelay: `${delay}s`, animationDuration: `${duration}s`, scale: `${0.7 + (i % 4) * 0.15}` }}
        />
      ))}
    </div>
  );
}
