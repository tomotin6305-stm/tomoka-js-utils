// --------------------------------------
// スクリプト名：csv_cleaner.js
// 役割：CSVを整形して input_clean.csv として保存
// --------------------------------------

import fs from "fs";
import path from "path";

async function main() {
  console.log("=== CSV Cleaner Start ===");

  const targetDir = path.join(process.cwd(), "target_csv");
  const inputPath = path.join(targetDir, "input.csv");
  const outputPath = path.join(targetDir, "input_clean.csv");

  // フォルダとファイルの存在チェック
  if (!fs.existsSync(targetDir)) {
    console.error("Error: target_csv フォルダがないよ！");
    return;
  }
  if (!fs.existsSync(inputPath)) {
    console.error("Error: input.csv が target_csv にないよ！");
    return;
  }

  // CSV 読み込み
  const raw = fs.readFileSync(inputPath, "utf-8");

  // 行ごとに分割
  const lines = raw.split(/\r?\n/);

  // 整形関数
  const clean = (str) => {
    return str
      .trim()               // 前後スペース除去
      .replace(/　/g, " ")  // 全角スペース→半角
      .replace(/\s+/g, "-") // 半角スペース→ハイフン
      .toLowerCase();       // 小文字化
  };

  const cleaned = lines
    .map((line) =>
      line
        .split(",")
        .map((col) => clean(col))
        .join(",")
    )
    .join("\n");

  // 保存
  fs.writeFileSync(outputPath, cleaned, "utf-8");

  console.log(`=== CSV Cleaner Complete ===`);
  console.log(`→ 保存先: ${outputPath}`);
}

main();
