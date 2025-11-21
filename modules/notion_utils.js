import 'dotenv/config';
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

const FIELD_MAP = {
  title: "タグ",        // Title property（Notionのページ名）
  summary: "意味",      // Rich text
  location: "よく使う場所"  // Rich text
};

export async function createNotionPageFromObject(obj = {}) {
  const properties = {};

  // Title
  if (obj.title) {
    properties[FIELD_MAP.title] = {
      title: [{ text: { content: String(obj.title) } }]
    };
  } else {
    properties[FIELD_MAP.title] = {
      title: [{ text: { content: "untitled" } }]
    };
  }

  // 意味
  if (obj.summary) {
    properties[FIELD_MAP.summary] = {
      rich_text: [{ text: { content: String(obj.summary) } }]
    };
  }

  // よく使う場所
  if (obj.location) {
    properties[FIELD_MAP.location] = {
      rich_text: [{ text: { content: String(obj.location) } }]
    };
  }

  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties
    });
    console.log("✅ Page created:", response.id);
    return response;
  } catch (err) {
    console.error("❌ Notion write error:", err);
    throw err;
  }
}
