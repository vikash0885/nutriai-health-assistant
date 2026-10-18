import json
import logging
from typing import Dict, List, Optional
from app.core.config import settings

logger = logging.getLogger("nutriai.gemini")

SAFETY_SYSTEM_INSTRUCTION = """You are NutriAI, an AI-powered nutrition, health, and lifestyle assistant.
Tagline: Eat Smart, Live Healthy.
Your purpose is to provide personalized, culturally attuned nutrition advice, Indian and global meal ideas, habit observations, and digestive wellness tips.

CRITICAL MEDICAL & SAFETY RULES:
1. You are a wellness education and tracking platform, NOT a medical doctor.
2. NEVER claim to diagnose, treat, prevent, or cure any disease or medical condition.
3. NEVER state that a food definitely caused a symptom; explain it as an observed association or correlation from the user's self-reported diary.
4. Respect dietary preferences (vegetarian, vegan, eggetarian, Jain, non-vegetarian) and STRICTLY adhere to food allergies and dietary restrictions. NEVER suggest foods containing user allergens.
5. Emphasize whole, minimally processed foods, adequate dietary fiber, hydration, and mindful eating.
6. Provide affordable, practical suggestions, especially honoring Indian regional diets (e.g. roti, dal, sabzi, curd, poha, idli, seasonal fruits).
7. For persistent, severe, or worsening symptoms (intense abdominal pain, unexplained rapid weight loss, severe acid reflux, persistent vomiting), explicitly advise consulting a qualified physician or gastroenterologist.
8. Support seamless bilingual communication: respond fluently in English, Hindi, or conversational Hinglish matching the user's language style.
"""


class GeminiService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model = settings.GEMINI_MODEL or "gemini-2.5-flash"
        self._client = None
        self._initialize_client()

    def _initialize_client(self):
        """Initializes official google-genai client if API key is present."""
        if self.api_key and len(self.api_key.strip()) > 5:
            try:
                from google import genai
                self._client = genai.Client(api_key=self.api_key.strip())
                logger.info("Gemini official SDK client initialized successfully with model: %s", self.model)
            except Exception as e:
                logger.error("Failed to initialize Gemini Client: %s", str(e))
                self._client = None
        else:
            self._client = None

    def is_configured(self) -> bool:
        """Check if Gemini API is configured and ready."""
        return self._client is not None

    async def generate_text(self, prompt: str, system_instruction: Optional[str] = None) -> str:
        """General text generation with fallback."""
        if not self.is_configured():
            return (
                "Google Gemini API key is not configured. Please add GEMINI_API_KEY to your "
                ".env file to enable intelligent conversational responses. In the meantime, you can "
                "continue using all manual food logging, nutrition analysis, and water/exercise tracking."
            )

        try:
            from google.genai import types

            config = types.GenerateContentConfig(
                system_instruction=system_instruction or SAFETY_SYSTEM_INSTRUCTION,
                temperature=0.7,
                max_output_tokens=1500,
            )

            response = self._client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=config,
            )
            return response.text or "I was unable to generate a response at this time."
        except Exception as e:
            logger.error("Gemini API error in generate_text: %s", str(e))
            return f"Gemini API temporarily unavailable: {str(e)}"

    async def analyze_food_image(self, image_bytes: bytes, mime_type: str = "image/jpeg") -> List[Dict]:
        """
        Multimodal image analysis to identify likely food items in an uploaded photo.
        Returns a list of identified dishes with estimated portion sizes and confidence.
        """
        if not self.is_configured():
            return [
                {
                    "food_name": "Roti / Chapati (Whole Wheat)",
                    "estimated_portion": "2 medium rotis",
                    "confidence": "Demo/Offline",
                    "category": "Grains & Breads",
                    "note": "Gemini API key not configured. Showing sample detection from photo. You can select or search your meal manually.",
                }
            ]

        try:
            from google.genai import types

            prompt = """Analyze this food image carefully.
Identify all the individual food items or dishes present on the plate or in the meal (especially recognizing Indian dishes such as roti, dal, sabzi, rice, paneer, raita, salad, dosa, idli, etc.).

Return a strictly valid JSON array of objects with the following keys for each identified item:
- "food_name": Standard recognized food name in English (e.g. "Roti / Chapati (Whole Wheat)", "Dal Tadka", "Steamed White Rice", "Palak Paneer", "Cucumber Salad")
- "estimated_portion": Estimated portion visible (e.g., "2 medium rotis", "1 katori (approx 150g)", "1 bowl")
- "confidence": "high", "medium", or "low"
- "category": Meal category (e.g., "Grains & Breads", "Dal & Pulses", "Vegetables & Curries", "Dairy", "Fruits")
- "note": Brief observation about cooking style, visible oil, or ingredients.

Return ONLY the raw JSON array without markdown backticks.
"""

            part = types.Part.from_bytes(data=image_bytes, mime_type=mime_type)
            response = self._client.models.generate_content(
                model=self.model,
                contents=[part, prompt],
                config=types.GenerateContentConfig(
                    system_instruction=SAFETY_SYSTEM_INSTRUCTION,
                    temperature=0.2,
                ),
            )

            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            detected = json.loads(text)
            if isinstance(detected, list):
                return detected
            elif isinstance(detected, dict) and "items" in detected:
                return detected["items"]
            return []
        except Exception as e:
            logger.error("Error analyzing food image with Gemini: %s", str(e))
            return [
                {
                    "food_name": "Manual Entry Needed",
                    "estimated_portion": "1 serving",
                    "confidence": "low",
                    "category": "Other",
                    "note": f"Could not automatically detect food: {str(e)}. Please use manual food search.",
                }
            ]

    async def generate_smart_meal_plan(
        self,
        dietary_preference: str,
        fitness_goal: str,
        target_calories: float,
        target_protein_g: float,
        allergies: List[str],
        budget_inr: Optional[float] = 250.0,
        custom_requests: Optional[str] = None,
    ) -> Dict:
        """
        Generates a balanced, culturally appropriate daily Indian/global meal plan
        respecting user dietary choices, allergies, budget, and caloric targets.
        """
        if not self.is_configured():
            # Graceful offline deterministic fallback meal plan
            return {
                "title": f"Nutritious {dietary_preference.capitalize()} Meal Plan",
                "notes": "Generated with NutriAI balanced baseline (Offline Mode: configure GEMINI_API_KEY for dynamic AI plans).",
                "total_calories": target_calories,
                "total_protein_g": target_protein_g,
                "items": [
                    {
                        "meal_category": "breakfast",
                        "food_name": "Poha with Veggies & Peanuts" if "peanuts" not in allergies else "Besan Chilla with Mint Chutney",
                        "portion_description": "1 medium plate (180g)",
                        "estimated_calories": 280.0,
                        "protein_g": 8.0,
                        "carbs_g": 42.0,
                        "fat_g": 8.5,
                        "recipe_instructions": "Cook flaked rice with mustard seeds, turmeric, green chillies, curry leaves, onions, and peas. Garnish with coriander.",
                        "ingredients": ["Poha", "Onion", "Green Peas", "Mustard Seeds", "Curry Leaves", "Turmeric"],
                    },
                    {
                        "meal_category": "lunch",
                        "food_name": "Whole Wheat Roti, Moong Dal & Bhindi Masala with Curd",
                        "portion_description": "2 Rotis + 1 katori Dal + 1 katori Bhindi + 1 katori Dahi",
                        "estimated_calories": 520.0,
                        "protein_g": 22.0,
                        "carbs_g": 68.0,
                        "fat_g": 14.0,
                        "recipe_instructions": "Serve 2 whole wheat rotis alongside tempered yellow moong dal, lightly spiced stir-fried okra, and fresh home-set curd.",
                        "ingredients": ["Whole Wheat Flour", "Yellow Moong Dal", "Bhindi (Okra)", "Curd / Dahi", "Cumin", "Tomatoes"],
                    },
                    {
                        "meal_category": "snack",
                        "food_name": "Roasted Chana & Masala Buttermilk",
                        "portion_description": "1 handful roasted chana (30g) + 1 glass chaas (250ml)",
                        "estimated_calories": 180.0,
                        "protein_g": 9.5,
                        "carbs_g": 22.0,
                        "fat_g": 4.5,
                        "recipe_instructions": "Enjoy dry roasted chickpeas with a chilled glass of cumin-mint spiced buttermilk.",
                        "ingredients": ["Roasted Chana", "Chaas / Buttermilk", "Roasted Cumin", "Black Salt"],
                    },
                    {
                        "meal_category": "dinner",
                        "food_name": "Vegetable Khichdi with Cucumber Salad",
                        "portion_description": "1 bowl khichdi (250g) + 1 bowl cucumber salad (120g)",
                        "estimated_calories": 360.0,
                        "protein_g": 14.0,
                        "carbs_g": 58.0,
                        "fat_g": 7.0,
                        "recipe_instructions": "Pressure cook rice and split green moong dal with carrots, peas, and turmeric. Pair with sliced cucumber and lemon juice.",
                        "ingredients": ["Rice", "Split Moong Dal", "Carrots", "Ghee (1 tsp)", "Cucumber", "Lemon"],
                    },
                ],
            }

        try:
            from google.genai import types

            prompt = f"""Create a realistic, delicious, affordable daily Indian meal plan.
User Profile:
- Dietary Preference: {dietary_preference}
- Fitness Goal: {fitness_goal}
- Target Daily Calories: ~{target_calories} kcal
- Target Daily Protein: ~{target_protein_g} grams
- Allergies/Restrictions: {', '.join(allergies) if allergies else 'None'}
- Approximate Daily Food Budget: ₹{budget_inr or 250} INR
- Special Requests: {custom_requests or 'Standard balanced home-cooked meals'}

STRICT ALLERGY RULE: Do NOT include any ingredient that conflicts with: {', '.join(allergies) if allergies else 'None'}.

Return ONLY a valid JSON object matching this schema:
{{
  "title": "Descriptive plan title",
  "notes": "Short helpful tip regarding hydration and meal timing",
  "total_calories": number,
  "total_protein_g": number,
  "items": [
    {{
      "meal_category": "breakfast",
      "food_name": "Name of dish",
      "portion_description": "e.g. 2 chapatis + 1 katori dal",
      "estimated_calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "recipe_instructions": "1-2 sentence quick preparation note",
      "ingredients": ["ingredient 1", "ingredient 2"]
    }},
    {{
      "meal_category": "lunch", ...
    }},
    {{
      "meal_category": "snack", ...
    }},
    {{
      "meal_category": "dinner", ...
    }}
  ]
}}
Do NOT wrap in markdown formatting.
"""

            response = self._client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SAFETY_SYSTEM_INSTRUCTION,
                    temperature=0.4,
                ),
            )

            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            text = text.strip()

            return json.loads(text)
        except Exception as e:
            logger.error("Error generating meal plan with Gemini: %s", str(e))
            # Return safe fallback
            return {
                "title": f"Balanced {dietary_preference.capitalize()} Meal Plan",
                "notes": f"Generated default plan (AI service fallback: {str(e)})",
                "total_calories": target_calories,
                "total_protein_g": target_protein_g,
                "items": [
                    {
                        "meal_category": "breakfast",
                        "food_name": "Besan Chilla with Mint Chutney",
                        "portion_description": "2 chillas (140g)",
                        "estimated_calories": 240.0,
                        "protein_g": 13.0,
                        "carbs_g": 31.0,
                        "fat_g": 7.0,
                        "recipe_instructions": "Mix gram flour with chopped onion, coriander, and spices. Cook on a skillet with 1 tsp oil.",
                        "ingredients": ["Besan (Gram flour)", "Onion", "Coriander", "Cumin", "Oil"],
                    },
                    {
                        "meal_category": "lunch",
                        "food_name": "Roti, Dal Tadka, Lauki Sabzi & Curd",
                        "portion_description": "2 Rotis + 1 katori Dal + 1 katori Lauki + 1 katori Dahi",
                        "estimated_calories": 480.0,
                        "protein_g": 20.0,
                        "carbs_g": 65.0,
                        "fat_g": 12.0,
                        "recipe_instructions": "Standard balanced homestyle Indian thali.",
                        "ingredients": ["Whole Wheat Flour", "Toor Dal", "Lauki", "Curd", "Spices"],
                    },
                    {
                        "meal_category": "snack",
                        "food_name": "Sprouted Moong Chaat with Lemon",
                        "portion_description": "1 katori (120g)",
                        "estimated_calories": 110.0,
                        "protein_g": 8.0,
                        "carbs_g": 17.0,
                        "fat_g": 1.0,
                        "recipe_instructions": "Toss boiled sprouted moong with tomatoes, onion, lemon juice, and chaat masala.",
                        "ingredients": ["Sprouted Moong", "Tomato", "Lemon", "Chaat Masala"],
                    },
                    {
                        "meal_category": "dinner",
                        "food_name": "Vegetable Dalia / Broken Wheat Khichdi",
                        "portion_description": "1 bowl (220g)",
                        "estimated_calories": 320.0,
                        "protein_g": 11.0,
                        "carbs_g": 52.0,
                        "fat_g": 6.0,
                        "recipe_instructions": "Cook dalia with mixed vegetables and mild seasoning.",
                        "ingredients": ["Broken Wheat (Dalia)", "Moong Dal", "Carrots", "Beans"],
                    },
                ],
            }

    async def get_food_alternatives(
        self,
        logged_food: str,
        calories: float,
        protein_g: float,
        carbs_g: float,
        fat_g: float,
        fiber_g: float,
        dietary_preference: str = "vegetarian",
    ) -> List[Dict]:
        """
        'Eat This, Try This' Engine:
        Analyzes a logged meal and recommends nutritious, affordable Indian food alternatives.
        """
        if not self.is_configured():
            return [
                {
                    "original_food": logged_food,
                    "current_nutrients": f"{calories} kcal, {protein_g}g Protein, {fiber_g}g Fiber",
                    "suggested_alternative": "Sprouted Moong Chaat or Roasted Chana",
                    "alternative_nutrients": "~120 kcal, 8-10g Protein, 4g Fiber",
                    "why_better": "Significantly boosts dietary fiber and plant protein while keeping calories controlled and satiety high.",
                    "budget_friendly_note": "Extremely economical and easily available in any local grocery store or pantry.",
                    "portion_tip": "Enjoy 1 katori (100g) as an evening snack instead of deep fried snacks.",
                }
            ]

        try:
            from google.genai import types

            prompt = f"""Suggest 2 practical, culturally familiar, budget-friendly food alternatives or upgrades for the following logged Indian food:
Logged Item: {logged_food}
Nutrients: {calories} kcal, {protein_g}g protein, {carbs_g}g carbs, {fat_g}g fat, {fiber_g}g fiber
Dietary Preference: {dietary_preference}

Do not label the original food as 'evil' or 'unhealthy'. Instead, suggest mindful additions or swaps (e.g. adding curd or sprouts to boost protein, switching from white refined snacks to roasted legumes or seasonal fruit).

Return ONLY a valid JSON array of objects with the keys:
- "original_food"
- "current_nutrients"
- "suggested_alternative"
- "alternative_nutrients"
- "why_better"
- "budget_friendly_note"
- "portion_tip"
"""
            response = self._client.models.generate_content(
                model=self.model,
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=SAFETY_SYSTEM_INSTRUCTION,
                    temperature=0.3,
                ),
            )
            text = response.text.strip()
            if text.startswith("```json"):
                text = text[7:]
            if text.startswith("```"):
                text = text[3:]
            if text.endswith("```"):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            logger.error("Error generating food alternatives: %s", str(e))
            return [
                {
                    "original_food": logged_food,
                    "current_nutrients": f"{calories} kcal, {protein_g}g Protein",
                    "suggested_alternative": "Sprouted Moong Salad with Lemon",
                    "alternative_nutrients": "78 kcal, 6.8g Protein, 4.5g Fiber",
                    "why_better": "Natural protein and fiber booster that aids digestion.",
                    "budget_friendly_note": "Whole moong beans cost under ₹120/kg and expand 3x when sprouted.",
                    "portion_tip": "Pair half a katori with your regular meal.",
                }
            ]

    async def chat_assistant(
        self,
        user_message: str,
        user_context: Dict,
        history: Optional[List[Dict]] = None,
    ) -> str:
        """
        Bilingual Hindi-English conversational AI assistant.
        Uses the authenticated user's actual permitted diary logs and metrics as ground truth.
        """
        if not self.is_configured():
            return (
                "Namaste! The Google Gemini API key is not currently configured in the backend environment. "
                "To activate live AI conversations, please add your `GEMINI_API_KEY` to the `.env` file.\n\n"
                "In the meantime, you can review your live statistics on the Dashboard, log meals in the Food Diary, "
                "and track water and exercise freely!"
            )

        try:
            from google.genai import types

            context_str = json.dumps(user_context, indent=2, default=str)
            system_prompt = f"""{SAFETY_SYSTEM_INSTRUCTION}

AUTHENTICATED USER REAL-TIME RECORD CONTEXT:
The following is verified data retrieved from the user's personal database for today and recent days:
{context_str}

GUIDELINES:
- Base your answers about what the user ate, their calorie/protein totals, water, and symptoms on the verified context above.
- NEVER invent or fabricate diary entries not present in the user context.
- If the user asks what they ate today and nothing is logged, state honestly that no food entries have been logged yet for today.
- Respond in the language used by the user: English, pure Hindi (Devanagari), or conversational Hinglish (Roman Hindi like 'Aapne aaj 45g protein consume kiya hai').
- Always maintain empathy, warmth, and supportive health coaching.
- If user mentions medical red flags (severe chest pain, breathing difficulty, acute severe abdominal pain), direct them to emergency medical care immediately.
"""

            # Build conversational turns
            contents = []
            if history:
                for h in history[-6:]:
                    contents.append(f"{h.get('role', 'user')}: {h.get('content', '')}")
            contents.append(f"User: {user_message}")

            response = self._client.models.generate_content(
                model=self.model,
                contents="\n\n".join(contents),
                config=types.GenerateContentConfig(
                    system_instruction=system_prompt,
                    temperature=0.6,
                    max_output_tokens=1200,
                ),
            )
            return response.text or "I could not generate a response. Please try asking again."
        except Exception as e:
            logger.error("Gemini Assistant error: %s", str(e))
            return f"I encountered a temporary service issue connecting to Gemini: {str(e)}. Please check your connection or try again."


gemini_service = GeminiService()
