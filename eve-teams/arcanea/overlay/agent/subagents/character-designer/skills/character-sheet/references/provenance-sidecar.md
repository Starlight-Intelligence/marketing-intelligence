# Provenance sidecar

Every image file `name.ext` has a sibling `name.ext.vis.provenance.json`. No sidecar, no production use.

```json
{
  "asset": "name.ext",
  "sha256": "hex digest of the image file",
  "created_at": "ISO 8601 timestamp",
  "author": "the person or seat that made or commissioned it",
  "method": "generated | painted | rendered | photographed | edited",
  "generator": {
    "tool": "tool name, or null when not generated",
    "model": "model name and version, or null",
    "seed": "seed, or null",
    "prompt": "full prompt, or null",
    "negative_prompt": "full negative prompt, or null"
  },
  "references": [
    { "path": "reference file or URL", "license": "license or permission", "sidecar": "its own sidecar path" }
  ],
  "canon_refs": ["canon headings this image depicts"],
  "derived_from_mark": "vector master file and version, when the image shows the mark",
  "reviews": {
    "canon_keeper": "CLEAR or BLOCK, with date",
    "visual_director": "score out of 30, with date"
  }
}
```

Fill every field. A field that genuinely doesn't apply is `null`, never left out.
