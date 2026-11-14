// Imports the guest list from an Excel file into Supabase and writes a CSV of
// personal links you can send out.
//
// Usage:
//   npm run import-guests -- guests.xlsx            (writes to Supabase)
//   npm run import-guests -- guests.xlsx --dry-run  (only writes guest-links.csv)
//
// Expected columns (first sheet, header row; case-insensitive):
//   Name      – the invitation name shown on the cover, e.g. "Yusuf Chatab"
//   Plus One  – Yes/No (also accepts Y, 1, true, Ya). Optional, defaults to No.
//   Event     – Both, Akad or Reception (also Akad Nikah, Resepsi, Walimah,
//               Semua). Optional, defaults to Both. Needs the events migration
//               (supabase/migrations/002-invitation-events.sql).
//   Phone     – optional, kept for your reference
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
  return String(v).trim();
}

// Which events an invitation covers; blank or unknown means both.
function eventAccess(text) {
  const t = text.toLowerCase();
  const akad = /akad|nikah/.test(t);
  const reception = /recep|resep|walimah/.test(t);
  if (akad && !reception) return "akad";
  if (reception && !akad) return "reception";
  return "both";
}

const truthy = new Set(["yes", "y", "ya", "1", "true", "✓", "x"]);

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(file);
const sheet = workbook.worksheets[0];

// Find the header row (first row containing a "name" column).
let headerRow = 0;
const cols = {};
sheet.eachRow((row, rowNumber) => {
  if (headerRow) return;
  row.eachCell((cell, col) => {
    const h = cellText(cell).toLowerCase();
    if (!cols.name && /(^|\s)(name|nama)/.test(h)) cols.name = col;
    else if (!cols.plusOne && /(plus|\+\s*1|partner)/.test(h)) cols.plusOne = col;
    else if (!cols.event && /(event|acara|undangan)/.test(h)) cols.event = col;
    else if (!cols.phone && /(phone|wa|whatsapp|hp|telp)/.test(h)) cols.phone = col;
  });
  if (cols.name) headerRow = rowNumber;
});

if (!headerRow) {
  console.error('Could not find a "Name" column in the first sheet.');
  process.exit(1);
}

const guests = [];
const used = new Map();
sheet.eachRow((row, rowNumber) => {
  if (rowNumber <= headerRow) return;
  const name = cellText(row.getCell(cols.name));
  if (!name) return;
  const base = slugify(name) || "guest";
  const n = (used.get(base) ?? 0) + 1;
  used.set(base, n);
  guests.push({
    slug: n === 1 ? base : `${base}-${n}`,
    name,
    plus_one_allowed: cols.plusOne ? truthy.has(cellText(row.getCell(cols.plusOne)).toLowerCase()) : false,
    phone: cols.phone ? cellText(row.getCell(cols.phone)) || null : null,
    // Only sent when the sheet has an Event column, so older sheets still import
    // before the events migration has been run.
    ...(cols.event ? { events: eventAccess(cellText(row.getCell(cols.event))) } : {}),
  });
});

const count = (ev) => guests.filter((g) => (g.events ?? "both") === ev).length;
console.log(
  `Found ${guests.length} guests (${guests.filter((g) => g.plus_one_allowed).length} with plus one; ` +
    `${count("both")} both events, ${count("akad")} Akad only, ${count("reception")} Reception only).`,
);

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
const eventLabel = { both: "Both", akad: "Akad", reception: "Reception" };
const lines = ["Name,Plus One,Event,Phone,Link"].concat(
  guests.map((g) =>
    [g.name, g.plus_one_allowed ? "Yes" : "No", eventLabel[g.events ?? "both"], g.phone, `${siteUrl}/${g.slug}`].map(csv).join(","),
  ),
);
writeFileSync("guest-links.csv", "﻿" + lines.join("\n"));
console.log("Wrote guest-links.csv");
