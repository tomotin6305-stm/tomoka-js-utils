// --------------------------------------
// スクリプト名：file_cleaner.js
// 役割：target フォルダ内のファイル名を整形する
// --------------------------------------

import fs from "fs";
import path from "path";
import "dotenv/config";

async function main() {
  try {
    console.log("=== File Cleaner Start ===");

    // clean 対象フォルダ
    const targetDir = path.join(process.cwd(), "target");

    // フォルダ存在チェック
    if (!fs.existsSync(targetDir)) {
      console.error("Error: target フォルダが見つからないよ。");
      return;
    }

    // フォルダ内のファイル一覧を取得
    const files = fs.readdirSync(targetDir);

    if (files.length === 0) {
      console.log("target フォルダが空です。何もすることないよ。");
      return;
    }

    for (const file of files) {
      const oldPath = path.join(targetDir, file);

      // ディレクトリはスキップ
      if (fs.statSync(oldPath).isDirectory()) continue;

      // 拡張子を保持
      const ext = path.extname(file);
      let base = path.basename(file, ext);

      // === 整形処理 ===

      // 前後の空白削除
      base = base.trim();

      // 全角スペース → 半角スペース
      base = base.replace(/　/g, " ");

      // 半角スペース → ハイフン
      base = base.replace(/\s+/g, "-");

      // 大文字 → 小文字
      base = base.toLowerCase();

      const newName = `${base}${ext}`;
      const newPath = path.join(targetDir, newName);

      // 名前が変わっている場合のみ rename
      if (newName !== file) {
        console.log(`rename: ${file} → ${newName}`);
        fs.renameSync(oldPath, newPath);
      }
    }

    console.log("=== File Cleaner Complete ===");
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
