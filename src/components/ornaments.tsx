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

// Minangkabau Rumah Gadang: a long house on stilts under a roof of curved
// gonjong horns, with a carved (ukiran) band and windows along the wall.
export function RumahGadang({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 200" className={className} fill="currentColor" aria-hidden>
      {/* roof with five gonjong peaks */}
      <path d="M35 6 Q60 70 82 78 Q102 72 112 26 Q120 78 152 86 Q190 82 200 38 Q210 82 248 86 Q280 78 288 26 Q298 72 318 78 Q340 70 365 6 Q354 92 336 118 L64 118 Q46 92 35 6 Z" />
      {/* finials on the horn tips */}
      {[
        [35, 6],
        [112, 26],
        [200, 38],
        [288, 26],
        [365, 6],
      ].map(([x, y]) => (
        <circle key={x} cx={x} cy={y - 3} r="2.5" />
      ))}
      {/* walls lean outwards towards the roof */}
      <path d="M74 118 H326 L313 168 H87 Z" />
      {/* stilts and ground line */}
      {[96, 132, 168, 232, 268, 304].map((x) => (
        <rect key={x} x={x - 3} y="166" width="6" height="32" />
      ))}
      <rect x="40" y="196" width="320" height="4" />
      {/* stairs to the entrance */}
      <path d="M184 168 H216 L222 198 H178 Z" />
      {/* lighter details: roof thatch lines, carved band, windows */}
      <g className="text-gold" opacity="0.35">
        <path d="M70 108 H330 M80 98 H320" stroke="currentColor" strokeWidth="1.2" fill="none" />
        <path
          d="M80 126 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6 l6 -6 l6 6"
          stroke="currentColor"
          strokeWidth="1.2"
          fill="none"
        />
        {[104, 136, 168, 216, 248, 280].map((x) => (
          <rect key={x} x={x} y="140" width="16" height="18" rx="1" />
        ))}
        <path d="M190 168 V148 Q200 138 210 148 V168 Z" />
      </g>
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
