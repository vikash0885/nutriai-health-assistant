from datetime import datetime, timezone
from typing import Dict, List


class HabitInsightsService:
    def analyze_habits(
        self,
        daily_summaries: List[Dict],
        total_foods_logged: int,
        water_logs: List[Dict],
        exercise_logs: List[Dict],
    ) -> List[Dict]:
        """
        Analyzes logged data to identify evidence-based habit patterns.
        Always relies on factual counts from the user's records.
        """
        insights = []

        if len(daily_summaries) < 2:
            return [
                {
                    "insight_type": "habit_pattern",
                    "title": "Start Building Your Habit Baseline",
                    "description": "Log your meals, water, and activities consistently for 3-5 days to unlock personalized habit insights and trends.",
                    "actionable_tip": "Try logging at least your breakfast and lunch today!",
                    "confidence": "baseline",
                    "supporting_records_count": total_foods_logged,
                    "medical_disclaimer": "NutriAI uses evidence-based wellness principles and does not predict disease.",
                }
            ]

        # 1. Fiber Intake Habit Check
        days_with_fiber = [d for d in daily_summaries if d.get("total_fiber_g", 0) > 0]
        if days_with_fiber:
            avg_fiber = sum(d.get("total_fiber_g", 0) for d in days_with_fiber) / len(days_with_fiber)
            if avg_fiber < 20.0:
                insights.append({
                    "insight_type": "habit_pattern",
                    "title": "Fiber Intake Below Recommended 25-30g",
                    "description": f"Across {len(days_with_fiber)} logged days, your average daily fiber intake is {round(avg_fiber, 1)}g (recommended benchmark is 25-30g for optimal gut motility).",
                    "actionable_tip": "Incorporate a handful of roasted chana, a bowl of papaya or guava, or sprouted moong into your daily routine.",
                    "confidence": "moderate",
                    "supporting_records_count": len(days_with_fiber),
                    "medical_disclaimer": "Dietary fiber supports digestive health; individual fiber tolerance varies.",
                })
            else:
                insights.append({
                    "insight_type": "habit_pattern",
                    "title": "Excellent Dietary Fiber Consistency",
                    "description": f"Great job! Your average fiber intake is {round(avg_fiber, 1)}g/day, which meets healthy digestive wellness guidelines.",
                    "actionable_tip": "Keep enjoying your whole grains, legumes, and vegetable variety.",
                    "confidence": "high",
                    "supporting_records_count": len(days_with_fiber),
                    "medical_disclaimer": "Wellness tracking observation.",
                })

        # 2. Hydration Habit Check
        if water_logs:
            total_water = sum(w.get("amount_ml", 0) for w in water_logs)
            avg_water = total_water / max(1, len(daily_summaries))
            if avg_water < 1800:
                insights.append({
                    "insight_type": "habit_pattern",
                    "title": "Hydration Habit: Opportunity to Increase Fluid Intake",
                    "description": f"You average approximately {int(avg_water)} ml of water daily based on your logs. For most adults, 2000-2500 ml is a balanced target.",
                    "actionable_tip": "Keep a 750ml water bottle at your workspace and sip a glass of water before each meal.",
                    "confidence": "moderate",
                    "supporting_records_count": len(water_logs),
                    "medical_disclaimer": "Fluid needs depend on climate, body size, and any physician-prescribed fluid restrictions.",
                })

        # 3. Physical Activity & Digestion Stroll Check
        post_meal_walks = [
            e for e in exercise_logs
            if "stroll" in e.get("activity_category", "").lower() or "walk" in e.get("activity_name", "").lower()
        ]
        if post_meal_walks:
            insights.append({
                "insight_type": "habit_pattern",
                "title": "Post-Meal Gentle Walking Habit",
                "description": f"You have logged {len(post_meal_walks)} light post-meal walks. Gentle 10-15 minute walking aids postprandial glycemic response and gastrointestinal motility.",
                "actionable_tip": "Continue this relaxing routine after dinner when possible.",
                "confidence": "high",
                "supporting_records_count": len(post_meal_walks),
                "medical_disclaimer": "Gentle movement supports digestion; avoid strenuous workouts immediately following heavy meals.",
            })

        return insights


habit_service = HabitInsightsService()
