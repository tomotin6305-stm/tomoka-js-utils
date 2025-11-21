import 'dotenv/config';
import { Client } from "@notionhq/client";

const notion = new Client({ auth: process.env.NOTION_TOKEN });

async function addPage() {
  try {
    const response = await notion.pages.create({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        タグ: {
          title: [
            {
              text: { content: "Hello from Node.js 🚀" }
            }
          ]
        }
      }
    });
    console.log("✅ Page created:", response.id);
  } catch (error) {
    console.error("❌ Error creating page:", error.message);
  }
}

addPage();
