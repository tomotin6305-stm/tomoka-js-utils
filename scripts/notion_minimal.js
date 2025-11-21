// --------------------------------------
// スクリプト名：notion_minimal.js
// 役割：Notion DB に1行だけ追加する
// --------------------------------------

import "dotenv/config";
import { Client } from "@notionhq/client";

async function main() {
  console.log("=== Notion Minimal Start ===");

  // Notion クライアント作成
  const notion = new Client({ auth: process.env.NOTION_TOKEN });

  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!databaseId) {
    console.error("Error: NOTION_DATABASE_ID が .env にないぞ！");
    return;
  }

  try {
    const res = await notion.pages.create({
      parent: { database_id: "2a0e55de023f803d844fd98fe1418353" },
      properties: {
        2025: {
          title: [
            {
              text: { content: "Hello from トモカ（最小スクリプト）" }
            }
          ]
        }
      }
    });

    console.log("追加成功！ ページID:", res.id);

  } catch (err) {
    console.error("Notion API Error:", err.message);
  }

  console.log("=== Notion Minimal Complete ===");
}

main();
