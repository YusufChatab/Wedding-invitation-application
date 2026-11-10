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

const P = {
  roofTop: "#2a0717",
  roofBottom: "#5b1636",
  wall: "#7a1e47",
  wallDark: "#5a1434",
  post: "#33091d",
  gold: "#d1a95e",
  goldLight: "#efd6a3",
  rose: "#ca9b9b",
  blush: "#ecdace",
  light: "#ffd9a0",
};

// Gold finial on a gonjong tip; it twinkles.
function Finial({ x, y, delay = 0 }: { x: number; y: number; delay?: number }) {
  return (
    <g className="twinkle" style={{ animationDelay: `${delay}s`, transformBox: "fill-box", transformOrigin: "center" }}>
      <path d={`M${x} ${y - 9} L${x + 2.2} ${y - 2} L${x} ${y + 1} L${x - 2.2} ${y - 2} Z`} fill={P.goldLight} />
      <circle cx={x} cy={y - 10} r="1.6" fill={P.goldLight} />
    </g>
  );
}

// A gonjong roof: curved saddles between sharp `tips` (left to right), with
// the eave running from `left` to `right` at height `eave`.
function gonjongRoof(tips: [number, number][], eave: number, left: number, right: number, sag: number) {
  let edge = `M${tips[0][0]} ${tips[0][1]}`;
  for (let i = 1; i < tips.length; i++) {
    const [x0] = tips[i - 1];
    const [x1, y1] = tips[i];
    const mid = (x0 + x1) / 2;
    edge += ` Q${x0 + (mid - x0) * 0.5} ${sag - 6} ${mid} ${sag} Q${mid + (x1 - mid) * 0.5} ${sag - 6} ${x1} ${y1}`;
  }
  const [lx, ly] = tips[0];
  const [rx, ry] = tips[tips.length - 1];
  const fill =
    edge +
    ` Q${rx - 8} ${(ry + eave) / 2 + 20} ${right} ${eave} L${left} ${eave} Q${lx + 8} ${(ly + eave) / 2 + 20} ${lx} ${ly} Z`;
  return { fill, edge };
}

// Small rice barn (rangkiang) on stilts that stands beside a Rumah Gadang.
function Rangkiang({ x, uid }: { x: number; uid: string }) {
  const roof = gonjongRoof([[x - 22, 118], [x + 22, 118]], 160, x - 16, x + 16, 148);
  return (
    <g>
      {[-10, 0, 10].map((dx) => (
        <rect key={dx} x={x + dx - 1.5} y="188" width="3" height="34" fill={P.post} />
      ))}
      <path d={`M${x - 15} 160 H${x + 15} L${x + 12} 190 H${x - 12} Z`} fill={`url(#${uid}-wall)`} />
      <rect x={x - 14} y="162" width="28" height="6" fill={`url(#${uid}-carve)`} />
      <path d={`M${x - 6} 186 V176 Q${x} 170 ${x + 6} 176 V186 Z`} fill={P.gold} opacity="0.8" />
      <path d={roof.fill} fill={`url(#${uid}-roof)`} />
      <path d={roof.edge} fill="none" stroke={P.gold} strokeWidth="1.2" />
      <Finial x={x - 22} y={118} delay={1.4} />
      <Finial x={x + 22} y={118} delay={2.2} />
    </g>
  );
}

// Minangkabau Rumah Gadang, drawn in colour: sweeping gonjong roof with gold
// trim and finials, carved songket-style panels, glowing windows, a front
// porch with its own gonjong, rice barns on either side and Mount Marapi
// behind, framed by flowers. `uid` keeps gradient ids unique per copy.
export function RumahGadang({ className = "", uid }: { className?: string; uid: string }) {
  const main = gonjongRoof([[62, 20], [124, 44], [200, 58], [276, 44], [338, 20]], 126, 92, 308, 100);
  const porch = gonjongRoof([[166, 104], [234, 104]], 156, 174, 226, 140);
  const windows = [104, 128, 152, 228, 252, 276];
  const flowers = [
    [14, 222, 4, P.rose], [46, 228, 3.5, P.blush], [86, 224, 4, P.goldLight], [124, 230, 3.5, P.rose],
    [276, 230, 3.5, P.blush], [314, 224, 4, P.rose], [354, 228, 3.5, P.goldLight], [386, 222, 4, P.blush],
  ] as const;
  return (
    <svg viewBox="0 0 400 240" className={className} aria-hidden>
      <defs>
        <linearGradient id={`${uid}-roof`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.roofTop} />
          <stop offset="1" stopColor={P.roofBottom} />
        </linearGradient>
        <linearGradient id={`${uid}-wall`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.wall} />
          <stop offset="1" stopColor={P.wallDark} />
        </linearGradient>
        <linearGradient id={`${uid}-mountain`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={P.rose} stopOpacity="0.35" />
          <stop offset="1" stopColor={P.rose} stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${uid}-window`}>
          <stop offset="0" stopColor={P.light} />
          <stop offset="1" stopColor={P.gold} />
        </radialGradient>
        {/* carved band: gold with maroon diamonds, like songket */}
        <pattern id={`${uid}-carve`} width="10" height="10" patternUnits="userSpaceOnUse">
          <rect width="10" height="10" fill={P.gold} />
          <path d="M5 1 L9 5 L5 9 L1 5 Z" fill={P.wallDark} />
          <circle cx="5" cy="5" r="1.2" fill={P.goldLight} />
        </pattern>
        <pattern id={`${uid}-flowerband`} width="12" height="8" patternUnits="userSpaceOnUse">
          <rect width="12" height="8" fill={P.rose} />
          <circle cx="6" cy="4" r="2.2" fill={P.wallDark} />
          <circle cx="0" cy="4" r="1" fill={P.goldLight} />
          <circle cx="12" cy="4" r="1" fill={P.goldLight} />
        </pattern>
        <clipPath id={`${uid}-roofclip`}>
          <path d={main.fill} />
        </clipPath>
      </defs>

      {/* Mount Marapi behind */}
      <path
        d="M0 150 Q70 120 120 70 Q150 44 176 46 Q200 40 222 50 Q260 70 300 108 Q350 140 400 146 V240 H0 Z"
        fill={`url(#${uid}-mountain)`}
      />

      <Rangkiang x={36} uid={uid} />
      <Rangkiang x={364} uid={uid} />

      {/* stilts with stone footings */}
      {[100, 124, 148, 172, 228, 252, 276, 300].map((x) => (
        <g key={x}>
          <rect x={x - 2.5} y="176" width="5" height="44" fill={P.post} />
          <rect x={x - 5} y="218" width="10" height="4" rx="1" fill={P.rose} opacity="0.8" />
        </g>
      ))}
      <rect x="92" y="196" width="216" height="3" fill={P.post} />

      {/* walls lean outwards towards the roof, with carved bands and windows */}
      <path d="M86 126 H314 L302 180 H98 Z" fill={`url(#${uid}-wall)`} />
      <path d="M87 126 H313 L311 136 H89 Z" fill={`url(#${uid}-carve)`} />
      <path d="M99 172 H301 L300 180 H100 Z" fill={`url(#${uid}-flowerband)`} />
      {windows.map((x, i) => (
        <g key={x}>
          <rect x={x - 1} y="141" width="20" height="26" rx="1.5" fill={P.gold} />
          <rect
            className="window-glow"
            style={{ animationDelay: `${i * 0.7}s` }}
            x={x + 2}
            y="144"
            width="14"
            height="20"
            fill={`url(#${uid}-window)`}
          />
          <path d={`M${x + 9} 144 V164 M${x + 2} 154 H${x + 16}`} stroke={P.wallDark} strokeWidth="1" />
        </g>
      ))}

      {/* main roof: gradient, thatch lines, gold trim and finials */}
      <path d={main.fill} fill={`url(#${uid}-roof)`} />
      <g clipPath={`url(#${uid}-roofclip)`} stroke={P.gold} strokeOpacity="0.18" strokeWidth="1" fill="none">
        {[70, 82, 94, 106, 118].map((y) => (
          <path key={y} d={`M40 ${y} Q200 ${y + 8} 360 ${y}`} />
        ))}
      </g>
      <path d={main.edge} fill="none" stroke={P.gold} strokeWidth="1.6" />
      <path d="M92 126 H308" stroke={P.gold} strokeWidth="2" />
      {[
        [62, 20, 0],
        [124, 44, 0.8],
        [200, 58, 1.6],
        [276, 44, 2.4],
        [338, 20, 0.4],
      ].map(([x, y, d]) => (
        <Finial key={x} x={x} y={y} delay={d} />
      ))}

      {/* front porch with its own gonjong, glowing door and stairs */}
      <path d="M176 156 H224 V196 H176 Z" fill={`url(#${uid}-wall)`} />
      <rect x="176" y="156" width="48" height="6" fill={`url(#${uid}-carve)`} />
      <path className="window-glow" d="M190 196 V176 Q200 166 210 176 V196 Z" fill={`url(#${uid}-window)`} />
      <path d="M190 196 V176 Q200 166 210 176 V196" fill="none" stroke={P.gold} strokeWidth="1.5" />
      <path d={porch.fill} fill={`url(#${uid}-roof)`} />
      <path d={porch.edge} fill="none" stroke={P.gold} strokeWidth="1.4" />
      <path d="M174 156 H226" stroke={P.gold} strokeWidth="1.6" />
      <Finial x={166} y={104} delay={1.1} />
      <Finial x={234} y={104} delay={1.9} />
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={186 - i * 3} y={198 + i * 6} width={28 + i * 6} height="5" rx="1" fill={P.rose} opacity={0.95 - i * 0.1} />
      ))}

      {/* ground, bushes and flowers in front */}
      <path
        d="M0 240 V222 Q30 210 60 220 Q90 208 120 222 Q150 214 170 224 L230 224 Q250 214 280 222 Q310 208 340 220 Q370 210 400 222 V240 Z"
        fill={P.wallDark}
      />
      {flowers.map(([x, y, r, c]) => (
        <g key={x} style={{ color: c }}>
          <Bloom x={x} y={y} r={r} />
        </g>
      ))}
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
