#!/usr/bin/env node
// PreToolUse gate for the marketing-team plugin. It never approves anything; it only turns some calls
// into an "ask", so a person confirms them, and leaves every other call to Claude Code's normal
// permission flow.
//
// MCP tools fail closed: every MCP call asks, unless the tool's action name starts with a read verb
// (get, list, read, search, fetch, query, describe, view, find, show, count) AND contains no write
// verb (execute, run, trigger, send, post, publish, create, update, delete, ...). Mixed names ask.
//
// Bash commands ask when they invoke a network client, a deploy or payment CLI, or a command that
// pushes, publishes or merges (curl, wget, ssh, gh with write actions, git push, npm publish, stripe,
// vercel, aws, ...). This list is heuristic: it matches command words, so a script or a one-liner in
// python or node that opens its own connection is not caught. It is not a sandbox.
//
// Set MARKETING_TEAM_GATE=off to disable. On unreadable input the hook stays silent.

const READ_FIRST = new Set(["get", "list", "read", "search", "fetch", "query", "describe", "view", "find", "show", "count"]);
const WRITE = new Set([
  "send", "post", "publish", "unpublish", "schedule", "unschedule", "broadcast", "tweet", "retweet", "reply", "comment",
  "like", "follow", "message", "dm", "email", "forward", "invite", "share", "unshare", "boost", "campaign", "budget",
  "bid", "charge", "pay", "payment", "refund", "price", "checkout", "invoice", "purchase", "buy", "spend",
  "delete", "remove", "trash", "destroy", "purge", "launch", "activate", "deactivate", "go", "upload", "commit",
  "submit", "transfer", "execute", "exec", "run", "trigger", "invoke", "call", "workflow", "create", "update",
  "write", "set", "put", "patch", "edit", "save", "add", "insert", "upsert", "modify", "replace", "move", "copy",
  "merge", "deploy", "promote", "rollback", "import", "export", "rename", "archive", "restore", "approve", "cancel",
  "revoke", "grant", "connect", "sync", "apply", "enable", "disable", "start", "stop", "pause", "resume", "generate",
  "render", "push", "sql", "mutate", "mutation", "notify", "assign", "resolve", "mark", "label", "respond",
]);

export function decideMcp(toolName) {
  const parts = toolName.split("__");
  const server = (parts[1] ?? "").toLowerCase();
  const tool = parts.slice(2).join("__");
  let tokens = tool.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toLowerCase().split(/[^a-z0-9]+/).filter(Boolean);
  // Many servers repeat their own name as a prefix (slack_read_channel, notion-search).
  const serverTokens = new Set(server.split(/[^a-z0-9]+/).filter(Boolean));
  while (tokens.length > 1 && serverTokens.has(tokens[0])) tokens = tokens.slice(1);
  const write = tokens.find((t) => WRITE.has(t));
  if (tokens.length && READ_FIRST.has(tokens[0]) && !write) return null;
  const why = write ? `its name contains "${write}"` : "its name does not start with a read verb";
  return ask(`Marketing team gate: MCP tool "${tool || toolName}" is not on the read-only list (${why}). Confirm only if you intend it to act outside your machine.`);
}

// Command words that reach the network or an authenticated service on their own.
const NET = new Set([
  "curl", "wget", "http", "https", "httpie", "xh", "ssh", "scp", "sftp", "rsync", "nc", "ncat", "netcat", "socat",
  "telnet", "ftp", "stripe", "twurl", "vercel", "netlify", "aws", "gcloud", "gsutil", "bq", "az", "heroku",
  "flyctl", "fly", "doctl", "firebase", "wrangler", "railway", "kubectl", "terraform", "sendmail", "mail", "mailx",
  "mutt", "msmtp", "twine",
]);
// Command words that are only external with certain subcommands.
const SUB = {
  git: ["push", "send-email", "request-pull"],
  npm: ["publish", "unpublish", "deprecate", "dist-tag", "owner", "access", "login", "adduser"],
  pnpm: ["publish"],
  yarn: ["publish", "npm"],
  bun: ["publish"],
  docker: ["push", "login"],
  podman: ["push", "login"],
  cargo: ["publish", "yank", "owner", "login"],
  gem: ["push", "yank", "owner"],
  supabase: ["db", "functions", "secrets", "link", "login", "projects", "deploy", "migration"],
};
const GH_READ = new Set(["view", "list", "status", "diff", "checks", "search"]);

export function decideBash(command) {
  if (typeof command !== "string" || !command.trim()) return null;
  const segments = command.split(/\|\||&&|[;&|\n]|\$\(|`|\(|\)/);
  for (const seg of segments) {
    const words = seg.trim().split(/\s+/).filter(Boolean);
    for (let i = 0; i < words.length; i++) {
      const w = words[i].replace(/^["']|["']$/g, "").split("/").pop();
      const rest = words.slice(i + 1);
      let hit = null;
      if (NET.has(w)) hit = w;
      else if (SUB[w]) {
        const sub = rest.find((r) => SUB[w].includes(r));
        if (sub) hit = `${w} ${sub}`;
      } else if (w === "gh") hit = ghWrites(rest);
      if (hit) return ask(`Marketing team gate: this shell command runs "${hit}", which can reach the network, an authenticated account, or publish. Confirm only if you intend it.`);
    }
  }
  return null;
}

function ghWrites(args) {
  const pos = args.filter((a) => !a.startsWith("-"));
  if (pos[0] === "api") {
    const m = args.findIndex((a) => a === "-X" || a === "--method");
    const method = (m >= 0 ? args[m + 1] : args.find((a) => /^(-X|--method=)/.test(a))?.replace(/^(-X|--method=)/, "")) || "";
    const hasBody = args.some((a) => /^(-f|-F|--field|--raw-field|--input)(=|$)/.test(a) || /^-[fF]./.test(a));
    if ((method && method.toUpperCase() !== "GET") || hasBody) return "gh api (write)";
    if (/graphql/.test(args.join(" ")) && /mutation/.test(args.join(" "))) return "gh api graphql mutation";
    return null;
  }
  if (pos[0] === "auth" && pos[1] === "status") return null;
  if (pos[0] === "search") return null;
  if (pos.length >= 2 && GH_READ.has(pos[1])) return null;
  return `gh ${pos.slice(0, 2).join(" ")}`.trim();
}

export function decide(toolName, toolInput) {
  if (typeof toolName !== "string") return null;
  if (toolName.startsWith("mcp__")) return decideMcp(toolName);
  if (toolName === "Bash") return decideBash(toolInput?.command);
  return null;
}

function ask(reason) {
  return { hookSpecificOutput: { hookEventName: "PreToolUse", permissionDecision: "ask", permissionDecisionReason: reason } };
}

if (process.env.MARKETING_TEAM_GATE !== "off") {
  let input = "";
  process.stdin.on("data", (d) => (input += d));
  process.stdin.on("end", () => {
    try {
      const data = JSON.parse(input);
      const result = decide(data.tool_name, data.tool_input);
      if (result) process.stdout.write(JSON.stringify(result));
    } catch {
      // Silent: Claude Code's normal permission flow applies.
    }
    process.exit(0);
  });
}
