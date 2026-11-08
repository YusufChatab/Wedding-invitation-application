"use client";

import { startTransition, useActionState, useState } from "react";
import type { FormState } from "@/app/[slug]/actions";
import { Toast } from "./toast";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  guestName: string;
  plusOneAllowed: boolean;
  current: { attending: boolean | null; bringingPlusOne: boolean; plusOneName: string | null };
};

const choice =
  "flex-1 cursor-pointer rounded-xl border border-gold/40 px-4 py-3 text-center transition has-[:checked]:border-gold has-[:checked]:bg-gold has-[:checked]:text-emerald-deep has-[:checked]:font-semibold";

export function RsvpForm({ action, guestName, plusOneAllowed, current }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const [attending, setAttending] = useState<"yes" | "no" | null>(
    current.attending === null ? null : current.attending ? "yes" : "no",
  );
  const [plusOne, setPlusOne] = useState<"yes" | "no">(current.bringingPlusOne ? "yes" : "no");

  return (
    <form
      // Submit manually so React doesn't reset the form and clear the chosen options.
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => formAction(data));
      }}
      className="space-y-5 text-left"
    >
      {current.attending !== null && (
        <p key={String(current.attending) + current.bringingPlusOne} className="pop-in rounded-xl bg-emerald/70 px-4 py-3 text-center text-sm text-gold-light">
          You have replied: <strong>{current.attending ? "Attending" : "Not attending"}</strong>
          {current.bringingPlusOne && " with a plus one"}. You can change your answer below.
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm text-cream/70">Name</label>
        <div className="rounded-xl border border-gold/30 bg-emerald/50 px-4 py-3 text-lg">{guestName}</div>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm text-cream/70">Will you attend?</legend>
        <div className="flex gap-3">
          <label className={choice}>
            <input type="radio" name="attending" value="yes" className="sr-only" checked={attending === "yes"} onChange={() => setAttending("yes")} />
            Insya Allah, I&apos;ll attend
          </label>
          <label className={choice}>
            <input type="radio" name="attending" value="no" className="sr-only" checked={attending === "no"} onChange={() => setAttending("no")} />
            Sorry, I can&apos;t
          </label>
        </div>
      </fieldset>

      {plusOneAllowed && attending === "yes" && (
        <fieldset className="pop-in space-y-3">
          <legend className="mb-2 text-sm text-cream/70">Are you bringing a plus one?</legend>
          <div className="flex gap-3">
            <label className={choice}>
              <input type="radio" name="plusOne" value="no" className="sr-only" checked={plusOne === "no"} onChange={() => setPlusOne("no")} />
              Just me
            </label>
            <label className={choice}>
              <input type="radio" name="plusOne" value="yes" className="sr-only" checked={plusOne === "yes"} onChange={() => setPlusOne("yes")} />
              Me + 1
            </label>
          </div>
          {plusOne === "yes" && (
            <input
              name="plusOneName"
              defaultValue={current.plusOneName ?? ""}
              maxLength={100}
              placeholder="Plus one's name (optional)"
              className="pop-in w-full rounded-xl border border-gold/30 bg-emerald/50 px-4 py-3 text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
            />
          )}
        </fieldset>
      )}

      <button
        type="submit"
        disabled={pending || attending === null}
        className="w-full rounded-full bg-gold py-3 font-semibold text-emerald-deep transition hover:bg-gold-light active:scale-[0.98] disabled:opacity-50"
      >
        {pending ? "Sending…" : current.attending === null ? "Send RSVP" : "Update RSVP"}
      </button>

      {state && <Toast key={state.id} ok={state.ok} message={state.message} />}
    </form>
  );
}
