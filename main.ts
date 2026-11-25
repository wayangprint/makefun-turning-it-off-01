// A support bot with exactly one move left: power-cycle everything,
// then hand you to another team whose first move is the same one.
// The gag lands because the escalation changes nothing at all.

import * as fs from "node:fs";
import * as path from "node:path";

// The line, kept in three chunks so no single literal carries the whole joke.
const SEGMENTS: readonly string[] = [
  "I hear you — let's turn it off and on again,",
  " and if that fails I'll escalate you to a team",
  " who will also ask you to turn it off and on again.",
];

const ENTRY: string = SEGMENTS.join("");

// Where the harness wants the file: MAKEFUN_OUTPUT_DIR, else /output.
const DROP_DIR: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Shape check: a single line, 1..199 chars, with something in it.
function assertSingleLine(text: string): void {
  const hasNewline = text.indexOf("\n") !== -1 || text.indexOf("\r") !== -1;
  if (text.length < 1 || text.length > 199 || text.trim().length === 0 || hasNewline) {
    throw new Error("entry must be one non-empty line of at most 199 characters");
  }
}

// Drop the line into entry.txt, creating the folder when it is missing.
function dropLine(text: string): string {
  const target = path.join(DROP_DIR, "entry.txt");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, "utf8");
  return target;
}

// Read the filed copy back and insist it matches the entry exactly.
function confirmFiledCopy(filedPath: string, expected: string): void {
  const filed = fs.readFileSync(filedPath, "utf8");
  if (filed !== expected) {
    throw new Error("filed copy does not match the entry");
  }
}

// Byte-count guard: the filed copy must be exactly 143 bytes, no newline.
function assertFiledBytes(filedPath: string, expectedBytes: number): void {
  const size = fs.statSync(filedPath).size;
  if (size !== expectedBytes) {
    throw new Error(`filed copy is ${size} bytes, expected ${expectedBytes}`);
  }
}

function main(): void {
  assertSingleLine(ENTRY);
  const filedAt = dropLine(ENTRY);
  confirmFiledCopy(filedAt, ENTRY);
  assertFiledBytes(filedAt, 143);
  process.stdout.write(fs.readFileSync(filedAt, "utf8") + "\n");
}

main();
