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
  
  for (const c of opts.exclude) chars = chars.replace(new RegExp("\\" + c, "g"), "");
  if (!chars) { console.error("No characters available"); process.exit(1); }
  
  const bytes = crypto.randomBytes(opts.length);
  return Array.from(bytes).map(b => chars[b % chars.length]).join("");
}

function entropy(password: string): number {
  const unique = new Set(password).size;
  return Math.round(password.length * Math.log2(unique));
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log("Usage: pwgen [options]");
    console.log("  -l, --length N    Password length (default: 16)");
    console.log("  -c, --count N     Number of passwords (default: 1)");
    console.log("  --no-uppercase    Exclude uppercase");
    console.log("  --no-symbols      Exclude symbols");
    console.log("  --exclude CHARS   Exclude specific characters");
    process.exit(0);
  }
  
  const getArg = (flags: string[], def: string) => {
    for (const f of flags) { const i = args.indexOf(f); if (i >= 0) return args[i + 1]; }
    return def;
  };
  
  const opts: Options = {
    length: parseInt(getArg(["-l", "--length"], "16")),
    count: parseInt(getArg(["-c", "--count"], "1")),
    uppercase: !args.includes("--no-uppercase"),
    lowercase: true,
    numbers: true,
    symbols: !args.includes("--no-symbols"),
    exclude: getArg(["--exclude"], ""),
  };
  
  for (let i = 0; i < opts.count; i++) {
    const pw = generate(opts);
    console.log(`${pw}  (${entropy(pw)} bits)`);
  }
}

main();
