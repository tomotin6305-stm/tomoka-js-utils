// scripts/daily_report.js
import { CONFIG } from "../config/config.js";
console.log(CONFIG.meta);
import { saveToFile, getTodayDate } from "../modules/report_utils.js";
import { createNotionPageFromObject } from "../modules/notion_utils.js";

const date = getTodayDate();
const content = `Daily Report - ${date}\nAll systems nominal.`; // ←自由に書き換えてOK

saveToFile(`./data/daily_${date}.txt`, content);

// Notionにも送信
await createNotionPageFromObject({
  title: `Daily Report ${date}`,
  summary: content,
  location: "自動出力"
});