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

export function Mosque({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 210" className={className} fill="currentColor" aria-hidden>
      {/* minarets */}
      {[30, 354].map((x) => (
        <g key={x}>
          <rect x={x} y="62" width="16" height="148" />
          <rect x={x - 4} y="96" width="24" height="5" />
          <rect x={x - 4} y="140" width="24" height="5" />
          <path d={`M${x - 3} 62 L${x + 8} 26 L${x + 19} 62 Z`} />
          <rect x={x + 7} y="14" width="2" height="12" />
        </g>
      ))}
      {/* side domes */}
      <path d="M78 150 Q78 112 105 102 Q132 112 132 150 Z" />
      <path d="M268 150 Q268 112 295 102 Q322 112 322 150 Z" />
      <rect x="104" y="90" width="2" height="12" />
      <rect x="294" y="90" width="2" height="12" />
      {/* main dome */}
      <path d="M134 150 Q132 72 200 48 Q268 72 266 150 Z" />
      <rect x="199" y="26" width="2" height="22" />
      <path d="M206 16 a9 9 0 1 0 0 14 a7 7 0 1 1 0 -14 Z" />
      {/* hall */}
      <rect x="60" y="150" width="280" height="60" />
      {/* doors and windows cut out with the background colour */}
      <g className="text-maroon-deep" fill="currentColor" opacity="0.55">
        <path d="M184 210 V182 Q184 166 200 160 Q216 166 216 182 V210 Z" />
        {[96, 132, 252, 288].map((x) => (
          <path key={x} d={`M${x} 196 V178 Q${x} 168 ${x + 8} 164 Q${x + 16} 168 ${x + 16} 178 V196 Z`} />
        ))}
      </g>
    </svg>
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

export function Lantern({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 110" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
      <line x1="20" y1="0" x2="20" y2="30" />
      <path d="M14 30 h12 l4 8 h-20 z" fill="currentColor" />
      <path d="M10 38 h20 l4 30 l-6 14 h-16 l-6 -14 z" />
      <path d="M20 38 v44 M12 52 h16 M11 66 h18" strokeOpacity="0.6" />
      <path d="M14 82 h12 l-6 10 z" fill="currentColor" />
      <circle cx="20" cy="56" r="4" fill="currentColor" fillOpacity="0.5" stroke="none" />
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

// Rose and blush petals drifting down, for the cover and the hero.
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
