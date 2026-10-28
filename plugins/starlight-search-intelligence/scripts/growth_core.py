#!/usr/bin/env python3
"""Starlight Growth Intelligence: deterministic, offline evidence utilities.

No network, cloud credentials, billing, traffic claims, publishing or scheduling.
The CLI operates on explicit JSON/CSV snapshots and prints JSON to stdout.
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import math
import sys
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlparse

MAX_BYTES = 2_000_000
PROVENANCE = {"semrush", "gsc", "analytics", "site-crawl", "ai-observation", "manual", "estimate", "experiment"}


class EvidenceError(ValueError):
    pass


def checked_object(data):
    if not isinstance(data, dict):
        raise EvidenceError("Root must be a JSON object")
    return data


def read_json(path):
    raw = Path(path).read_bytes()
    if len(raw) > MAX_BYTES:
        raise EvidenceError(f"Input exceeds {MAX_BYTES} bytes")
    try:
        return checked_object(json.loads(raw))
    except (json.JSONDecodeError, UnicodeDecodeError) as exc:
        raise EvidenceError(f"Invalid UTF-8 JSON: {exc}") from exc


def digest(data):
    serialized = json.dumps(data, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def require_string(row, key):
    value = row.get(key)
    if not isinstance(value, str) or not value.strip():
        raise EvidenceError(f"{key} must be a nonblank string")
    return value.strip()


def bounded_number(value, field, minimum, maximum):
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise EvidenceError(f"{field} must be a number")
    if not math.isfinite(value) or not minimum <= value <= maximum:
        raise EvidenceError(f"{field} must be between {minimum} and {maximum}")
    return float(value)


def parse_date(s):
    try:
        # Require a timezone-aware ISO 8601 timestamp; no guesses from local time.
        d = datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError as e:
        raise EvidenceError(f"Invalid observed_at ISO timestamp: {s}") from e
    if d.tzinfo is None or d.utcoffset() is None:
        raise EvidenceError("observed_at requires UTC offset")
    return d.astimezone(timezone.utc).isoformat()


def hostname(value):
    if not isinstance(value, str) or not value:
        return None
    try:
        parsed = urlparse(value if "://" in value else "https://" + value)
        if parsed.scheme not in {"https", "http"} or not parsed.netloc:
            return None
        host = (parsed.hostname or "").lower().rstrip(".")
        if not host or any(c.isspace() for c in host) or "." not in host:
            return None
        return host
    except ValueError:
        return None

def is_domain(url, domain):
    host, target = hostname(url), hostname(domain)
    return bool(host and target and (host == target or host.endswith("." + target)))


def require_evidence(row):
    evidence = row.get("evidence", [])
    if not isinstance(evidence, list) or not evidence:
        raise EvidenceError("evidence requires a nonempty list")
    for ev in evidence:
        if not isinstance(ev, dict) or ev.get("source") not in PROVENANCE:
            raise EvidenceError(f"evidence.source must be one of {sorted(PROVENANCE)}")
        require_string(ev, "ref")
        parse_date(require_string(ev, "observed_at"))
    return evidence


def score_opportunities(payload):
    """Heuristic ordering only; never an ROI prediction."""
    checked_object(payload)
    opportunities = payload.get("opportunities")
    if not isinstance(opportunities, list):
        raise EvidenceError("opportunities must be a list")
    results, ids = [], set()
    for row in opportunities:
        if not isinstance(row, dict):
            raise EvidenceError("opportunity must be an object")
        oid = require_string(row, "id")
        if oid in ids:
            raise EvidenceError(f"duplicate opportunity id: {oid}")
        ids.add(oid)
        title = require_string(row, "title")
        impact = bounded_number(row.get("impact"), "impact", 0, 5)
        fit = bounded_number(row.get("business_fit"), "business_fit", 0, 5)
        confidence = bounded_number(row.get("confidence"), "confidence", 0, 1)
        hours = bounded_number(row.get("effort_hours"), "effort_hours", 0, 10000)
        evidence = require_evidence(row)
        # This is a prioritisation utility, not a conversion / ranking predictor.
        priority = round((impact * fit * confidence) / (1 + hours / 8), 3)
        results.append({"id": oid, "title": title, "priority_index": priority,
                        "impact": impact, "business_fit": fit, "confidence": confidence,
                        "effort_hours": hours, "evidence_count": len(evidence),
                        "evidence": evidence, "measurement_status": "heuristic-not-revenue"})
    results.sort(key=lambda r: (-r["priority_index"], r["id"]))
    return {"schema": "starlight.growth.opportunities.v1", "scoring_model":
            "(impact[0..5] * business_fit[0..5] * confidence[0..1]) / (1 + effort_hours / 8)",
            "input_sha256": digest(payload), "count": len(results), "opportunities": results,
            "warning": "Scores are relative analyst heuristics, not measured traffic, sales or ROI."}


def wilson(success, n):
    if not n:
        return None
    z = 1.959963984540054
    p = success / n
    denom = 1 + z * z / n
    midpoint = (p + z * z / (2 * n)) / denom
    half = z * math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denom
    return [round(max(0, midpoint - half), 4), round(min(1, midpoint + half), 4)]


def visibility_report(payload):
    checked_object(payload)
    target = require_string(payload, "target_domain")
    if not hostname(target):
        raise EvidenceError("Invalid target_domain")
    observations = payload.get("observations")
    if not isinstance(observations, list):
        raise EvidenceError("observations must be a list")
    grouped = defaultdict(list)
    seen = set()
    skipped = 0
    for row in observations:
        if not isinstance(row, dict):
            raise EvidenceError("observation must be an object")
        fields = ("engine", "surface", "model", "market", "language", "sample_set_id", "prompt_id", "observed_at", "repetition_id")
        values = [require_string(row, key) for key in fields]
        values[7] = parse_date(values[7])
        identity = tuple(values)
        if identity in seen:
            raise EvidenceError("Duplicate observation identity (add unique repetition_id/time)")
        seen.add(identity)
        available = row.get("response_available")
        if not isinstance(available, bool):
            raise EvidenceError("response_available must be boolean")
        if not available:
            skipped += 1
            continue
        mentioned = row.get("brand_mentioned")
        if not isinstance(mentioned, bool):
            raise EvidenceError("brand_mentioned must be boolean when response_available=true")
        urls = row.get("cited_urls")
        if not isinstance(urls, list) or any(not isinstance(u, str) for u in urls):
            raise EvidenceError("cited_urls must be a list of URL strings")
        # Reject ambiguous invalid values rather than quietly dropping evidence.
        if any(not hostname(u) for u in urls):
            raise EvidenceError("cited_urls contains invalid URL")
        group_key = tuple(values[i] for i in (0, 1, 2, 3, 4, 5))
        grouped[group_key].append({"mentioned": mentioned, "cited": any(is_domain(u, target) for u in urls)})
    cohorts = []
    for key, rows in sorted(grouped.items()):
        n = len(rows)
        m = sum(r["mentioned"] for r in rows)
        c = sum(r["cited"] for r in rows)
        cohorts.append({"engine": key[0], "surface": key[1], "model": key[2], "market": key[3],
                        "language": key[4], "sample_set_id": key[5], "n": n,
                        "brand_mentions": m, "cited_responses": c,
                        "mention_rate": round(m / n, 4), "citation_rate": round(c / n, 4),
                        "mention_wilson_95": wilson(m, n), "citation_wilson_95": wilson(c, n)})
    return {"schema": "starlight.growth.visibility.v1", "input_sha256": digest(payload),
            "target_domain": hostname(target), "total_observations": len(observations),
            "unavailable_responses": skipped, "cohorts": cohorts, "status": "observed-sample" if cohorts else "no-evaluable-observations",
            "warnings": ["Not a platform-wide search share estimate; rates describe only the sampled prompts and surfaces.",
                         "Compare only matched model, surface, prompt set, market, language and collection policy.",
                         "Citations (URLs) and brand mentions are separate outcomes; do not combine them."]}


def parse_semrush_csv(csv_text, database, observed_at):
    """Parse Semrush domain_rank CSV export only; avoid changing the underlying estimates."""
    if not csv_text.strip():
        raise EvidenceError("Empty Semrush CSV")
    parse_date(observed_at)
    if not isinstance(database, str) or not database.strip():
        raise EvidenceError("database is required")
    reader = csv.DictReader(io.StringIO(csv_text), delimiter=";")
    expected = {"Domain", "Rank", "Organic Keywords", "Organic Traffic"}
    if not reader.fieldnames or not expected.issubset(set(reader.fieldnames)):
        raise EvidenceError("Semrush domain_rank CSV headers required")
    rows = []
    for rec in reader:
        domain = rec["Domain"].strip()
        if not hostname(domain):
            raise EvidenceError("invalid domain in rank CSV")
        parsed = {"domain": domain, "database": database, "observed_at": observed_at,
                  "source": "semrush", "report": "domain_rank", "raw": dict(rec)}
        for column, name in [("Rank", "rank"), ("Organic Keywords", "organic_keywords"),
                             ("Organic Traffic", "organic_traffic_estimate")]:
            try:
                parsed[name] = int(rec[column].strip())
                if parsed[name] < 0:
                    raise ValueError("negative")
            except (ValueError, TypeError, AttributeError) as exc:
                raise EvidenceError(f"Invalid integer in {column}") from exc
        rows.append(parsed)
    if not rows:
        raise EvidenceError("No Semrush report rows")
    return {"schema": "starlight.growth.semrush-rank.v1", "input_sha256": hashlib.sha256(csv_text.encode()).hexdigest(),
            "count": len(rows), "rows": rows,
            "warning": "Semrush modeled regional organic traffic, not first-party sessions; respect provider licensing."}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="action", required=True)
    s = sub.add_parser("score", help="Sort evidence-backed growth opportunities from JSON")
    s.add_argument("input", help="Local JSON path")
    v = sub.add_parser("visibility", help="Calculate sample observation rates and Wilson intervals")
    v.add_argument("input", help="Local JSON path")
    e = sub.add_parser("semrush-rank", help="Normalize an existing Semrush domain_rank CSV")
    e.add_argument("input", help="Local CSV path")
    e.add_argument("--database", required=True, help="Explicit region, e.g. us or nl")
    e.add_argument("--observed-at", required=True, help="Timestamp with timezone")
    args = parser.parse_args(argv)
    try:
        if args.action == "score":
            result = score_opportunities(read_json(args.input))
        elif args.action == "visibility":
            result = visibility_report(read_json(args.input))
        else:
            raw = Path(args.input).read_bytes()
            if len(raw) > MAX_BYTES:
                raise EvidenceError("CSV too large")
            result = parse_semrush_csv(raw.decode("utf-8-sig"), args.database, args.observed_at)
    except (EvidenceError, UnicodeDecodeError, OSError) as exc:
        print(json.dumps({"error": str(exc), "status": "invalid-input"}), file=sys.stderr)
        return 2
    print(json.dumps(result, sort_keys=True, ensure_ascii=False, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
