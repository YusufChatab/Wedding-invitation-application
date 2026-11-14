"use client";

import { startTransition, useActionState, useState } from "react";
import type { FormState } from "@/app/[slug]/actions";
import { SongketBand } from "./ornaments";
import { Toast } from "./toast";

type Current = { attending: boolean | null; bringingPlusOne: boolean; plusOneName: string | null };

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  guestName: string;
  // The events this guest is invited to, e.g. "Akad Nikah".
  eventsLabel: string;
  plusOneAllowed: boolean;
  current: Current;
};

// Lighter maroon card so the form stands apart from the section background,
// topped with a strip of songket.
const card =
  "overflow-hidden rounded-3xl border border-gold/50 bg-maroon px-5 pb-7 pt-7 shadow-2xl shadow-black/30 sm:px-8 sm:pb-8 sm:pt-8";

const choice =
  "flex-1 cursor-pointer rounded-xl border border-gold/40 bg-maroon-deep/40 px-4 py-3 text-center transition has-[:checked]:border-gold has-[:checked]:bg-gold has-[:checked]:text-maroon-deep has-[:checked]:font-semibold";

export function RsvpForm({ action, guestName, eventsLabel, plusOneAllowed, current }: Props) {
  const [state, formAction, pending] = useActionState(action, null);
  const [attending, setAttending] = useState<"yes" | "no" | null>(
    current.attending === null ? null : current.attending ? "yes" : "no",
  );
  const [plusOne, setPlusOne] = useState<"yes" | "no">(current.bringingPlusOne ? "yes" : "no");

  // "Change my answer" remembers which result was showing when it was clicked;
  // the next successful submit closes the form again.
  const [editFrom, setEditFrom] = useState<string | null | undefined>(undefined);
  const savedSinceEdit = editFrom !== undefined && state?.ok === true && state.id !== editFrom;
  const editing = editFrom !== undefined && !savedSinceEdit;
  const showForm = current.attending === null || editing;

  return (
    <>
      {showForm ? (
        <form
          // Submit manually so React doesn't reset the form and clear the chosen options.
          onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.currentTarget);
            startTransition(() => formAction(data));
          }}
          className={`${card} pop-in space-y-5 text-left`}
        >
          <SongketBand className="relative -mx-5 -mt-7 mb-6 sm:-mx-8 sm:-mt-8" />
          <div>
            <label className="mb-1 block text-sm text-cream/70">Name</label>
            <div className="rounded-xl border border-gold/30 bg-maroon-deep/50 px-4 py-3 text-lg">{guestName}</div>
          </div>

          <fieldset>
            <legend className="mb-2 text-sm text-cream/70">Will you attend the {eventsLabel}?</legend>
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
                  className="pop-in w-full rounded-xl border border-gold/30 bg-maroon-deep/50 px-4 py-3 text-base text-cream placeholder:text-cream/40 focus:border-gold focus:outline-none"
                />
              )}
            </fieldset>
          )}

          <button
            type="submit"
            disabled={pending || attending === null}
            className="w-full rounded-full bg-gold py-3 font-semibold text-maroon-deep transition hover:bg-gold-light active:scale-[0.98] disabled:opacity-50"
          >
            {pending ? "Sending…" : current.attending === null ? "Send RSVP" : "Update RSVP"}
          </button>

          {editing && (
            <button
              type="button"
              onClick={() => setEditFrom(undefined)}
              className="block w-full text-center text-sm text-cream/60 underline-offset-4 hover:text-gold-light hover:underline"
            >
              Keep my previous answer
            </button>
          )}
        </form>
      ) : (
        <Replied current={current} eventsLabel={eventsLabel} onChange={() => setEditFrom(state?.id ?? null)} />
      )}

      {state && <Toast key={state.id} ok={state.ok} message={state.message} />}
    </>
  );
}

// Shown instead of the form once the guest has replied.
function Replied({ current, eventsLabel, onChange }: { current: Current; eventsLabel: string; onChange: () => void }) {
  const coming = current.attending === true;
  return (
    <div
      key={`${current.attending}-${current.bringingPlusOne}`}
      className={`${card} pop-in`}
    >
      <SongketBand className="relative -mx-5 -mt-7 mb-6 sm:-mx-8 sm:-mt-8" />
      <span
        className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${coming ? "bg-gold text-maroon-deep" : "bg-cream/15 text-gold-light"}`}
        aria-hidden
      >
        {coming ? (
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12l4 4 10-10" />
          </svg>
        ) : (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" />
          </svg>
        )}
      </span>

      <p className="mt-4 text-sm uppercase tracking-[0.3em] text-gold-light/80">You have replied</p>
      <h3 className="mt-2 font-script text-4xl text-gold sm:text-5xl">
        {coming ? "You're attending" : "You can't attend"}
      </h3>
      <p className="mt-1 text-sm uppercase tracking-[0.2em] text-cream/60">{eventsLabel}</p>

      {coming && current.bringingPlusOne && (
        <p className="mt-3 text-lg text-cream/90">Together with {current.plusOneName || "your plus one"}</p>
      )}

      <p className="mt-4 leading-relaxed text-cream/75">
        {coming
          ? "Jazakallahu khairan! Insya Allah, we look forward to celebrating with you."
          : "Jazakallahu khairan for letting us know. Your du'a means a lot to us."}
      </p>

      <button
        type="button"
        onClick={onChange}
        className="mt-6 rounded-full border border-gold px-6 py-2.5 text-gold-light transition hover:bg-gold hover:text-maroon-deep active:scale-95"
      >
        Change my answer
      </button>
    </div>
  );
}
