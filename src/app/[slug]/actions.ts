"use server";

import { revalidatePath } from "next/cache";
import { addWish, submitRsvp } from "@/lib/data";

// `id` is unique per submission so the pop-up message replays every time.
export type FormState = { ok: boolean; message: string; id: string } | null;

const result = (ok: boolean, message: string): FormState => ({ ok, message, id: crypto.randomUUID() });

export async function rsvpAction(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const attending = formData.get("attending");
  if (attending !== "yes" && attending !== "no") {
    return result(false, "Please choose whether you can attend.");
  }
  try {
    await submitRsvp(slug, {
      attending: attending === "yes",
      bringingPlusOne: formData.get("plusOne") === "yes",
      plusOneName: String(formData.get("plusOneName") ?? "").trim().slice(0, 100),
    });
  } catch {
    return result(false, "Something went wrong. Please try again.");
  }
  revalidatePath(`/${slug}`);
  return result(
    true,
    attending === "yes"
      ? "Jazakallahu khairan! We look forward to seeing you."
      : "Jazakallahu khairan for letting us know. Your du'a means a lot to us.",
  );
}

export async function wishAction(slug: string, _prev: FormState, formData: FormData): Promise<FormState> {
  const message = String(formData.get("message") ?? "").trim();
  if (!message) return result(false, "Please write a message.");
  if (message.length > 500) return result(false, "Please keep it under 500 characters.");
  try {
    await addWish(slug, message);
  } catch (e) {
    // Supabase errors are plain objects, not Error instances.
    const tooMany = String((e as { message?: unknown })?.message ?? "").includes("too many");
    return result(false, tooMany ? "You've already sent several wishes. Thank you!" : "Something went wrong. Please try again.");
  }
  revalidatePath(`/${slug}`);
  return result(true, "Thank you for your du'a!");
}
