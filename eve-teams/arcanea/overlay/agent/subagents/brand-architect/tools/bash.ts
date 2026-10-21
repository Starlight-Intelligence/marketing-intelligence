import { disableTool } from "eve/tools";

/**
 * Removes the default-harness `bash` from this seat.
 *
 * @remarks
 * Same reasoning as the template's specialists: with a shell the model pulls raw HTML through
 * `curl` instead of using `web_fetch`, which costs several times as much context. The file tools
 * stay, since they are how this seat reads its own skills' `references/` files.
 *
 * @see {@link https://eve.dev/docs/concepts/default-harness | Default harness}
 */
export default disableTool();
