import requests
import json

class Meal:
    def __init__(self, title, category, tags, instructions, area, ingredients, measures, image):
        self.title = title
        self.category = category
        self.tags = tags
        self.instructions = instructions
        self.area = area
        self.ingredients = ingredients
        self.measures = measures
        self.image = image
    
    def to_json(self):
        return {
            "title": self.title,
            "category": self.category, 
            "tags": self.tags,
            "instructions": self.instructions,
            "area": self.area,
            "ingredients": self.ingredients,
            "measures": self.measures,
            "image": self.image
        }

mealz = []
googoogaga = "abcdefghijklmnopqrstuvxyz"

for googoo in googoogaga:
    response = requests.get(f'https://www.themealdb.com/api/json/v2/9973533/search.php?f={googoo}')
    
    if response.status_code == 200:
        try:
            data = response.json()
            if data['meals'] is not None:
                for meal in data['meals']:
                    ingz = ""
                    measurez = ""
                    for i in range(1, 21):
                        ingredient = meal[f'strIngredient{i}']
                        measure = meal[f'strMeasure{i}']
                        if ingredient:
                            ingz += str(ingredient) + ";"
                        if measure:
                            measurez += str(measure) + ";"
                    meal_obj = Meal(
                        meal['strMeal'], 
                        meal['strCategory'], 
                        meal['strTags'], 
                        meal['strInstructions'], 
                        meal['strArea'], 
                        ingz, 
                        measurez, 
                        meal['strMealThumb']
                    )
                    mealz.append(meal_obj)
            else:
                print(f"No meals found for letter: {googoo}")
                
        except json.JSONDecodeError as e:
            print(f"JSON decode error for letter {googoo}: {e}")
    else:
        print(f"Failed to retrieve data for letter {googoo}: {response.status_code}")

mealzDict = [meal.to_json() for meal in mealz]

with open('mealsDb.json', 'w') as jason_file:
    json.dump({"meals": mealzDict}, jason_file, indent=4)

print('zbraaaa')
