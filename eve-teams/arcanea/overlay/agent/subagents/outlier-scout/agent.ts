import { defineAgent } from "eve";

// Subagent: Outlier Scout

/**
 * Subagent runtime configuration.
 *
 * @remarks
 * Scouting reads many pages and keeps few, so it runs on the volume tier, Gemini 3.8 Flash. The
 * judgment about why a piece outperformed is recorded for the voice editor and the analyst, who run
 * on stronger tiers.
 */
export default defineAgent({
  compaction: { thresholdPercent: 0.9 },
  description:
    "Find work by human creators that outperforms its peers and record why. Measures each " +
    "piece against its own creator's baseline or a named peer set, keeps only the clear " +
    "outliers, and writes a record per piece: the link, the metric, the baseline, the multiple, " +
    "the reason it worked, and what would and would not transfer to Arcanea. Excludes " +
    "AI-generated work. Use before planning a format or a campaign, and to refresh the outlier " +
    "references the voice editor compares against. The caller passes the niche, the platforms, " +
    "the formats, and the time window in the message.",
  model: "google/gemini-3.8-flash",
});
