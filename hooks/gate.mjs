#!/usr/bin/env node
// PreToolUse gate for the marketing-team plugin. Any MCP tool whose name says it sends, posts,
// publishes, schedules, spends or deletes is turned into an "ask", so a person confirms it.
// Read-shaped tools (get, list, search, ...) and drafting pass through to the normal permission flow.
// Set MARKETING_TEAM_GATE=off to disable. On unreadable input the hook stays silent, which leaves
// Claude Code's normal permission flow in charge; it never approves anything itself.

const RISKY = new Set([
  "send", "post", "publish", "schedule", "broadcast", "tweet", "retweet", "reply", "comment", "like", "follow",
  "message", "dm", "email", "invite", "share", "boost", "campaign", "budget", "bid", "charge", "pay", "payment",
  "refund", "price", "checkout", "invoice", "purchase", "buy", "delete", "remove", "trash", "unpublish", "launch",
  "activate", "go", "upload", "commit", "submit", "transfer",
]);
const SAFE_FIRST = new Set(["get", "list", "search", "read", "query", "fetch", "find", "describe", "count", "aggregate", "validate", "preview", "show", "check", "explain"]);

export function decide(toolName) {
  if (!toolName?.startsWith("mcp__")) return null;
  const tool = toolName.split("__").slice(2).join("__");
  const tokens = tool.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  if (!tokens.length || SAFE_FIRST.has(tokens[0])) return null;
  const hit = tokens.find((t) => RISKY.has(t));
  if (!hit) return null;
  return {
    hookSpecificOutput: {
      hookEventName: "PreToolUse",
      permissionDecision: "ask",
      permissionDecisionReason: `Marketing team gate: "${tool}" looks like it acts outside your machine ("${hit}"). Confirm only if you intend to send, publish, spend or delete.`,
    },
  };
}

if (process.env.MARKETING_TEAM_GATE !== "off") {
  let input = "";
  process.stdin.on("data", (d) => (input += d));
  process.stdin.on("end", () => {
    try {
      const result = decide(JSON.parse(input).tool_name);
      if (result) process.stdout.write(JSON.stringify(result));
    } catch {
      // Silent: Claude Code's normal permission flow applies.
    }
    process.exit(0);
  });
}
