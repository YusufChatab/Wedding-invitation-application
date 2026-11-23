"use server";

import { revalidatePath } from "next/cache";
import { addOpenWish, addWish, submitRsvp } from "@/lib/data";

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
      // Capped at the invitation's seats by the database.
      guests: Number.parseInt(String(formData.get("guests") ?? "1"), 10) || 1,
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
  // Only the shared family links have a name box.
  const name = formData.has("name") ? String(formData.get("name")).trim() : null;
  if (name !== null && !name) return result(false, "Please type your name.");
  if (name !== null && name.length > 60) return result(false, "Please keep your name under 60 characters.");
  try {
    if (name !== null) await addOpenWish(slug, name, message);
    else await addWish(slug, message);
  } catch (e) {
    // Supabase errors are plain objects, not Error instances.
    const tooMany = String((e as { message?: unknown })?.message ?? "").includes("too many");
    return result(false, tooMany ? "You've already sent several wishes. Thank you!" : "Something went wrong. Please try again.");
  }
  revalidatePath(`/${slug}`);
  return result(true, "Thank you for your du'a!");
}
