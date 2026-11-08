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
      <g className="text-emerald-deep" fill="currentColor" opacity="0.55">
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
