import math
from typing import Dict, List, Optional, Tuple


# Comprehensive Curated Indian and Global Nutrition Database
# Verified baseline values per 100 grams
CURATED_FOOD_DATABASE: List[Dict] = [
    # Breads & Grains
    {
        "name": "Roti / Chapati (Whole Wheat)",
        "hindi_name": "रोटी / चपाती",
        "category": "Grains & Breads",
        "calories_per_100g": 264.0,
        "protein_per_100g": 9.2,
        "carbs_per_100g": 52.0,
        "fat_per_100g": 3.4,
        "fiber_per_100g": 9.5,
        "sugar_per_100g": 1.2,
        "sodium_per_100g_mg": 180.0,
        "standard_units": [
            {"unit": "roti (medium)", "grams": 35.0},
            {"unit": "roti (large)", "grams": 50.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Plain Paratha",
        "hindi_name": "सादा पराठा",
        "category": "Grains & Breads",
        "calories_per_100g": 326.0,
        "protein_per_100g": 7.0,
        "carbs_per_100g": 48.0,
        "fat_per_100g": 12.5,
        "fiber_per_100g": 6.8,
        "sugar_per_100g": 1.5,
        "sodium_per_100g_mg": 240.0,
        "standard_units": [
            {"unit": "paratha", "grams": 60.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Aloo Paratha",
        "hindi_name": "आलू पराठा",
        "category": "Grains & Breads",
        "calories_per_100g": 290.0,
        "protein_per_100g": 6.2,
        "carbs_per_100g": 44.0,
        "fat_per_100g": 10.5,
        "fiber_per_100g": 5.4,
        "sugar_per_100g": 2.1,
        "sodium_per_100g_mg": 320.0,
        "standard_units": [
            {"unit": "paratha", "grams": 90.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Steamed White Rice",
        "hindi_name": "सफेद चावल",
        "category": "Grains & Breads",
        "calories_per_100g": 130.0,
        "protein_per_100g": 2.7,
        "carbs_per_100g": 28.2,
        "fat_per_100g": 0.3,
        "fiber_per_100g": 0.4,
        "sugar_per_100g": 0.1,
        "sodium_per_100g_mg": 1.0,
        "standard_units": [
            {"unit": "katori (cooked)", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "cup", "grams": 160.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Brown Rice (Cooked)",
        "hindi_name": "ब्राउन राइस",
        "category": "Grains & Breads",
        "calories_per_100g": 111.0,
        "protein_per_100g": 2.6,
        "carbs_per_100g": 23.0,
        "fat_per_100g": 0.9,
        "fiber_per_100g": 1.8,
        "sugar_per_100g": 0.4,
        "sodium_per_100g_mg": 5.0,
        "standard_units": [
            {"unit": "katori (cooked)", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "cup", "grams": 160.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Vegetable Khichdi",
        "hindi_name": "सब्जी खिचड़ी",
        "category": "Grains & Breads",
        "calories_per_100g": 120.0,
        "protein_per_100g": 4.5,
        "carbs_per_100g": 21.0,
        "fat_per_100g": 2.5,
        "fiber_per_100g": 2.8,
        "sugar_per_100g": 1.0,
        "sodium_per_100g_mg": 220.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 220.0},
            {"unit": "plate", "grams": 300.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Vegetable Biryani / Pulao",
        "hindi_name": "वेज बिरयानी / पुलाव",
        "category": "Grains & Breads",
        "calories_per_100g": 165.0,
        "protein_per_100g": 3.8,
        "carbs_per_100g": 26.5,
        "fat_per_100g": 5.2,
        "fiber_per_100g": 2.5,
        "sugar_per_100g": 1.2,
        "sodium_per_100g_mg": 310.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "plate", "grams": 300.0},
            {"unit": "bowl", "grams": 220.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Rolled Oats (Cooked in water)",
        "hindi_name": "दलिया / ओट्स",
        "category": "Grains & Breads",
        "calories_per_100g": 71.0,
        "protein_per_100g": 2.5,
        "carbs_per_100g": 12.0,
        "fat_per_100g": 1.5,
        "fiber_per_100g": 1.7,
        "sugar_per_100g": 0.3,
        "sodium_per_100g_mg": 5.0,
        "standard_units": [
            {"unit": "bowl", "grams": 200.0},
            {"unit": "cup", "grams": 150.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Dalia (Broken Wheat Porridge)",
        "hindi_name": "गेहूं का दलिया",
        "category": "Grains & Breads",
        "calories_per_100g": 85.0,
        "protein_per_100g": 3.2,
        "carbs_per_100g": 16.5,
        "fat_per_100g": 1.1,
        "fiber_per_100g": 3.1,
        "sugar_per_100g": 0.8,
        "sodium_per_100g_mg": 120.0,
        "standard_units": [
            {"unit": "bowl", "grams": 200.0},
            {"unit": "katori", "grams": 150.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },

    # Breakfast Specialties (South & West India)
    {
        "name": "Poha (Flattened Rice with Veggies)",
        "hindi_name": "पोहा",
        "category": "Breakfast",
        "calories_per_100g": 155.0,
        "protein_per_100g": 3.4,
        "carbs_per_100g": 28.0,
        "fat_per_100g": 3.5,
        "fiber_per_100g": 2.1,
        "sugar_per_100g": 1.2,
        "sodium_per_100g_mg": 210.0,
        "standard_units": [
            {"unit": "plate", "grams": 180.0},
            {"unit": "katori", "grams": 120.0},
            {"unit": "bowl", "grams": 150.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Upma (Semolina / Rava Upma)",
        "hindi_name": "उपमा",
        "category": "Breakfast",
        "calories_per_100g": 140.0,
        "protein_per_100g": 3.8,
        "carbs_per_100g": 24.5,
        "fat_per_100g": 3.2,
        "fiber_per_100g": 1.8,
        "sugar_per_100g": 0.9,
        "sodium_per_100g_mg": 230.0,
        "standard_units": [
            {"unit": "plate", "grams": 180.0},
            {"unit": "katori", "grams": 120.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Idli (Steamed Rice & Urad Dal Cake)",
        "hindi_name": "इडली",
        "category": "Breakfast",
        "calories_per_100g": 132.0,
        "protein_per_100g": 4.8,
        "carbs_per_100g": 26.5,
        "fat_per_100g": 0.6,
        "fiber_per_100g": 1.5,
        "sugar_per_100g": 0.4,
        "sodium_per_100g_mg": 140.0,
        "standard_units": [
            {"unit": "piece (medium)", "grams": 40.0},
            {"unit": "pair (2 pcs)", "grams": 80.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Plain Dosa (Crispy Rice-Lentil Crepe)",
        "hindi_name": "सादा डोसा",
        "category": "Breakfast",
        "calories_per_100g": 168.0,
        "protein_per_100g": 4.2,
        "carbs_per_100g": 30.0,
        "fat_per_100g": 3.8,
        "fiber_per_100g": 1.6,
        "sugar_per_100g": 0.5,
        "sodium_per_100g_mg": 180.0,
        "standard_units": [
            {"unit": "dosa", "grams": 80.0},
            {"unit": "large dosa", "grams": 120.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Masala Dosa",
        "hindi_name": "मसाला डोसा",
        "category": "Breakfast",
        "calories_per_100g": 185.0,
        "protein_per_100g": 4.5,
        "carbs_per_100g": 29.0,
        "fat_per_100g": 6.2,
        "fiber_per_100g": 2.4,
        "sugar_per_100g": 1.1,
        "sodium_per_100g_mg": 290.0,
        "standard_units": [
            {"unit": "dosa", "grams": 150.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Besan Chilla (Gram Flour Savory Pancake)",
        "hindi_name": "बेसन का चीला",
        "category": "Breakfast",
        "calories_per_100g": 170.0,
        "protein_per_100g": 9.5,
        "carbs_per_100g": 22.0,
        "fat_per_100g": 5.2,
        "fiber_per_100g": 4.8,
        "sugar_per_100g": 1.5,
        "sodium_per_100g_mg": 260.0,
        "standard_units": [
            {"unit": "chilla", "grams": 70.0},
            {"unit": "pair (2 chillas)", "grams": 140.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Khaman Dhokla",
        "hindi_name": "ढोकला",
        "category": "Breakfast",
        "calories_per_100g": 160.0,
        "protein_per_100g": 6.5,
        "carbs_per_100g": 26.0,
        "fat_per_100g": 3.8,
        "fiber_per_100g": 2.5,
        "sugar_per_100g": 3.8,
        "sodium_per_100g_mg": 380.0,
        "standard_units": [
            {"unit": "piece", "grams": 35.0},
            {"unit": "plate (3 pcs)", "grams": 105.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },

    # Dals & Pulses
    {
        "name": "Dal Tadka (Yellow Lentil Soup)",
        "hindi_name": "दाल तड़का",
        "category": "Dal & Pulses",
        "calories_per_100g": 95.0,
        "protein_per_100g": 5.8,
        "carbs_per_100g": 12.5,
        "fat_per_100g": 3.0,
        "fiber_per_100g": 3.2,
        "sugar_per_100g": 0.8,
        "sodium_per_100g_mg": 210.0,
        "standard_units": [
            {"unit": "katori (standard)", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Moong Dal (Yellow / Green)",
        "hindi_name": "मूंग दाल",
        "category": "Dal & Pulses",
        "calories_per_100g": 88.0,
        "protein_per_100g": 6.2,
        "carbs_per_100g": 12.0,
        "fat_per_100g": 1.8,
        "fiber_per_100g": 3.6,
        "sugar_per_100g": 0.5,
        "sodium_per_100g_mg": 180.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Dal Makhani",
        "hindi_name": "दाल मखनी",
        "category": "Dal & Pulses",
        "calories_per_100g": 150.0,
        "protein_per_100g": 5.4,
        "carbs_per_100g": 15.0,
        "fat_per_100g": 8.0,
        "fiber_per_100g": 4.1,
        "sugar_per_100g": 1.2,
        "sodium_per_100g_mg": 320.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Rajma Masala (Red Kidney Beans Curry)",
        "hindi_name": "राजमा मसाला",
        "category": "Dal & Pulses",
        "calories_per_100g": 120.0,
        "protein_per_100g": 6.5,
        "carbs_per_100g": 18.0,
        "fat_per_100g": 2.8,
        "fiber_per_100g": 5.2,
        "sugar_per_100g": 1.4,
        "sodium_per_100g_mg": 240.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 220.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Chole Masala (Chickpea Curry)",
        "hindi_name": "छोले मसाला",
        "category": "Dal & Pulses",
        "calories_per_100g": 145.0,
        "protein_per_100g": 7.0,
        "carbs_per_100g": 20.5,
        "fat_per_100g": 4.5,
        "fiber_per_100g": 5.8,
        "sugar_per_100g": 1.8,
        "sodium_per_100g_mg": 280.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 220.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Sambhar (South Indian Lentil & Vegetable Stew)",
        "hindi_name": "सांभर",
        "category": "Dal & Pulses",
        "calories_per_100g": 65.0,
        "protein_per_100g": 3.2,
        "carbs_per_100g": 9.5,
        "fat_per_100g": 1.8,
        "fiber_per_100g": 2.6,
        "sugar_per_100g": 1.5,
        "sodium_per_100g_mg": 240.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 220.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Sprouted Moong Salad",
        "hindi_name": "अंकुरित मूंग चाट / सलाद",
        "category": "Dal & Pulses",
        "calories_per_100g": 78.0,
        "protein_per_100g": 6.8,
        "carbs_per_100g": 12.0,
        "fat_per_100g": 0.8,
        "fiber_per_100g": 4.5,
        "sugar_per_100g": 1.8,
        "sodium_per_100g_mg": 85.0,
        "standard_units": [
            {"unit": "katori", "grams": 100.0},
            {"unit": "bowl", "grams": 150.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },

    # Vegetables & Sabzis
    {
        "name": "Palak Paneer",
        "hindi_name": "पालक पनीर",
        "category": "Vegetables & Curries",
        "calories_per_100g": 142.0,
        "protein_per_100g": 7.5,
        "carbs_per_100g": 4.8,
        "fat_per_100g": 10.8,
        "fiber_per_100g": 2.6,
        "sugar_per_100g": 1.2,
        "sodium_per_100g_mg": 290.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Paneer Bhurji",
        "hindi_name": "पनीर भुर्जी",
        "category": "Vegetables & Curries",
        "calories_per_100g": 210.0,
        "protein_per_100g": 13.5,
        "carbs_per_100g": 5.2,
        "fat_per_100g": 15.0,
        "fiber_per_100g": 1.8,
        "sugar_per_100g": 1.8,
        "sodium_per_100g_mg": 320.0,
        "standard_units": [
            {"unit": "katori", "grams": 120.0},
            {"unit": "plate", "grams": 180.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Matar Paneer",
        "hindi_name": "मटर पनीर",
        "category": "Vegetables & Curries",
        "calories_per_100g": 158.0,
        "protein_per_100g": 8.0,
        "carbs_per_100g": 8.5,
        "fat_per_100g": 10.5,
        "fiber_per_100g": 2.8,
        "sugar_per_100g": 2.4,
        "sodium_per_100g_mg": 280.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Bhindi Masala (Okra Stir Fry)",
        "hindi_name": "भिंडी मसाला",
        "category": "Vegetables & Curries",
        "calories_per_100g": 95.0,
        "protein_per_100g": 2.4,
        "carbs_per_100g": 9.2,
        "fat_per_100g": 5.8,
        "fiber_per_100g": 3.8,
        "sugar_per_100g": 1.6,
        "sodium_per_100g_mg": 210.0,
        "standard_units": [
            {"unit": "katori", "grams": 120.0},
            {"unit": "bowl", "grams": 180.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Aloo Gobhi (Potato Cauliflower Sabzi)",
        "hindi_name": "आलू गोभी",
        "category": "Vegetables & Curries",
        "calories_per_100g": 115.0,
        "protein_per_100g": 2.8,
        "carbs_per_100g": 14.5,
        "fat_per_100g": 5.5,
        "fiber_per_100g": 3.2,
        "sugar_per_100g": 2.0,
        "sodium_per_100g_mg": 230.0,
        "standard_units": [
            {"unit": "katori", "grams": 130.0},
            {"unit": "bowl", "grams": 180.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Baingan Bharta (Roasted Eggplant Mash)",
        "hindi_name": "बैंगन भरता",
        "category": "Vegetables & Curries",
        "calories_per_100g": 85.0,
        "protein_per_100g": 1.8,
        "carbs_per_100g": 8.0,
        "fat_per_100g": 5.2,
        "fiber_per_100g": 3.4,
        "sugar_per_100g": 2.8,
        "sodium_per_100g_mg": 240.0,
        "standard_units": [
            {"unit": "katori", "grams": 130.0},
            {"unit": "bowl", "grams": 180.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Lauki Ki Sabzi (Bottle Gourd Curry)",
        "hindi_name": "लौकी की सब्जी",
        "category": "Vegetables & Curries",
        "calories_per_100g": 48.0,
        "protein_per_100g": 1.2,
        "carbs_per_100g": 4.5,
        "fat_per_100g": 2.8,
        "fiber_per_100g": 2.0,
        "sugar_per_100g": 1.8,
        "sodium_per_100g_mg": 160.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Mix Vegetable Curry",
        "hindi_name": "मिक्स वेज",
        "category": "Vegetables & Curries",
        "calories_per_100g": 98.0,
        "protein_per_100g": 2.6,
        "carbs_per_100g": 11.0,
        "fat_per_100g": 5.0,
        "fiber_per_100g": 3.1,
        "sugar_per_100g": 2.5,
        "sodium_per_100g_mg": 220.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 200.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },

    # Dairy & Plant Milks
    {
        "name": "Curd / Plain Dahi (Whole Milk)",
        "hindi_name": "दही",
        "category": "Dairy",
        "calories_per_100g": 61.0,
        "protein_per_100g": 3.5,
        "carbs_per_100g": 4.7,
        "fat_per_100g": 3.3,
        "fiber_per_100g": 0.0,
        "sugar_per_100g": 4.7,
        "sodium_per_100g_mg": 46.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "cup", "grams": 200.0},
            {"unit": "tbsp", "grams": 20.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Chaas / Spiced Buttermilk",
        "hindi_name": "छाछ / मट्ठा",
        "category": "Dairy",
        "calories_per_100g": 28.0,
        "protein_per_100g": 1.6,
        "carbs_per_100g": 2.5,
        "fat_per_100g": 1.2,
        "fiber_per_100g": 0.1,
        "sugar_per_100g": 2.2,
        "sodium_per_100g_mg": 120.0,
        "standard_units": [
            {"unit": "glass", "grams": 250.0},
            {"unit": "cup", "grams": 150.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Paneer (Fresh Indian Cottage Cheese)",
        "hindi_name": "पनीर (कच्चा)",
        "category": "Dairy",
        "calories_per_100g": 296.0,
        "protein_per_100g": 18.3,
        "carbs_per_100g": 4.5,
        "fat_per_100g": 22.0,
        "fiber_per_100g": 0.0,
        "sugar_per_100g": 2.8,
        "sodium_per_100g_mg": 22.0,
        "standard_units": [
            {"unit": "slice / cube", "grams": 25.0},
            {"unit": "portion (100g)", "grams": 100.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Cow Milk (Toned)",
        "hindi_name": "गाय का दूध (टोन्ड)",
        "category": "Dairy",
        "calories_per_100g": 58.0,
        "protein_per_100g": 3.1,
        "carbs_per_100g": 4.8,
        "fat_per_100g": 3.0,
        "fiber_per_100g": 0.0,
        "sugar_per_100g": 4.8,
        "sodium_per_100g_mg": 50.0,
        "standard_units": [
            {"unit": "glass", "grams": 250.0},
            {"unit": "cup", "grams": 180.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Soy Milk (Unsweetened)",
        "hindi_name": "सोया मिल्क",
        "category": "Dairy Alternatives",
        "calories_per_100g": 45.0,
        "protein_per_100g": 3.3,
        "carbs_per_100g": 2.0,
        "fat_per_100g": 2.0,
        "fiber_per_100g": 0.6,
        "sugar_per_100g": 0.5,
        "sodium_per_100g_mg": 40.0,
        "standard_units": [
            {"unit": "glass", "grams": 250.0},
            {"unit": "cup", "grams": 180.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Tofu (Firm)",
        "hindi_name": "टोफू",
        "category": "Dairy Alternatives",
        "calories_per_100g": 76.0,
        "protein_per_100g": 8.0,
        "carbs_per_100g": 1.9,
        "fat_per_100g": 4.8,
        "fiber_per_100g": 0.9,
        "sugar_per_100g": 0.5,
        "sodium_per_100g_mg": 7.0,
        "standard_units": [
            {"unit": "cube", "grams": 20.0},
            {"unit": "portion (100g)", "grams": 100.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },

    # Eggs, Poultry & Fish
    {
        "name": "Boiled Egg (Whole)",
        "hindi_name": "उबला अंडा",
        "category": "Eggs & Non-Veg",
        "calories_per_100g": 155.0,
        "protein_per_100g": 12.6,
        "carbs_per_100g": 1.1,
        "fat_per_100g": 10.6,
        "fiber_per_100g": 0.0,
        "sugar_per_100g": 1.1,
        "sodium_per_100g_mg": 124.0,
        "standard_units": [
            {"unit": "egg (medium)", "grams": 50.0},
            {"unit": "2 eggs", "grams": 100.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Egg White (Boiled)",
        "hindi_name": "अंडे की सफेदी",
        "category": "Eggs & Non-Veg",
        "calories_per_100g": 52.0,
        "protein_per_100g": 10.9,
        "carbs_per_100g": 0.7,
        "fat_per_100g": 0.2,
        "fiber_per_100g": 0.0,
        "sugar_per_100g": 0.7,
        "sodium_per_100g_mg": 166.0,
        "standard_units": [
            {"unit": "egg white", "grams": 33.0},
            {"unit": "2 whites", "grams": 66.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Egg Bhurji (Indian Scrambled Eggs with Veggies)",
        "hindi_name": "अंडा भुर्जी",
        "category": "Eggs & Non-Veg",
        "calories_per_100g": 175.0,
        "protein_per_100g": 11.2,
        "carbs_per_100g": 3.8,
        "fat_per_100g": 12.8,
        "fiber_per_100g": 0.9,
        "sugar_per_100g": 1.5,
        "sodium_per_100g_mg": 280.0,
        "standard_units": [
            {"unit": "portion (2 eggs)", "grams": 120.0},
            {"unit": "plate", "grams": 180.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Chicken Curry (Homestyle)",
        "hindi_name": "चिकन करी",
        "category": "Eggs & Non-Veg",
        "calories_per_100g": 165.0,
        "protein_per_100g": 16.5,
        "carbs_per_100g": 4.2,
        "fat_per_100g": 9.2,
        "fiber_per_100g": 1.2,
        "sugar_per_100g": 1.0,
        "sodium_per_100g_mg": 280.0,
        "standard_units": [
            {"unit": "katori", "grams": 150.0},
            {"unit": "bowl", "grams": 220.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Chicken Breast (Grilled / Tandoori)",
        "hindi_name": "तंदूरी चिकन ब्रेस्ट",
        "category": "Eggs & Non-Veg",
        "calories_per_100g": 150.0,
        "protein_per_100g": 28.0,
        "carbs_per_100g": 1.8,
        "fat_per_100g": 3.5,
        "fiber_per_100g": 0.5,
        "sugar_per_100g": 0.2,
        "sodium_per_100g_mg": 220.0,
        "standard_units": [
            {"unit": "piece (100g)", "grams": 100.0},
            {"unit": "portion", "grams": 150.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Fish Curry (Rohu / Pomfret)",
        "hindi_name": "मछली करी",
        "category": "Eggs & Non-Veg",
        "calories_per_100g": 135.0,
        "protein_per_100g": 15.0,
        "carbs_per_100g": 3.5,
        "fat_per_100g": 6.8,
        "fiber_per_100g": 0.8,
        "sugar_per_100g": 0.8,
        "sodium_per_100g_mg": 250.0,
        "standard_units": [
            {"unit": "katori (with 1 pc)", "grams": 150.0},
            {"unit": "bowl (with 2 pcs)", "grams": 220.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },

    # Fruits & Nuts
    {
        "name": "Apple",
        "hindi_name": "सेब",
        "category": "Fruits",
        "calories_per_100g": 52.0,
        "protein_per_100g": 0.3,
        "carbs_per_100g": 13.8,
        "fat_per_100g": 0.2,
        "fiber_per_100g": 2.4,
        "sugar_per_100g": 10.4,
        "sodium_per_100g_mg": 1.0,
        "standard_units": [
            {"unit": "medium apple", "grams": 150.0},
            {"unit": "large apple", "grams": 200.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Banana",
        "hindi_name": "केला",
        "category": "Fruits",
        "calories_per_100g": 89.0,
        "protein_per_100g": 1.1,
        "carbs_per_100g": 22.8,
        "fat_per_100g": 0.3,
        "fiber_per_100g": 2.6,
        "sugar_per_100g": 12.2,
        "sodium_per_100g_mg": 1.0,
        "standard_units": [
            {"unit": "medium banana", "grams": 118.0},
            {"unit": "small banana", "grams": 90.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Papaya",
        "hindi_name": "पपीता",
        "category": "Fruits",
        "calories_per_100g": 43.0,
        "protein_per_100g": 0.5,
        "carbs_per_100g": 10.8,
        "fat_per_100g": 0.3,
        "fiber_per_100g": 1.7,
        "sugar_per_100g": 7.8,
        "sodium_per_100g_mg": 8.0,
        "standard_units": [
            {"unit": "bowl (cubes)", "grams": 150.0},
            {"unit": "cup", "grams": 140.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Guava (Amrood)",
        "hindi_name": "अमरूद",
        "category": "Fruits",
        "calories_per_100g": 68.0,
        "protein_per_100g": 2.6,
        "carbs_per_100g": 14.3,
        "fat_per_100g": 1.0,
        "fiber_per_100g": 5.4,
        "sugar_per_100g": 8.9,
        "sodium_per_100g_mg": 2.0,
        "standard_units": [
            {"unit": "guava (medium)", "grams": 120.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Almonds (Badam)",
        "hindi_name": "बादाम",
        "category": "Nuts & Seeds",
        "calories_per_100g": 579.0,
        "protein_per_100g": 21.2,
        "carbs_per_100g": 21.6,
        "fat_per_100g": 49.9,
        "fiber_per_100g": 12.5,
        "sugar_per_100g": 4.4,
        "sodium_per_100g_mg": 1.0,
        "standard_units": [
            {"unit": "handful (10 nuts)", "grams": 14.0},
            {"unit": "handful (20 nuts)", "grams": 28.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Walnuts (Akhrot)",
        "hindi_name": "अखरोट",
        "category": "Nuts & Seeds",
        "calories_per_100g": 654.0,
        "protein_per_100g": 15.2,
        "carbs_per_100g": 13.7,
        "fat_per_100g": 65.2,
        "fiber_per_100g": 6.7,
        "sugar_per_100g": 2.6,
        "sodium_per_100g_mg": 2.0,
        "standard_units": [
            {"unit": "halves (4 pieces)", "grams": 12.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Roasted Chana (Chickpeas)",
        "hindi_name": "भुना चना",
        "category": "Snacks",
        "calories_per_100g": 369.0,
        "protein_per_100g": 18.6,
        "carbs_per_100g": 58.0,
        "fat_per_100g": 5.3,
        "fiber_per_100g": 16.8,
        "sugar_per_100g": 2.0,
        "sodium_per_100g_mg": 14.0,
        "standard_units": [
            {"unit": "handful", "grams": 30.0},
            {"unit": "katori", "grams": 60.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Masala Chai (With milk and sugar)",
        "hindi_name": "मसाला चाय",
        "category": "Beverages",
        "calories_per_100g": 72.0,
        "protein_per_100g": 1.8,
        "carbs_per_100g": 9.5,
        "fat_per_100g": 2.8,
        "fiber_per_100g": 0.0,
        "sugar_per_100g": 8.5,
        "sodium_per_100g_mg": 28.0,
        "standard_units": [
            {"unit": "cup", "grams": 120.0},
            {"unit": "mug", "grams": 200.0},
            {"unit": "cutting chai", "grams": 80.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Green Tea (Unsweetened)",
        "hindi_name": "ग्रीन टी",
        "category": "Beverages",
        "calories_per_100g": 1.0,
        "protein_per_100g": 0.0,
        "carbs_per_100g": 0.2,
        "fat_per_100g": 0.0,
        "fiber_per_100g": 0.0,
        "sugar_per_100g": 0.0,
        "sodium_per_100g_mg": 1.0,
        "standard_units": [
            {"unit": "cup", "grams": 150.0},
            {"unit": "mug", "grams": 240.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Samosa",
        "hindi_name": "समोसा",
        "category": "Snacks",
        "calories_per_100g": 262.0,
        "protein_per_100g": 4.5,
        "carbs_per_100g": 32.0,
        "fat_per_100g": 13.0,
        "fiber_per_100g": 2.1,
        "sugar_per_100g": 1.5,
        "sodium_per_100g_mg": 380.0,
        "standard_units": [
            {"unit": "piece (regular)", "grams": 80.0},
            {"unit": "mini samosa", "grams": 35.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
    {
        "name": "Cucumber Salad (Kheera)",
        "hindi_name": "खीरा सलाद",
        "category": "Vegetables & Curries",
        "calories_per_100g": 15.0,
        "protein_per_100g": 0.7,
        "carbs_per_100g": 3.6,
        "fat_per_100g": 0.1,
        "fiber_per_100g": 0.5,
        "sugar_per_100g": 1.7,
        "sodium_per_100g_mg": 2.0,
        "standard_units": [
            {"unit": "cucumber (medium)", "grams": 150.0},
            {"unit": "bowl", "grams": 120.0},
            {"unit": "grams", "grams": 1.0},
        ],
    },
]


class NutritionService:
    def __init__(self):
        self._database = CURATED_FOOD_DATABASE

    def search_foods(self, query: str, limit: int = 20) -> List[Dict]:
        """Search foods by English name, Hindi name, or category."""
        if not query:
            return self._database[:limit]

        query_clean = query.strip().lower()
        results = []
        for item in self._database:
            name_match = query_clean in item["name"].lower()
            hindi_match = item.get("hindi_name") and (query_clean in item["hindi_name"].lower())
            category_match = query_clean in item["category"].lower()
            if name_match or hindi_match or category_match:
                results.append(item)
                if len(results) >= limit:
                    break
        return results

    def get_food_by_name(self, name: str) -> Optional[Dict]:
        """Find exact or closest matching food item in database."""
        name_clean = name.strip().lower()
        # Direct exact match
        for item in self._database:
            if item["name"].lower() == name_clean:
                return item
        # Partial match
        for item in self._database:
            if name_clean in item["name"].lower() or item["name"].lower() in name_clean:
                return item
            if item.get("hindi_name") and name_clean in item["hindi_name"].lower():
                return item
        return None

    def calculate_portion_nutrients(
        self,
        food_name: str,
        quantity: float,
        unit: str,
        serving_weight_g: Optional[float] = None,
    ) -> Dict:
        """
        Calculates nutritional values using deterministic formulas:
        portion_grams = unit_weight * quantity
        nutrient = (nutrient_per_100g * portion_grams) / 100
        """
        food_item = self.get_food_by_name(food_name)

        if not serving_weight_g or serving_weight_g <= 0:
            grams_per_unit = 100.0  # default
            if food_item:
                for u in food_item.get("standard_units", []):
                    if u["unit"].lower() == unit.lower():
                        grams_per_unit = float(u["grams"])
                        break
                else:
                    if unit.lower() in ["gram", "grams", "g"]:
                        grams_per_unit = 1.0
            portion_grams = round(quantity * grams_per_unit, 1)
        else:
            portion_grams = round(serving_weight_g, 1)

        # Baseline per 100g
        if food_item:
            c100 = food_item["calories_per_100g"]
            p100 = food_item["protein_per_100g"]
            carb100 = food_item["carbs_per_100g"]
            f100 = food_item["fat_per_100g"]
            fib100 = food_item.get("fiber_per_100g", 0.0)
            sug100 = food_item.get("sugar_per_100g", 0.0)
            sod100 = food_item.get("sodium_per_100g_mg", 0.0)
            data_source = "curated_database"
        else:
            # Fallback for unknown manual items
            c100 = 150.0
            p100 = 5.0
            carb100 = 20.0
            f100 = 5.0
            fib100 = 2.0
            sug100 = 2.0
            sod100 = 150.0
            data_source = "manual_estimate"

        ratio = portion_grams / 100.0

        return {
            "food_name": food_name,
            "quantity": quantity,
            "unit": unit,
            "serving_weight_g": portion_grams,
            "calories": round(c100 * ratio, 1),
            "protein_g": round(p100 * ratio, 1),
            "carbs_g": round(carb100 * ratio, 1),
            "fat_g": round(f100 * ratio, 1),
            "fiber_g": round(fib100 * ratio, 1),
            "sugar_g": round(sug100 * ratio, 1),
            "sodium_mg": round(sod100 * ratio, 1),
            "data_source": data_source,
        }

    def calculate_daily_targets(
        self,
        age: Optional[int],
        gender: Optional[str],
        height_cm: Optional[float],
        weight_kg: Optional[float],
        activity_level: str = "moderate",
        fitness_goal: str = "general_wellness",
    ) -> Dict[str, float]:
        """
        Calculates recommended daily calorie and macronutrient targets
        using the clinically recognized Mifflin-St Jeor equation + ICMR guidelines.
        """
        # Sensible baseline defaults if inputs are missing
        w = weight_kg if weight_kg and 30 <= weight_kg <= 250 else 65.0
        h = height_cm if height_cm and 100 <= height_cm <= 230 else 168.0
        a = age if age and 10 <= age <= 100 else 28

        # Basal Metabolic Rate (BMR) Mifflin-St Jeor
        if gender and gender.lower() == "female":
            bmr = (10.0 * w) + (6.25 * h) - (5.0 * a) - 161.0
        else:
            bmr = (10.0 * w) + (6.25 * h) - (5.0 * a) + 5.0

        activity_multipliers = {
            "sedentary": 1.2,
            "light": 1.375,
            "moderate": 1.55,
            "active": 1.725,
            "very_active": 1.9,
        }
        multiplier = activity_multipliers.get(activity_level.lower(), 1.55)
        tdee = bmr * multiplier

        # Adjust for fitness goal safely (no extreme calorie deficits)
        if fitness_goal == "weight_loss":
            calories = max(1350.0, round(tdee - 400.0, 0))  # safe ~400 kcal deficit
            protein_per_kg = 1.4  # higher protein for lean mass preservation
        elif fitness_goal == "muscle_building":
            calories = round(tdee + 300.0, 0)
            protein_per_kg = 1.7
        elif fitness_goal == "improve_activity":
            calories = round(tdee, 0)
            protein_per_kg = 1.3
        else:  # general_wellness or weight_maintenance
            calories = round(tdee, 0)
            protein_per_kg = 1.1

        protein_g = round(w * protein_per_kg, 1)
        # Healthy fat: 25% of total calories (9 kcal/g)
        fat_g = round((calories * 0.25) / 9.0, 1)
        # Remaining calories from complex carbohydrates (4 kcal/g)
        remaining_cal = max(0.0, calories - (protein_g * 4.0) - (fat_g * 9.0))
        carbs_g = round(remaining_cal / 4.0, 1)
        # Fiber: ~14g per 1000 kcal (ICMR / WHO recommendation)
        fiber_g = round((calories / 1000.0) * 14.0, 1)
        # Water: ~35ml per kg bodyweight
        water_ml = int(max(2000, min(4000, round(w * 35.0, -2))))

        return {
            "calories": calories,
            "protein_g": protein_g,
            "carbs_g": carbs_g,
            "fat_g": fat_g,
            "fiber_g": fiber_g,
            "water_ml": water_ml,
        }


nutrition_service = NutritionService()
