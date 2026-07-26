#!/usr/bin/env node
import * as crypto from "crypto";

interface Options {
  length: number;
  count: number;
  uppercase: boolean;
  lowercase: boolean;
  numbers: boolean;
  symbols: boolean;
  exclude: string;
}

function generate(opts: Options): string {
  let chars = "";
  if (opts.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
  if (opts.numbers) chars += "0123456789";
  if (opts.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

  // Remove excluded characters using direct string filtering (avoids regex escaping bugs)
  if (opts.exclude) {
    const excludeSet = new Set(opts.exclude);
    chars = chars.split("").filter((ch) => !excludeSet.has(ch)).join("");
  }
  if (!chars) { console.error("Error: No characters available after applying exclusions."); process.exit(1); }

  const bytes = crypto.randomBytes(opts.length);
  return Array.from(bytes).map(b => chars[b % chars.length]).join("");
}

function entropy(password: string, poolSize: number): number {
  if (poolSize <= 1) return 0;
  return Math.round(password.length * Math.log2(poolSize));
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help") || args.includes("-h")) {
    console.log("Usage: pwgen [options]");
    console.log("  -l, --length N    Password length (default: 16)");
    console.log("  -c, --count N     Number of passwords (default: 1)");
    console.log("  --no-uppercase    Exclude uppercase letters");
    console.log("  --no-symbols      Exclude symbols");
    console.log("  --exclude CHARS   Exclude specific characters");
    console.log("  -h, --help        Show this help message");
    process.exit(0);
  }

  const getArg = (flags: string[], def: string) => {
    for (const f of flags) { const i = args.indexOf(f); if (i >= 0) return args[i + 1]; }
    return def;
  };

  const length = parseInt(getArg(["-l", "--length"], "16"));
  const count = parseInt(getArg(["-c", "--count"], "1"));

  if (isNaN(length) || length < 1) { console.error("Error: --length must be a positive integer."); process.exit(1); }
  if (isNaN(count) || count < 1) { console.error("Error: --count must be a positive integer."); process.exit(1); }

  const opts: Options = {
    length,
    count,
    uppercase: !args.includes("--no-uppercase"),
    lowercase: true,
    numbers: true,
    symbols: !args.includes("--no-symbols"),
    exclude: getArg(["--exclude"], ""),
  };

  // Compute pool size once for accurate entropy reporting
  let pool = "";
  if (opts.uppercase) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  if (opts.lowercase) pool += "abcdefghijklmnopqrstuvwxyz";
  if (opts.numbers) pool += "0123456789";
  if (opts.symbols) pool += "!@#$%^&*()_+-=[]{}|;:,.<>?";
  if (opts.exclude) {
    const excludeSet = new Set(opts.exclude);
    pool = pool.split("").filter((ch) => !excludeSet.has(ch)).join("");
  }
  const poolSize = pool.length;

  for (let i = 0; i < opts.count; i++) {
    const pw = generate(opts);
    console.log(`${pw}  (${entropy(pw, poolSize)} bits)`);
  }
}

main();
