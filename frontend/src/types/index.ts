export interface User {
  id: number;
  email: string;
  is_active: boolean;
  created_at: string;
}

export interface UserProfile {
  id: number;
  user_id: number;
  display_name: string;
  age: number | null;
  gender: string | null;
  height_cm: number | null;
  weight_kg: number | null;
  activity_level: string;
  dietary_preference: string;
  fitness_goal: string;
  allergies: string[];
  restrictions: string[];
  preferred_foods: string[];
  disliked_foods: string[];
  daily_budget_inr: number | null;
  preferred_language: string;
  health_considerations: string | null;
  daily_calorie_target: number;
  daily_protein_target: number;
  daily_carb_target: number;
  daily_fat_target: number;
  daily_fiber_target: number;
  daily_water_target_ml: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConsentRecord {
  id: number;
  user_id: number;
  health_data_consent: boolean;
  ai_processing_consent: boolean;
  consent_date: string;
}

export interface FoodEntry {
  id: number;
  user_id: number;
  food_name: string;
  meal_category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  quantity: number;
  unit: string;
  serving_weight_g: number;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  source: string;
  confirmed_by_user: boolean;
  image_url: string | null;
  notes: string | null;
  logged_at: string;
  created_at: string;
}

export interface FoodSearchItem {
  name: string;
  hindi_name?: string;
  category: string;
  calories_per_100g: number;
  protein_per_100g: number;
  carbs_per_100g: number;
  fat_per_100g: number;
  fiber_per_100g: number;
  sugar_per_100g: number;
  sodium_per_100g_mg: number;
  standard_units: { unit: string; grams: number }[];
}

export interface MacroProgress {
  current: number;
  target: number;
  percentage: number;
  unit?: string;
}

export interface MealNutrition {
  category: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  food_count: number;
}

export interface DailyNutritionSummary {
  date: string;
  total_calories: number;
  calorie_target: number;
  calorie_percentage: number;
  protein: MacroProgress;
  carbs: MacroProgress;
  fat: MacroProgress;
  fiber: MacroProgress;
  total_sugar_g: number;
  total_sodium_mg: number;
  meal_breakdown: Record<string, MealNutrition>;
  total_water_ml: number;
  water_target_ml: number;
  total_exercise_minutes: number;
  calories_burned: number;
  insights_count: number;
  entry_count: number;
}

export interface DayTrendItem {
  date: string;
  day_name: string;
  calories: number;
  calorie_target: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  water_ml: number;
}

export interface WeeklyNutritionSummary {
  start_date: string;
  end_date: string;
  avg_calories: number;
  avg_protein_g: number;
  avg_carbs_g: number;
  avg_fat_g: number;
  avg_fiber_g: number;
  avg_water_ml: number;
  days: DayTrendItem[];
  nutrition_gaps: string[];
  potential_excesses: string[];
}

export interface SymptomLog {
  id: number;
  user_id: number;
  symptom_type: string;
  severity: 'mild' | 'moderate' | 'severe';
  logged_at: string;
  onset_minutes_after_meal: number | null;
  suspected_food: string | null;
  notes: string | null;
}

export interface ExerciseLog {
  id: number;
  user_id: number;
  activity_name: string;
  activity_category: string;
  duration_minutes: number;
  intensity: 'low' | 'moderate' | 'high';
  calories_burned: number;
  logged_at: string;
  notes: string | null;
}

export interface WaterLog {
  id: number;
  user_id: number;
  amount_ml: number;
  logged_at: string;
}

export interface MealPlanItem {
  id: number;
  meal_plan_id: number;
  meal_category: string;
  food_name: string;
  portion_description: string;
  estimated_calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  is_completed: boolean;
  recipe_instructions: string | null;
  ingredients: string[];
}

export interface MealPlan {
  id: number;
  user_id: number;
  title: string;
  target_date: string;
  total_calories: number;
  total_protein_g: number;
  notes: string | null;
  created_at: string;
  items: MealPlanItem[];
}

export interface GroceryItem {
  id: number;
  user_id: number;
  item_name: string;
  category: string;
  quantity: string;
  is_purchased: boolean;
  created_at: string;
}

export interface FoodPatternInsight {
  id: number;
  user_id: number;
  insight_type: string;
  title: string;
  food_name: string | null;
  symptom_type: string | null;
  frequency: number;
  confidence: string;
  supporting_records_count: number;
  date_range_start: string | null;
  date_range_end: string | null;
  description: string;
  actionable_tip: string | null;
  medical_disclaimer: string;
  user_feedback: 'none' | 'helpful' | 'inaccurate' | 'not_relevant';
  created_at: string;
}

export interface HabitInsight {
  insight_type: string;
  title: string;
  description: string;
  actionable_tip?: string;
  confidence: string;
  supporting_records_count: number;
  medical_disclaimer: string;
}

export interface FoodAlternative {
  original_food: string;
  current_nutrients: string;
  suggested_alternative: string;
  alternative_nutrients: string;
  why_better: string;
  budget_friendly_note: string;
  portion_tip: string;
}

export interface ExercisePlanItem {
  title: string;
  category: string;
  duration_minutes: number;
  intensity: string;
  estimated_calories: number;
  benefits: string;
  safety_notes: string;
  recommended_time: string;
}

export interface DashboardData {
  user: {
    display_name: string;
    dietary_preference: string;
    fitness_goal: string;
    onboarding_completed: boolean;
  };
  today_nutrition: {
    date: string;
    total_calories: number;
    calorie_target: number;
    calorie_percentage: number;
    protein: MacroProgress;
    carbs: MacroProgress;
    fat: MacroProgress;
    fiber: MacroProgress;
    entry_count: number;
  };
  hydration: {
    total_ml: number;
    target_ml: number;
    percentage: number;
    glasses: number;
  };
  activity: {
    total_minutes: number;
    calories_burned: number;
    sessions_count: number;
  };
  recent_meals: Array<{
    id: number;
    food_name: string;
    meal_category: string;
    portion: string;
    calories: number;
    protein_g: number;
    carbs_g: number;
    fat_g: number;
    logged_at: string;
  }>;
  recent_symptoms: Array<{
    id: number;
    symptom_type: string;
    severity: string;
    logged_at: string;
    notes: string | null;
  }>;
  pattern_insights: Array<{
    id: number;
    title: string;
    food_name: string | null;
    symptom_type: string | null;
    frequency: number;
    confidence: string;
    description: string;
    actionable_tip: string | null;
    user_feedback: string;
  }>;
  habit_insights: HabitInsight[];
}
