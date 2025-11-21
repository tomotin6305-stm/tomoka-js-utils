// scripts/notion_write_report.js
import { createNotionPageFromObject } from "../modules/notion_utils.js";
import fs from "fs";
import path from "path";

// read history and produce a simple summary — adapt to your actual daily_report logic
const dataPath = path.join(process.cwd(), "data", "history.txt"); // adjust if your history is elsewhere
const raw = fs.existsSync(dataPath) ? fs.readFileSync(dataPath, "utf8").trim() : "";

function calcSummaryFromHistory(rawText) {
  if (!rawText) return null;
  const lines = rawText.split("\n").filter(Boolean);
  const results = lines.map(line => {
    const nums = line.split(",").map(n => Number(n) || 0);
    const sum = nums.reduce((a,b)=>a+b,0);
    const avg = nums.length ? sum / nums.length : 0;
    return { sum, avg };
  });
  const totalSum = results.reduce((a,b)=>a + b.sum, 0);
  const overallAvg = results.length ? (results.reduce((a,b)=>a + b.avg, 0) / results.length) : 0;
  return { totalSum, overallAvg, rows: results.length };
}

(async () => {
  try {
    const s = calcSummaryFromHistory(raw);
    if (!s) {
      console.log("no history found");
      return;
    }

    const now = new Date();
    const isoDate = now.toISOString(); // includes time
    const prettyTitle = `Daily Report ${isoDate.slice(0,10)}`;

    const obj = {
      title: prettyTitle,
      date: isoDate.slice(0,10),
      time: isoDate,
      tags: ["auto"], // example tag
      summary: `Rows: ${s.rows}`,
      sum: s.totalSum,
      avg: Number(s.overallAvg.toFixed(2))
    };

    await createNotionPageFromObject(obj);
  } catch (err) {
    console.error("failed to write report:", err?.message || err);
  }
})();
