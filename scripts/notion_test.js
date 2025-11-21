// scripts/notion_test.js
import 'dotenv/config';
import { Client } from "@notionhq/client";

console.log("🔍 Checking Notion connection...");

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function testConnection() {
  try {
    const db = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID
    });
    console.log(`✅ Connected to: ${db.title[0]?.plain_text || "No title"}`);
  } catch (error) {
    console.error("❌ Connection failed:", error);
  }
}

testConnection();
