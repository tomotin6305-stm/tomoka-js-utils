console.log("API:", process.env.GPT_API_KEY);
import fs from "fs";
import path from "path";
import "dotenv/config";

// words.json の場所（絶対これ）
const wordsPath = path.join(process.cwd(), "data", "words", "words.json");

// 出力先（これだけ）
const wordsDBPath = path.join(process.cwd(), "data", "words", "words_db.json");

// GPT API に問い合わせる
async function fetchMeaning(word, retry = 1) {
    try {
        const exampleSentence = `I use the word "${word}" in a sentence.`;

        const res = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GPT_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o",
                input: [
                    {
                        role: "system",
                        content: "You are an English dictionary. Always answer in JSON only."
                    },
                    {
                        role: "user",
                        content: `Explain the meaning of "${word}" in this sentence: "I used the word ${word} in a sentence."`
                    },
                    {
                        role: "user",
                        content: `Return JSON only: {"pos":"","meaning_ja":"","example":""}`
                    }
                ]
            })
        });

        const data = await res.json();

        // 安全チェック
        if (
            !data.output ||
            !data.output[0] ||
            !data.output[0].content ||
            !data.output[0].content[0] ||
            !data.output[0].content[0].text
        ) {
            throw new Error("空レス");
        }

        let raw = data.output[0].content[0].text.trim();

        const start = raw.indexOf("{");
        const end = raw.lastIndexOf("}");
        if (start === -1 || end === -1) throw new Error("JSON not found");

        return JSON.parse(raw.slice(start, end + 1));

    } catch (e) {
        if (retry > 0) {
            console.log(`Retry: ${word}（${e.message}）`);
            await new Promise(r => setTimeout(r, 300));
            return fetchMeaning(word, retry - 1);
        }
        console.log(`FAIL: ${word} → ${e.message}`);
        return { pos: "", meaning_ja: "", example: "" };
    }
}

async function main() {
    // words.json を読み込み
    const words = JSON.parse(fs.readFileSync(wordsPath, "utf-8"));

    const db = {};

    // 1単語ずつ辞書化
    for (const w of words) {
        console.log(`辞書化中：${w}`);
        db[w] = await fetchMeaning(w);
    }

    // 保存
    fs.writeFileSync(wordsDBPath, JSON.stringify(db, null, 2), "utf-8");

    console.log(`----- 完了！辞書DB生成 → ${wordsDBPath} -----`);
}

main();

