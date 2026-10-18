from typing import Dict, List


EXERCISE_PRESETS = [
    {
        "title": "Post-Meal Digestion Stroll (Shatapawali)",
        "category": "post_meal_stroll",
        "duration_minutes": 15,
        "intensity": "low",
        "estimated_calories": 45.0,
        "benefits": "A gentle 100-step Indian traditional stroll after meals helps accelerate stomach emptying and supports steady blood sugar levels without causing digestive distress.",
        "safety_notes": "Walk at a relaxed, conversational pace. Do not jog or run immediately after eating.",
        "recommended_time": "15-20 minutes after lunch or dinner",
    },
    {
        "title": "Brisk Morning Walk",
        "category": "walking",
        "duration_minutes": 30,
        "intensity": "moderate",
        "estimated_calories": 130.0,
        "benefits": "Boosts cardiovascular endurance, natural morning energy, and sets a positive circadian rhythm.",
        "safety_notes": "Wear comfortable walking shoes and stay hydrated.",
        "recommended_time": "Morning (fasted or after a light warm drink)",
    },
    {
        "title": "Gentle Full-Body Stretching & Mobility",
        "category": "stretching",
        "duration_minutes": 20,
        "intensity": "low",
        "estimated_calories": 50.0,
        "benefits": "Relieves desk tightness in the neck, spine, and hips while enhancing lymphatic circulation.",
        "safety_notes": "Never bounce into a stretch. Breathe deeply into tight areas.",
        "recommended_time": "Late afternoon or before bed",
    },
    {
        "title": "Beginner Bodyweight Strength Circuit",
        "category": "strength",
        "duration_minutes": 25,
        "intensity": "moderate",
        "estimated_calories": 160.0,
        "benefits": "Builds functional bone density, core strength, and muscle tone (Squats, wall pushups, glute bridges, knee planks).",
        "safety_notes": "Prioritize proper form over speed. Take 60 seconds rest between circuits.",
        "recommended_time": "Late afternoon or evening before dinner",
    },
    {
        "title": "Surya Namaskar & Restorative Yoga",
        "category": "yoga",
        "duration_minutes": 20,
        "intensity": "moderate",
        "estimated_calories": 95.0,
        "benefits": "Traditional 12-step sun salutation enhances spinal flexibility, lung capacity, and mental clarity.",
        "safety_notes": "Avoid extreme backbends if experiencing lower back strain or hernia.",
        "recommended_time": "Early morning",
    },
]


class ExerciseService:
    def get_recommended_routines(self, fitness_goal: str, activity_level: str) -> List[Dict]:
        """Provides tailored exercise recommendations based on user goals."""
        routines = list(EXERCISE_PRESETS)
        if fitness_goal == "muscle_building":
            routines.append({
                "title": "Progressive Dumbbell / Resistance Workout",
                "category": "strength",
                "duration_minutes": 35,
                "intensity": "high",
                "estimated_calories": 210.0,
                "benefits": "Stimulates muscle hypertrophy and metabolic rate.",
                "safety_notes": "Ensure 48-72 hours recovery between same muscle groups.",
                "recommended_time": "Afternoon / Evening",
            })
        return routines

    def estimate_calories_burned(
        self,
        category: str,
        duration_minutes: int,
        weight_kg: float = 65.0,
        intensity: str = "moderate",
    ) -> float:
        """
        Estimates calories burned using standard MET (Metabolic Equivalent of Task) values:
        Calories = MET * Weight(kg) * (Duration / 60)
        """
        met_map = {
            "post_meal_stroll": {"low": 2.5, "moderate": 3.0, "high": 3.3},
            "walking": {"low": 3.0, "moderate": 3.8, "high": 4.5},
            "cardio": {"low": 5.0, "moderate": 7.0, "high": 9.0},
            "strength": {"low": 3.5, "moderate": 5.0, "high": 6.5},
            "yoga": {"low": 2.5, "moderate": 3.2, "high": 4.0},
            "stretching": {"low": 2.3, "moderate": 2.8, "high": 3.2},
            "other": {"low": 3.0, "moderate": 4.0, "high": 5.5},
        }

        category_clean = category.lower()
        if category_clean not in met_map:
            category_clean = "other"

        met = met_map[category_clean].get(intensity.lower(), 3.5)
        calories = met * weight_kg * (duration_minutes / 60.0)
        return round(calories, 1)


exercise_service = ExerciseService()
