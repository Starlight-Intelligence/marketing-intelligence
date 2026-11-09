/**
 * Repository targets, bounds, and pure helpers for the Starlight tools.
 *
 * @remarks
 * Two tools reach GitHub on behalf of the Arcanea seats: one reads the locked canon file, one
 * opens a ticket for the Foreman software factory. Both take their repository and path from the
 * environment rather than from model input, so a model can't point either tool at a repository it
 * was never meant to touch. This module owns that resolution and the validation behind it, so
 * `tools.ts` stays the interface.
 */

/** Base URL of the GitHub REST API. */
export const GITHUB_API_URL = "https://api.github.com";

/** GitHub REST API version both tools pin in their requests. */
export const GITHUB_API_VERSION = "2022-11-28";

/**
 * Repository the factory tickets land in when `FACTORY_TICKET_REPO` is unset.
 *
 * @defaultValue `"frankxai/arcanea-ai-app"`
 */
export const DEFAULT_FACTORY_TICKET_REPO = "frankxai/arcanea-ai-app";

/**
 * Label every factory ticket carries. The Foreman picks up issues by this label.
 *
 * @defaultValue `"factory"`
 */
export const FACTORY_LABEL = "factory";

/**
 * Repository the canon file is read from when `CANON_REPO` is unset.
 *
 * @defaultValue `"frankxai/arcanea-ai-app"`
 */
export const DEFAULT_CANON_REPO = "frankxai/arcanea-ai-app";

/**
 * Path of the locked canon file when `CANON_PATH` is unset.
 *
 * @defaultValue `".arcanea/lore/CANON_LOCKED.md"`
 */
export const DEFAULT_CANON_PATH = ".arcanea/lore/CANON_LOCKED.md";

/**
 * Bare tool names that publish outside the team and therefore pause for approval.
 *
 * @remarks
 * Mirrors the Typefully connection's list of the same name. A tool that consults this list and
 * finds itself missing refuses to run rather than running ungated, so renaming the tool file
 * without updating the list fails closed.
 */
export const PUBLISH_TOOLS = ["open_factory_ticket"];

/**
 * The seats that can open a factory ticket or read canon, used to attribute a ticket.
 */
export const ARCANEA_SEATS = [
  "lead",
  "canon-keeper",
  "brand-architect",
  "visual-director",
  "character-designer",
  "voice-editor",
  "outlier-scout",
  "performance-analyst",
] as const;

/** Maximum factory ticket title length, in characters. */
export const MAX_TICKET_TITLE_LENGTH = 200;

/** Maximum factory ticket body length, in characters. */
export const MAX_TICKET_BODY_LENGTH = 20_000;

/** Maximum heading length accepted when reading one canon section. */
export const MAX_SECTION_HEADING_LENGTH = 200;

/**
 * Maximum canon text returned in one call, in characters.
 *
 * @remarks
 * Keeps a whole-file read from flooding the caller's context. A caller that hits the cap gets
 * `truncated: true` and should ask for a section by heading instead.
 *
 * @defaultValue 60_000
 */
export const MAX_CANON_LENGTH = 60_000;

const REPO_PATTERN = /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/;
const PATH_PATTERN = /^[A-Za-z0-9._/-]+$/;
const HEADING_PATTERN = /^(#{1,6})\s+(.*)$/;
const LEADING_SLASHES = /^\/+/;

/**
 * Validate an `owner/name` repository slug.
 *
 * @param value - Candidate slug, usually from the environment.
 * @returns The slug when well-formed, otherwise `undefined`.
 */
export const parseRepo = (value: string | undefined): string | undefined => {
  const trimmed = value?.trim();
  return trimmed && REPO_PATTERN.test(trimmed) ? trimmed : undefined;
};

/**
 * Validate a file path inside a repository.
 *
 * @remarks
 * Refuses `..` segments and anything outside a conservative character set, since the path is
 * interpolated into an API URL.
 *
 * @param value - Candidate path, usually from the environment.
 * @returns The path without a leading slash when valid, otherwise `undefined`.
 */
export const parseRepoPath = (
  value: string | undefined
): string | undefined => {
  const trimmed = value?.trim().replace(LEADING_SLASHES, "");
  if (!(trimmed && PATH_PATTERN.test(trimmed))) {
    return;
  }
  return trimmed.split("/").includes("..") ? undefined : trimmed;
};

/**
 * Resolve the factory ticket repository from `FACTORY_TICKET_REPO`.
 *
 * @returns The configured slug, the default when unset, or `undefined` when set but malformed.
 */
export const factoryTicketRepo = (): string | undefined => {
  const configured = process.env.FACTORY_TICKET_REPO;
  return configured === undefined || configured.trim() === ""
    ? DEFAULT_FACTORY_TICKET_REPO
    : parseRepo(configured);
};

/**
 * Resolve the canon repository and file path from `CANON_REPO` and `CANON_PATH`.
 *
 * @returns Both values, defaulted when unset; either is `undefined` when set but malformed.
 */
export const canonSource = (): {
  path: string | undefined;
  repo: string | undefined;
} => {
  const repo = process.env.CANON_REPO;
  const path = process.env.CANON_PATH;
  return {
    path:
      path === undefined || path.trim() === ""
        ? DEFAULT_CANON_PATH
        : parseRepoPath(path),
    repo:
      repo === undefined || repo.trim() === ""
        ? DEFAULT_CANON_REPO
        : parseRepo(repo),
  };
};

/**
 * Build the request headers for a GitHub REST call.
 *
 * @param accept - The media type to request.
 * @param token - A token, when one is configured.
 * @returns Headers with the pinned API version and, when present, the bearer token.
 */
export const githubHeaders = (
  accept: string,
  token: string | undefined
): Record<string, string> => ({
  Accept: accept,
  "X-GitHub-Api-Version": GITHUB_API_VERSION,
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

/**
 * Return one section of a Markdown document by its heading text.
 *
 * @remarks
 * Matches the heading text case-insensitively and exactly, without building a regular expression
 * from the caller's input. The section runs until the next heading at the same or a higher level.
 *
 * @param markdown - The whole document.
 * @param heading - Heading text without the leading `#` marks.
 * @returns The section including its heading, or `undefined` when no heading matches.
 */
export const extractSection = (
  markdown: string,
  heading: string
): string | undefined => {
  const wanted = heading.trim().toLowerCase();
  const lines = markdown.split("\n");
  let start = -1;
  let level = 0;
  for (const [index, line] of lines.entries()) {
    const match = HEADING_PATTERN.exec(line);
    if (!match) {
      continue;
    }
    const depth = match[1]?.length ?? 0;
    if (start === -1) {
      if ((match[2] ?? "").trim().toLowerCase() === wanted) {
        start = index;
        level = depth;
      }
    } else if (depth <= level) {
      return lines.slice(start, index).join("\n").trim();
    }
  }
  return start === -1 ? undefined : lines.slice(start).join("\n").trim();
};
