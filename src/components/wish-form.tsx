"use client";

import { useActionState, useEffect, useRef } from "react";
import type { FormState } from "@/app/[slug]/actions";
import { Toast } from "./toast";

export function WishForm({
  action,
  guestName,
}: {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  guestName: string;
}) {
  const [state, formAction, pending] = useActionState(action, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-3 text-left">
      <p className="text-sm text-ink/70">
        Posting as <strong className="text-emerald">{guestName}</strong>
      </p>
      <textarea
        name="message"
        required
        maxLength={500}
        rows={4}
        placeholder="Write your du'a and wishes for the couple…"
        className="w-full rounded-xl border border-emerald/20 bg-white/80 px-4 py-3 text-base text-ink placeholder:text-ink/40 focus:border-gold focus:outline-none"
      />
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-emerald py-3 font-semibold text-cream transition hover:bg-emerald-soft active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send Wishes"}
      </button>
      {state && <Toast key={state.id} ok={state.ok} message={state.message} />}
    </form>
  );
}
