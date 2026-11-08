import { wedding } from "@/config/wedding";
import { Divider, Mosque } from "@/components/ornaments";

export default function Home() {
  return (
    <main className="islamic-pattern relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-emerald-deep px-6 pb-48 text-center text-cream">
      <p className="font-arabic text-2xl text-gold-light">بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
      <p className="mt-6 text-sm uppercase tracking-[0.35em] text-gold-light/80">The Wedding of</p>
      <h1 className="mt-2 font-script text-7xl text-gold">
        {wedding.groom.shortName} &amp; {wedding.bride.shortName}
      </h1>
      <p className="mt-4 text-xl">{wedding.dateLabel}</p>
      <Divider className="my-8" />
      <p className="max-w-sm text-cream/75">Please open the personal invitation link you received to view your invitation.</p>
      <Mosque className="absolute bottom-0 left-1/2 w-[520px] max-w-[130%] -translate-x-1/2 text-emerald-soft" />
    </main>
  );
}
