// The invitation sections, shared by the personal guest pages and the general home page.
import { wedding } from "@/config/wedding";
import type { Wish } from "@/lib/data";
import { Countdown } from "./countdown";
import { Divider, FernCorner, FlowerVine, Petals, RumahGadang, SongketBand, Stars } from "./ornaments";

export const couple = `${wedding.groom.shortName} & ${wedding.bride.shortName}`;

export function Section({
  id,
  title,
  subtitle,
  dark = false,
  wide = false,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  dark?: boolean;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className={`relative scroll-mt-4 overflow-hidden px-5 py-16 text-center sm:px-8 sm:py-24 ${dark ? "islamic-pattern bg-maroon-deep text-cream" : "islamic-pattern-light bg-cream text-ink"}`}
    >
      {!dark && <Corners />}
      <div className={`relative mx-auto ${wide ? "max-w-4xl" : "max-w-lg"}`}>
        <div className="reveal" data-anim="zoom">
          <h2 className={`font-script text-5xl sm:text-6xl ${dark ? "text-gold" : "text-maroon"}`}>{title}</h2>
          {subtitle && <p className={`mt-2 text-lg ${dark ? "text-cream/70" : "text-ink/70"}`}>{subtitle}</p>}
          <Divider className="my-6" />
        </div>
        <div className="reveal" style={{ animationDelay: "0.15s" }}>
          {children}
        </div>
      </div>
    </section>
  );
}

// Fern-curl carvings in the top-left and bottom-right corners of light sections.
function Corners() {
  return (
    <>
      <FernCorner className="absolute left-2 top-2 h-20 w-20 text-mauve/60 sm:h-28 sm:w-28" />
      <FernCorner className="absolute bottom-2 right-2 h-20 w-20 rotate-180 text-mauve/60 sm:h-28 sm:w-28" />
    </>
  );
}

export function Hero() {
  return (
    <section
      id="home"
      className="islamic-pattern relative flex min-h-[100lvh] flex-col items-center justify-center overflow-hidden bg-maroon-deep px-6 pb-[290px] text-center text-cream sm:pb-[400px]"
    >
      <Stars />
      <Petals />
      <FlowerVine className="sway absolute left-6 top-0 h-36 w-11 text-gold sm:left-[12%] sm:h-40 sm:w-14" />
      <FlowerVine className="sway absolute right-6 top-0 h-28 w-8 text-gold [animation-delay:-2s] sm:right-[12%] sm:h-32 sm:w-12" />
      <div className="relative z-10">
        <p className="reveal text-sm uppercase tracking-[0.35em] text-gold-light/80 sm:text-base">The Wedding of</p>
        <h1 className="reveal mt-3 font-script text-7xl text-gold sm:text-9xl" data-anim="zoom" style={{ animationDelay: "0.2s" }}>
          {couple}
        </h1>
        <p className="reveal mt-5 text-xl sm:text-2xl" style={{ animationDelay: "0.4s" }}>
          {wedding.dateLabel}
        </p>
      </div>
      <div className="glow absolute bottom-6 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose/30 blur-3xl sm:h-96 sm:w-96" aria-hidden />
      <div className="reveal absolute bottom-[22px] left-1/2 w-[440px] max-w-[118%] -translate-x-1/2 sm:w-[620px]" data-anim="rise">
        <RumahGadang uid="hero" className="w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]" />
      </div>
      <SongketBand className="absolute inset-x-0 bottom-0" />
      <a
        href="#verse"
        className="bounce-down absolute bottom-[300px] left-1/2 z-10 flex -translate-x-1/2 flex-col items-center text-xs uppercase tracking-[0.3em] text-gold-light sm:bottom-[410px]"
        aria-label="Scroll down"
      >
        Scroll
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </a>
    </section>
  );
}

export function Verse() {
  return (
    <section id="verse" className="islamic-pattern-light relative overflow-hidden bg-cream px-6 py-16 text-center sm:py-24">
      <Corners />
      <div className="relative mx-auto max-w-2xl">
        <p dir="rtl" lang="ar" className="reveal font-arabic text-2xl leading-loose text-maroon sm:text-3xl sm:leading-loose" data-anim="zoom">
          وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ۚ إِنَّ فِي ذَٰلِكَ لَآيَاتٍ لِّقَوْمٍ يَتَفَكَّرُونَ
        </p>
        <Divider className="my-6" />
        <div className="reveal" style={{ animationDelay: "0.2s" }}>
          <p className="text-lg italic leading-relaxed text-ink/80 sm:text-xl">
            &ldquo;And among His signs is that He created for you spouses from among yourselves so that you may find
            tranquility in them, and He placed between you affection and mercy. Indeed, in that are signs for people
            who reflect.&rdquo;
          </p>
          <p className="mt-3 font-semibold text-maroon">QS. Ar-Rum: 21</p>
        </div>
      </div>
    </section>
  );
}

export function Couple() {
  const person = (p: typeof wedding.groom, anim: "left" | "right") => (
    <div className="reveal flex flex-col items-center" data-anim={anim}>
      <div className="arch flex h-48 w-40 items-center justify-center border-2 border-gold bg-maroon p-1.5 shadow-xl shadow-maroon/20 transition duration-500 hover:-translate-y-1 sm:h-60 sm:w-48">
        <div className="arch islamic-pattern flex h-full w-full items-center justify-center bg-maroon-deep font-script text-6xl text-gold sm:text-7xl">
          <span className="float inline-block">{p.shortName[0]}</span>
        </div>
      </div>
      <h3 className="mt-5 text-2xl font-semibold text-maroon sm:text-3xl">{p.fullName}</h3>
      <p className="mt-1 text-ink/70">{p.parents}</p>
    </div>
  );

  return (
    <section id="couple" className="islamic-pattern-light scroll-mt-4 bg-cream px-6 pb-16 text-center sm:pb-24">
      <div className="reveal mx-auto max-w-xl">
        <p className="font-arabic text-xl text-maroon sm:text-2xl">ٱلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ ٱللَّٰهِ وَبَرَكَاتُهُ</p>
        <p className="mt-2 font-semibold text-maroon">Assalamu&apos;alaikum Warahmatullahi Wabarakatuh</p>
        <p className="mt-4 text-lg leading-relaxed text-ink/80">
          With gratitude for the blessings of Allah SWT, we humbly request the honour of your presence and du&apos;a at
          the wedding of our beloved children:
        </p>
      </div>
      <div className="mx-auto mt-12 flex max-w-4xl flex-col items-center gap-6 md:flex-row md:items-start md:justify-center md:gap-10">
        {person(wedding.groom, "left")}
        <p className="reveal font-script text-6xl text-gold md:mt-24" data-anim="zoom" style={{ animationDelay: "0.2s" }}>
          &amp;
        </p>
        {person(wedding.bride, "right")}
      </div>
    </section>
  );
}

export function Events() {
  return (
    <section id="event" className="islamic-pattern relative scroll-mt-4 bg-maroon-deep px-5 py-16 text-center text-cream sm:px-8 sm:py-24">
      <SongketBand className="absolute inset-x-0 top-0" />
      <SongketBand className="absolute inset-x-0 bottom-0" />
      <div className="mx-auto max-w-4xl">
        <div className="reveal" data-anim="zoom">
          <h2 className="font-script text-5xl text-gold sm:text-6xl">The Celebration</h2>
          <p className="mt-2 text-lg text-cream/70">Insya Allah, it will be held on</p>
          <Divider className="my-6" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {wedding.events.map((e, i) => (
            <div
              key={e.title}
              className="reveal rounded-t-[999px] rounded-b-2xl border border-gold/50 bg-maroon/60 px-6 pb-7 pt-14 transition duration-500 hover:-translate-y-1 hover:border-gold"
              data-anim={i % 2 === 0 ? "left" : "right"}
              style={{ animationDelay: `${0.15 * i}s` }}
            >
              <h3 className="font-script text-4xl text-gold">{e.title}</h3>
              <p className="mt-3 text-lg">{wedding.dateLabel}</p>
              <p className="text-lg text-gold-light">{e.time}</p>
              <div className="mx-auto my-4 h-px w-20 bg-gold/50" />
              <p className="text-xl font-semibold">{e.venue}</p>
              <p className="mt-1 text-cream/70">{e.address}</p>
              <a
                href={e.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-gold-light transition hover:bg-gold hover:text-maroon-deep active:scale-95"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
                  <circle cx="12" cy="10" r="2.5" />
                </svg>
                Open in Google Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function SaveTheDate() {
  const fmt = (iso: string) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, "");
  const calendarUrl =
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    `&text=${encodeURIComponent(`Wedding of ${couple}`)}` +
    `&dates=${fmt(wedding.date)}/${fmt(wedding.calendarEnd)}` +
    `&location=${encodeURIComponent(`${wedding.events[0].venue}, ${wedding.events[0].address}`)}`;

  return (
    <section className="islamic-pattern bg-maroon px-5 py-16 text-center text-cream sm:py-24">
      <div className="mx-auto max-w-lg">
        <div className="reveal" data-anim="zoom">
          <h2 className="font-script text-5xl text-gold sm:text-6xl">Counting the Days</h2>
          <Divider className="my-6" />
        </div>
        <div className="reveal" style={{ animationDelay: "0.15s" }}>
          <Countdown date={wedding.date} />
          <a
            href={calendarUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 font-semibold text-maroon-deep transition hover:scale-105 hover:bg-gold-light active:scale-95"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <rect x="3" y="5" width="18" height="16" rx="2" />
              <path d="M3 10h18M8 3v4M16 3v4" />
            </svg>
            Save the Date
          </a>
        </div>
      </div>
    </section>
  );
}

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
function timeAgo(iso: string) {
  const secs = (new Date(iso).getTime() - Date.now()) / 1000;
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ["year", 31_536_000],
    ["month", 2_592_000],
    ["week", 604_800],
    ["day", 86_400],
    ["hour", 3_600],
    ["minute", 60],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(secs) >= size) return rtf.format(Math.round(secs / size), unit);
  }
  return "just now";
}

export function WishList({ wishes }: { wishes: Wish[] }) {
  return (
    <div className="mt-8 text-left">
      <p className="mb-3 text-sm text-ink/60">
        {wishes.length} {wishes.length === 1 ? "wish" : "wishes"}
      </p>
      <ul className="max-h-[480px] space-y-3 overflow-y-auto overscroll-contain pr-1">
        {wishes.map((w) => (
          <li key={w.id} className="pop-in flex gap-3 rounded-xl border border-maroon/10 bg-white/80 p-4 shadow-sm">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-maroon font-semibold text-gold-light"
              aria-hidden
            >
              {w.name.trim()[0]?.toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className="font-semibold text-maroon">{w.name}</span>
                {w.attending !== null && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${w.attending ? "bg-maroon/10 text-maroon" : "bg-ink/10 text-ink/70"}`}
                  >
                    {w.attending ? "Attending" : "Not attending"}
                  </span>
                )}
                <span className="ml-auto text-xs text-ink/50">{timeAgo(w.createdAt)}</span>
              </div>
              <p className="mt-1.5 whitespace-pre-line break-words leading-relaxed text-ink/85">{w.message}</p>
            </div>
          </li>
        ))}
        {wishes.length === 0 && <li className="py-6 text-center text-ink/50">Be the first to send your wishes.</li>}
      </ul>
    </div>
  );
}

export function Closing() {
  return (
    <section className="islamic-pattern relative overflow-hidden bg-maroon-deep px-6 pb-[390px] pt-16 text-center text-cream sm:pb-[500px] sm:pt-24">
      <SongketBand className="absolute inset-x-0 top-0" />
      <Stars />
      <Petals />
      <div className="relative z-10 mx-auto max-w-xl">
        <p dir="rtl" lang="ar" className="reveal font-arabic text-2xl leading-loose text-gold-light sm:text-3xl" data-anim="zoom">
          بَارَكَ ٱللَّٰهُ لَكُمَا وَبَارَكَ عَلَيْكُمَا وَجَمَعَ بَيْنَكُمَا فِي خَيْرٍ
        </p>
        <div className="reveal" style={{ animationDelay: "0.2s" }}>
          <p className="mt-2 text-sm italic text-cream/70 sm:text-base">
            May Allah bless you both, shower His blessings upon you, and unite you in goodness.
          </p>
          <Divider className="my-6" />
          <p className="text-lg leading-relaxed text-cream/85">
            It would be an honour and a joy for us if you could attend and give your blessings. Jazakumullahu khairan.
          </p>
          <p className="mt-6 font-semibold text-gold-light">Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh</p>
          <p className="mt-8 text-sm uppercase tracking-[0.3em] text-cream/60">With love,</p>
          <p className="mt-2 font-script text-5xl text-gold sm:text-6xl">{couple}</p>
        </div>
      </div>
      <div className="glow absolute bottom-16 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-rose/30 blur-3xl sm:h-96 sm:w-96" aria-hidden />
      {/* Sits above the bottom navigation bar, on a songket "ground". */}
      <div className="reveal absolute bottom-[86px] left-1/2 w-[440px] max-w-[118%] -translate-x-1/2 sm:w-[620px]" data-anim="rise">
        <RumahGadang uid="closing" className="w-full drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-[86px] bg-maroon-soft/40" aria-hidden />
      <SongketBand className="absolute inset-x-0 bottom-16" />
    </section>
  );
}
