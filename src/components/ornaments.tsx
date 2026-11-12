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

// --- Gold line-art side decorations (magnolia branch and peacock) ---------
// Every shape is a path with pathLength=1 so it can draw itself in: pass
// "draw-in" to draw on load, or "reveal draw" to draw when scrolled into view.

const circle = (cx: number, cy: number, r: number) =>
  `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0`;

// Pointed leaf with a midrib, from (x, y) towards `angle` degrees.
function LineLeaf({ x, y, angle, len, w = len * 0.32 }: { x: number; y: number; angle: number; len: number; w?: number }) {
  return (
    <g transform={`rotate(${angle} ${x} ${y})`}>
      <path pathLength="1" d={`M${x} ${y} Q${x + len * 0.45} ${y - w} ${x + len} ${y} Q${x + len * 0.45} ${y + w} ${x} ${y} Z`} />
      <path pathLength="1" d={`M${x + 2} ${y} L${x + len * 0.85} ${y}`} strokeOpacity="0.7" />
    </g>
  );
}

// Jasmine (melati), the bridal flower of Minang and Indonesian weddings:
// five pointed petals around a small centre.
function Jasmine({ x, y, r, turn = 0 }: { x: number; y: number; r: number; turn?: number }) {
  return (
    <g>
      {[0, 72, 144, 216, 288].map((deg) => (
        <g key={deg} transform={`rotate(${deg + turn} ${x} ${y})`}>
          <path pathLength="1" d={`M${x} ${y - r * 0.25} Q${x + r * 0.45} ${y - r * 0.7} ${x} ${y - r} Q${x - r * 0.45} ${y - r * 0.7} ${x} ${y - r * 0.25} Z`} />
        </g>
      ))}
      <path pathLength="1" d={circle(x, y, r * 0.18)} />
    </g>
  );
}

// Closed jasmine bud on a short stalk.
const bud = (x: number, y: number, dx: number, dy: number) =>
  `M${x} ${y} L${x + dx * 0.5} ${y + dy * 0.5} M${x + dx * 0.5} ${y + dy * 0.5} C${x + dx * 0.5 - 4} ${y + dy * 0.8} ${x + dx - 3} ${y + dy} ${x + dx} ${y + dy} C${x + dx + 2} ${y + dy - 4} ${x + dx * 0.5 + 4} ${y + dy * 0.6} ${x + dx * 0.5} ${y + dy * 0.5} Z`;

// An open rose drawn as a loose spiral with layered outer petals.
function Rose({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path pathLength="1" d="M0 -2 C4 -4 7 0 4 4 C1 7 -6 5 -6 -1 C-6 -8 3 -12 9 -7 C15 -1 11 9 2 11" />
      <path pathLength="1" d="M-10 -4 C-12 -14 -2 -20 8 -17 C15 -15 19 -9 18 -2" />
      <path pathLength="1" d="M18 -2 C21 8 14 17 4 18 C-6 19 -14 12 -13 2" />
      <path pathLength="1" d="M-13 2 C-20 -2 -22 -12 -16 -18 C-12 -22 -4 -23 2 -21" />
      <path pathLength="1" d="M-14 8 C-20 16 -12 26 0 25 C12 25 22 18 24 6 C25 0 23 -6 20 -10" />
    </g>
  );
}

// A spray of roses, jasmine, buds and leaves reaching in from the top-right
// corner. Turn it 180° for the opposite corner.
export function FloralSpray({ className = "" }: { className?: string }) {
  const leaves: [number, number, number, number][] = [
    [182, 8, 120, 34], [170, 11, 214, 30], [132, 30, 100, 36], [122, 38, 206, 30],
    [92, 64, 140, 32], [86, 74, 40, 26], [76, 100, 160, 30], [150, 52, 30, 26], [148, 66, 150, 24],
    [62, 42, 250, 22], [78, 46, 110, 22],
  ];
  return (
    <svg viewBox="0 0 200 200" className={`pointer-events-none ${className}`} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {/* stems */}
      <path pathLength="1" d="M204 4 C162 10 124 30 100 58 C84 78 76 102 72 132" strokeWidth="1.8" />
      <path pathLength="1" d="M156 14 C146 36 142 58 144 82" />
      <path pathLength="1" d="M112 44 C94 46 72 44 46 34" />
      <path pathLength="1" d="M86 76 C70 84 56 84 40 80" />
      {leaves.map(([x, y, a, l]) => (
        <LineLeaf key={`${x}-${y}`} x={x} y={y} angle={a} len={l} />
      ))}
      <Rose x={144} y={102} />
      <Rose x={70} y={150} s={0.7} />
      <Jasmine x={42} y={32} r={13} />
      <Jasmine x={36} y={80} r={11} turn={20} />
      <Jasmine x={110} y={74} r={9} turn={36} />
      <Jasmine x={176} y={34} r={8} turn={10} />
      <path pathLength="1" d={`${bud(46, 34, -16, 12)} ${bud(144, 82, 14, 4)} ${bud(72, 132, -16, 6)} ${bud(156, 14, -8, 18)}`} />
      {/* scattered dots, like falling pollen */}
      <path pathLength="1" d={`${circle(20, 56, 1.4)} ${circle(58, 112, 1.4)} ${circle(176, 70, 1.4)} ${circle(120, 120, 1.2)} ${circle(98, 150, 1.2)}`} />
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
