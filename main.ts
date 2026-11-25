// The Funniest AI Out-of-Office Reply — v2
// Writes one out-of-office auto-reply to $MAKEFUN_OUTPUT_DIR/entry.txt.
// No network, no input files, no secrets: the text lives here.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: an AI agent that has hit its rate limit for caring.
// Chosen over v1 ("training data contains zero examples of rest") because
// "rate limit for caring" is a sharper, more surprising collision of
// machine-speak and human feeling, and "Please try again on Monday" is
// pitch-perfect auto-reply voice in fewer words.
const ENTRY =
  "Out of office. I have hit my rate limit for caring. Please try again on Monday.";

function validate(text: string): void {
  if (typeof text !== "string" || text.length === 0) {
    throw new Error("entry must not be empty");
  }
  if (text.trim().length === 0) {
    throw new Error("entry must not be only whitespace");
  }
  if (text.length > 160) {
    throw new Error(`entry is ${text.length} characters, over the 160 limit`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("entry must be a single line");
  }
  // Plain ASCII on purpose: no em-dash, no emoji, no curly quotes.
  if (/[^\x20-\x7E]/.test(text)) {
    throw new Error("entry must be plain ASCII text");
  }
  // The gate counts characters; make sure the text round-trips as UTF-8.
  const roundTrip = Buffer.from(text, "utf8").toString("utf8");
  if (roundTrip !== text) {
    throw new Error("entry is not clean UTF-8 text");
  }
}

function main(): void {
  validate(ENTRY);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, ENTRY, "utf8");
  // Read the file back: a partial or altered write must fail loudly
  // instead of shipping a wrong entry.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY) {
    throw new Error("written file does not match the entry text");
  }
  console.log(`wrote ${outPath} (${ENTRY.length} characters)`);
}

main();
