"""Run with: python -m unittest discover -s scripts -p 'test_*.py' -v"""
import unittest
from copy import deepcopy
from growth_core import EvidenceError, digest, parse_semrush_csv, score_opportunities, visibility_report, is_domain, wilson

NOW = "2026-10-27T13:00:00+00:00"
EV = {"source": "semrush", "ref": "domain_rank/frankx.ai/us/2026-10", "observed_at": NOW}


class GrowthCoreTests(unittest.TestCase):
    def opportunity(self, oid, hours):
        return {"id": oid, "title": f"Improve {oid}", "impact": 4, "business_fit": 5,
                "confidence": 0.7, "effort_hours": hours, "evidence": [EV]}

    def observation(self, brand, cited_urls, rep="1", available=True):
        return {"engine": "example-engine", "surface": "api", "model": "example-model-v1", "market": "nl",
                "language": "en", "sample_set_id": "intent-set-a", "prompt_id": "p1", "repetition_id": rep,
                "observed_at": NOW, "response_available": available, "brand_mentioned": brand, "cited_urls": cited_urls}

    def test_scoring_sort_and_provenance(self):
        result = score_opportunities({"opportunities": [self.opportunity("slow", 30), self.opportunity("quick", 3)]})
        self.assertEqual([x["id"] for x in result["opportunities"]], ["quick", "slow"])
        self.assertEqual(result["opportunities"][0]["evidence"][0], EV)
        self.assertEqual(len(result["input_sha256"]), 64)

    def test_missing_evidence_fails_closed(self):
        op = self.opportunity("x", 1)
        op["evidence"] = []
        with self.assertRaises(EvidenceError):
            score_opportunities({"opportunities": [op]})

    def test_duplicate_id_fails(self):
        op = self.opportunity("same", 1)
        with self.assertRaises(EvidenceError):
            score_opportunities({"opportunities": [op, deepcopy(op)]})

    def test_nonfinite_or_boolean_scores_rejected(self):
        for value in [float("nan"), float("inf"), True, -1, 999]:
            op = self.opportunity("x", 1)
            op["confidence"] = value
            with self.assertRaises(EvidenceError):
                score_opportunities({"opportunities": [op]})

    def test_domain_matching_avoids_suffix_attack(self):
        self.assertTrue(is_domain("https://docs.example.com/a", "example.com"))
        self.assertFalse(is_domain("https://fakeexample.com", "example.com"))
        self.assertFalse(is_domain("https://example.com.evil.org", "example.com"))
        self.assertFalse(is_domain("file://example.com/private", "example.com"))
        self.assertFalse(is_domain("https://bad example.com/a", "example.com"))

    def test_visibility_distinguishes_mention_and_citation(self):
        rows = [self.observation(True, [], "1"),
                self.observation(False, ["https://docs.example.com/a"], "2"),
                self.observation(False, [], "3", available=False)]
        result = visibility_report({"target_domain": "example.com", "observations": rows})
        c = result["cohorts"][0]
        self.assertEqual((c["n"], c["brand_mentions"], c["cited_responses"]), (2, 1, 1))
        self.assertEqual(result["unavailable_responses"], 1)
        self.assertEqual(c["mention_rate"], 0.5)

    def test_visibility_no_evidence_is_unknown_not_zero(self):
        result = visibility_report({"target_domain": "example.com", "observations": []})
        self.assertEqual(result["cohorts"], [])
        self.assertEqual(result["status"], "no-evaluable-observations")

    def test_duplicate_visibility_rejected(self):
        item = self.observation(False, [])
        with self.assertRaises(EvidenceError):
            visibility_report({"target_domain": "example.com", "observations": [item, item]})

    def test_unaware_timestamp_rejected(self):
        op = self.opportunity("x", 1)
        op["evidence"][0] = {**EV, "observed_at": "2026-10-27T14:00:00"}
        with self.assertRaises(EvidenceError):
            score_opportunities({"opportunities": [op]})

    def test_wilson_small_sample(self):
        lo, hi = wilson(1, 2)
        self.assertTrue(0 <= lo < .5 < hi <= 1)

    def test_semrush_csv_parses_without_claiming_sessions(self):
        csv = "Domain;Rank;Organic Keywords;Organic Traffic\nexample.com;600000;42;115\n"
        result = parse_semrush_csv(csv, "us", NOW)
        self.assertEqual(result["rows"][0]["organic_traffic_estimate"], 115)
        self.assertIn("modeled", result["warning"])

    def test_semrush_missing_columns_rejected(self):
        with self.assertRaises(EvidenceError):
            parse_semrush_csv("Domain;Rank\nexample.com;23", "us", NOW)

    def test_deterministic_hash(self):
        self.assertEqual(digest({"b": 2, "a": 1}), digest({"a": 1, "b": 2}))


if __name__ == "__main__":
    unittest.main()
