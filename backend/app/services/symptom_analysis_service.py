from datetime import datetime, timedelta, timezone
from typing import Dict, List, Optional
from collections import defaultdict
from app.services.gemini_service import gemini_service


class SymptomAnalysisService:
    def analyze_patterns(
        self,
        food_entries: List[Dict],
        symptom_logs: List[Dict],
    ) -> List[Dict]:
        """
        Deterministic Python pattern mining:
        Finds temporal correlations between foods consumed and symptoms recorded within 0.5 to 6 hours.
        Calculates:
        - Co-occurrence frequency
        - Total times the food was consumed
        - Relative occurrence rate
        - Average onset lag (in hours)
        """
        if not symptom_logs or not food_entries:
            return []

        # Map each symptom to candidate preceding meals (consumed between 30 min and 6 hours before)
        associations = defaultdict(lambda: {"count": 0, "symptoms": set(), "lags_minutes": [], "dates": []})
        food_consumption_counts = defaultdict(int)

        # Count total times each food was eaten
        for f in food_entries:
            name = f["food_name"]
            food_consumption_counts[name] += 1

        for s in symptom_logs:
            s_time = s["logged_at"]
            if isinstance(s_time, str):
                s_time = datetime.fromisoformat(s_time.replace("Z", "+00:00"))
            if s_time.tzinfo is None:
                s_time = s_time.replace(tzinfo=timezone.utc)

            s_type = s["symptom_type"].lower()

            for f in food_entries:
                f_time = f["logged_at"]
                if isinstance(f_time, str):
                    f_time = datetime.fromisoformat(f_time.replace("Z", "+00:00"))
                if f_time.tzinfo is None:
                    f_time = f_time.replace(tzinfo=timezone.utc)

                time_diff = (s_time - f_time).total_seconds() / 60.0  # minutes

                # Look for meals within 20 minutes to 360 minutes (6 hours) prior to symptom
                if 20 <= time_diff <= 360:
                    key = (f["food_name"], s_type)
                    associations[key]["count"] += 1
                    associations[key]["lags_minutes"].append(time_diff)
                    associations[key]["dates"].append(s_time)

        patterns = []
        for (food_name, symptom_type), data in associations.items():
            count = data["count"]
            total_eaten = food_consumption_counts.get(food_name, count)

            # Require at least 2 co-occurrences to flag a pattern
            if count >= 2:
                rate = round((count / max(1, total_eaten)) * 100, 1)
                avg_lag_hours = round(sum(data["lags_minutes"]) / len(data["lags_minutes"]) / 60.0, 1)
                
                # Assign confidence
                if count >= 4 and rate >= 60.0:
                    confidence = "high"
                elif count >= 3:
                    confidence = "moderate"
                else:
                    confidence = "low"

                patterns.append({
                    "food_name": food_name,
                    "symptom_type": symptom_type.capitalize(),
                    "frequency": count,
                    "total_food_consumed_count": total_eaten,
                    "association_percentage": rate,
                    "avg_lag_hours": avg_lag_hours,
                    "confidence": confidence,
                    "first_date": min(data["dates"]).strftime("%Y-%m-%d"),
                    "last_date": max(data["dates"]).strftime("%Y-%m-%d"),
                })

        # Sort patterns by frequency and confidence
        patterns.sort(key=lambda x: (x["frequency"], x["association_percentage"]), reverse=True)
        return patterns

    async def generate_insight_descriptions(self, patterns: List[Dict]) -> List[Dict]:
        """
        Takes deterministic patterns and uses Gemini to craft clear, reassuring,
        non-alarmist explanations emphasizing personal observation, not medical diagnosis.
        """
        results = []
        for p in patterns:
            base_desc = (
                f"Your diary contains {p['frequency']} recorded instances of {p['symptom_type']} "
                f"within {p['avg_lag_hours']} hours of consuming {p['food_name']} "
                f"(out of {p['total_food_consumed_count']} recorded meals with this food). "
                f"This indicates a possible association in your self-reported logs, but is not clinical proof of causation."
            )

            tip = (
                f"Consider monitoring portion sizes of {p['food_name']}, keeping a closer log of cooking oils or spices used, "
                f"or having a light 10-minute walk after the meal."
            )

            # If Gemini is configured, enhance explanation gently
            if gemini_service.is_configured():
                try:
                    prompt = f"""Explain this verified diary pattern in 2 short, warm, empowering sentences:
Food: {p['food_name']}
Symptom: {p['symptom_type']}
Frequency: {p['frequency']} times
Average onset: {p['avg_lag_hours']} hours after meal
Rule: State clearly that this is an observed pattern in their logs, not medical proof or a diagnosed allergy. Suggest a practical tracking step."""
                    enhanced = await gemini_service.generate_text(prompt)
                    if enhanced and "Gemini API" not in enhanced:
                        base_desc = enhanced.strip()
                except Exception:
                    pass

            results.append({
                "insight_type": "food_symptom_association",
                "title": f"Possible Association: {p['food_name']} & {p['symptom_type']}",
                "food_name": p["food_name"],
                "symptom_type": p["symptom_type"],
                "frequency": p["frequency"],
                "confidence": p["confidence"],
                "supporting_records_count": p["frequency"],
                "description": base_desc,
                "actionable_tip": tip,
                "medical_disclaimer": (
                    "This observation reflects self-reported diary correlation only. Many factors including stress, "
                    "eating pace, hydration, and cooking ingredients influence digestion. Consult a doctor for chronic symptoms."
                ),
            })

        return results


symptom_analysis_service = SymptomAnalysisService()
