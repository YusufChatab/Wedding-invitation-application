// Imports the guest list from an Excel file into Supabase and writes a CSV of
// personal links you can send out.
//
// Usage:
//   npm run import-guests -- guests.xlsx            (writes to Supabase)
//   npm run import-guests -- guests.xlsx --dry-run  (only writes guest-links.csv)
//
// Every sheet is read; the sheet name is saved as whose guest it is (e.g. a
// "Farah" sheet and a "Raziq" sheet). Columns (header row; case-insensitive):
//   Name      – the invitation name shown on the cover, e.g. "Bpk Edi & Istri"
//   Event     – Both, Akad or Reception (also "Resepsi/Akad" as the header, and
//               Akad Nikah, Resepsi, Walimah, "Resepsi & Akad" as values).
//               Optional, defaults to both.
//   Pax       – how many people the invitation is for (also Jumlah, Guests).
//               Blank or not a number counts as 1.
//   Plus One  – Yes/No, older sheets only: Yes means 2 people.
//   Phone     – optional, kept for your reference
// Needs supabase/migrations/002-invitation-events.sql and 003-guest-count.sql.
//
// Re-running is safe: invitations are matched by their link slug, so existing
// RSVPs and wishes are kept.

import ExcelJS from "exceljs";
import { createClient } from "@supabase/supabase-js";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

// Load .env.local (same file Next.js uses) without overriding real env vars.
if (existsSync(".env.local")) {
  for (const line of readFileSync(".env.local", "utf8").split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");
const siteUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

if (!file) {
  console.error("Usage: npm run import-guests -- <guests.xlsx> [--dry-run]");
  process.exit(1);
}

function slugify(name) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function cellText(cell) {
  const v = cell?.value;
  if (v == null) return "";
  if (typeof v === "object" && "richText" in v) return v.richText.map((t) => t.text).join("").trim();
  if (typeof v === "object" && "text" in v) return String(v.text).trim();
  if (typeof v === "object" && "result" in v) return String(v.result ?? "").trim();
  return String(v).trim().replace(/\s+/g, " ");
}

// Which events an invitation covers; blank or unknown means both.
function eventAccess(text) {
  const t = text.toLowerCase();
  const akad = /akad|nikah/.test(t);
  const reception = /recep|resep|resp|walimah/.test(t);
  if (akad && !reception) return "akad";
  if (reception && !akad) return "reception";
  return "both";
}

const truthy = new Set(["yes", "y", "ya", "1", "true", "✓", "x"]);

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(file);

const guests = [];
const used = new Map();
const notes = [];

for (const sheet of workbook.worksheets) {
  const side = sheet.name.trim();
  // Find the header row (first row containing a "name" column).
  let headerRow = 0;
  const cols = {};
  sheet.eachRow((row, rowNumber) => {
    if (headerRow) return;
    row.eachCell((cell, col) => {
      const h = cellText(cell).toLowerCase();
      if (!cols.name && /(^|\s)(name|nama)/.test(h)) cols.name = col;
      else if (!cols.event && /(event|acara|undangan|resep|akad)/.test(h)) cols.event = col;
      else if (!cols.pax && /(pax|jumlah|guests|orang|seat)/.test(h)) cols.pax = col;
      else if (!cols.plusOne && /(plus|\+\s*1|partner)/.test(h)) cols.plusOne = col;
      else if (!cols.phone && /(phone|wa|whatsapp|hp|telp)/.test(h)) cols.phone = col;
    });
    if (cols.name) headerRow = rowNumber;
  });
  if (!headerRow) {
    notes.push(`Sheet "${side}": no "Name" column, skipped.`);
    continue;
  }

  sheet.eachRow((row, rowNumber) => {
    if (rowNumber <= headerRow) return;
    const name = cellText(row.getCell(cols.name));
    if (!name) return;

    let maxGuests = 1;
    if (cols.pax) {
      const raw = cellText(row.getCell(cols.pax));
      const n = Number.parseInt(raw, 10);
      if (n >= 1) maxGuests = Math.min(n, 20);
      else notes.push(`${side} row ${rowNumber} "${name}": pax "${raw}" is not a number, using 1.`);
    } else if (cols.plusOne && truthy.has(cellText(row.getCell(cols.plusOne)).toLowerCase())) {
      maxGuests = 2;
    }

    const base = slugify(name) || "guest";
    const n = (used.get(base) ?? 0) + 1;
    used.set(base, n);
    if (n > 1) notes.push(`"${name}" (${side} row ${rowNumber}) appears more than once: link /${base}-${n}.`);

    guests.push({
      slug: n === 1 ? base : `${base}-${n}`,
      name,
      side,
      events: cols.event ? eventAccess(cellText(row.getCell(cols.event))) : "both",
      max_guests: maxGuests,
      plus_one_allowed: maxGuests > 1,
      phone: cols.phone ? cellText(row.getCell(cols.phone)) || null : null,
    });
  });
}

const count = (ev) => guests.filter((g) => g.events === ev).length;
const seats = guests.reduce((sum, g) => sum + g.max_guests, 0);
console.log(
  `Found ${guests.length} invitations for up to ${seats} people ` +
    `(${count("both")} both events, ${count("akad")} Akad only, ${count("reception")} Reception only).`,
);
for (const side of new Set(guests.map((g) => g.side))) {
  const list = guests.filter((g) => g.side === side);
  console.log(`  ${side}: ${list.length} invitations, up to ${list.reduce((s, g) => s + g.max_guests, 0)} people`);
}
for (const note of notes) console.log("Note:", note);

if (!dryRun) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error("Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local (or use --dry-run).");
    process.exit(1);
  }
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  for (let i = 0; i < guests.length; i += 500) {
    const { error } = await supabase.from("invitations").upsert(guests.slice(i, i + 500), { onConflict: "slug" });
    if (error) {
      console.error("Import failed:", error.message);
      process.exit(1);
    }
  }
  console.log("Imported into Supabase.");
}

const csv = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;
const eventLabel = { both: "Akad & Resepsi", akad: "Akad", reception: "Resepsi" };
const lines = ["Guest of,Name,Event,Pax,Phone,Link"].concat(
  guests.map((g) =>
    [g.side, g.name, eventLabel[g.events], g.max_guests, g.phone, `${siteUrl}/${g.slug}`].map(csv).join(","),
  ),
);
writeFileSync("guest-links.csv", "﻿" + lines.join("\n"));
console.log("Wrote guest-links.csv");
