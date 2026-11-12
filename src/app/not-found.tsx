import { Divider } from "@/components/ornaments";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-maroon-deep px-6 text-center text-cream">
      <h1 className="font-script text-6xl text-gold">Invitation not found</h1>
      <Divider className="my-6" />
      <p className="max-w-sm text-cream/75">
        We couldn&apos;t find this invitation. Please check the link you received, or contact the family.
      </p>
    </main>
  );
}
