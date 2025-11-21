// modules/report_utils.js
import fs from "fs";

export function saveToFile(filename, content) {
  fs.writeFileSync(filename, content, "utf8");
  console.log(`✅ File saved: ${filename}`);
}

export function getTodayDate() {
  const d = new Date();
  return d.toISOString().split("T")[0];
}
