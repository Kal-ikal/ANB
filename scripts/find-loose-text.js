const fs = require("fs");
const path = require("path");

const targetExtensions = [".tsx", ".ts", ".jsx", ".js"];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf8");

  const issues = [];

  // 1. Cari text mentah di dalam View-ish component
  const viewComponents = [
    "View",
    "TouchableOpacity",
    "Pressable",
    "SafeAreaView",
    "ScrollView"
  ];

  viewComponents.forEach((comp) => {
    const regex = new RegExp(`<${comp}[^>]*>([\\s\\S]*?)<\\/${comp}>`, "g");

    let match;
    while ((match = regex.exec(content))) {
      const inner = match[1];

      // abaikan jika tidak mengandung huruf
      if (!/[A-Za-z]/.test(inner)) continue;

      // abaikan jika sudah ada <Text>
      if (inner.includes("<Text")) continue;

      issues.push({
        type: "RAW_TEXT_IN_VIEW",
        snippet: inner.trim().slice(0, 80)
      });
    }
  });

  // 2. Cari ekspresi string boolean/undefined
  const riskyPatterns = [
    /{\s*[A-Za-z0-9_]+\s*&&\s*["'][^"']+["']\s*}/g, // a && "string"
    /{\s*["'][^"']+["']\s*\?\s*[^:]+:\s*[^}]+}/g,     // "string" ? ...
    /{\s*[A-Za-z0-9_]+\s*}/g                          // {var} bisa jadi undefined/string
  ];

  riskyPatterns.forEach((regex) => {
    let m;
    while ((m = regex.exec(content))) {
      issues.push({
        type: "RISKY_EXPRESSION",
        snippet: m[0]
      });
    }
  });

  if (issues.length > 0) {
    console.log("\n⚠ FILE:", filePath);
    issues.forEach((i) => {
      console.log("  →", i.type, ":", i.snippet);
    });
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach((f) => {
    const file = path.join(dir, f);

    if (fs.statSync(file).isDirectory()) {
      walk(file);
    } else if (targetExtensions.includes(path.extname(file))) {
      scanFile(file);
    }
  });
}

console.log("🔍 Scanning project for loose text nodes...");
walk("./app"); // bisa ganti ke folder project kamu
console.log("\nDone.");
