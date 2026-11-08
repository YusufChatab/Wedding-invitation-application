// Writes dummy-guests.xlsx (100 placeholder invitations) in the same format
// the real guest list should use: Name | Plus One | Phone.
import ExcelJS from "exceljs";
import { dummyGuests } from "../src/lib/dummy-guests.ts";

const wb = new ExcelJS.Workbook();
const sheet = wb.addWorksheet("Guests");
sheet.addRow(["Name", "Plus One", "Phone"]).font = { bold: true };
for (const g of dummyGuests(100)) sheet.addRow([g.name, g.plusOneAllowed ? "Yes" : "No", ""]);
sheet.getColumn(1).width = 36;
sheet.getColumn(2).width = 10;
sheet.getColumn(3).width = 18;
await wb.xlsx.writeFile("dummy-guests.xlsx");
console.log("Wrote dummy-guests.xlsx");
