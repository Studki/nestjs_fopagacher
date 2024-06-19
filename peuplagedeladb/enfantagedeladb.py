import requests
import json

headers = {
    'Authorization': "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImdvcnkudHJpc3RhbjkyQGdtYWlsLmNvbSIsInN1YiI6IjU2ZDU2Y2VhLWMzYWEtNGVjNy05YzQ3LWIzZTI5ODUzMzMxYiIsImlhdCI6MTcxODI1MzU4OSwiZXhwIjoxNzIwODQ1NTg5fQ.Kr5elqq1FogiPaoYVl9wmbwa2pwfW5KQbl25O1nBp0o",
    'Content-Type': "application/json"
}

class Ingredient:
    def __init__(self, title, description):
        self.title = title
        self.description = description
        self.price = 0
        self.image = ""
        self.category = ""
        self.tag = ""
        self.unit = ""
    
    def to_json(self):
        return {
            "title": self.title,
            "description": self.description,
            "price": self.price,
            "image": self.image,
            "category": self.category,
            "tag": self.tag,
            "unit": self.unit
        }

class Meal:
    def __init__(self, title, category, tags, instructions, area, ingredients, measures, image):
        self.title = title
        self.category = category
        self.tags = tags
        self.instructions = instructions
        self.area = area
        self.ingredients = ingredients.split(';')
        self.measures = measures.split(';')
        self.image = image
    
    def to_json(self):
        self.ingredients = [string for string in self.ingredients if string]
        recette = []
        instructions_list = self.instructions.split('.')
        index = 1
        for instr in instructions_list:
            if instr.strip():
                recette.append({
                    "title": f"Etape {index}",
                    "description": instr.strip(),
                    "time": 1
                })
                index += 1

        return {
            "recipe": self.title,
            "recette": recette,
            "recipeOfTheDay": False, 
            "alimentNames": self.ingredients,
            "quantity": [1] * len(self.ingredients)
        }

def post_ingredients(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    ingredients_list = []

    for ing in data['ingredients']:
        ingredient = Ingredient(
            ing['title'],
            ing['description']
        )
        ingredients_list.append(ingredient)

    for ingredient in ingredients_list:
        response = requests.post("http://localhost:3000/aliments", headers=headers, json=ingredient.to_json())
        if response.status_code == 201:
            print(f'Successfully posted {ingredient.title}')
        else:
            print(f'Error posting {ingredient.title}:', response.status_code)

    print('Finished posting ingredients')

def post_meals(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)

    meals_list = []
    errors = []

    for mea in data['meals']:
        meal = Meal(
            mea['title'],
            mea['category'],
            mea['tags'],
            mea['instructions'],
            mea['area'],
            mea['ingredients'],
            mea['measures'],
            mea['image']
        )
        meals_list.append(meal)

    for meal in meals_list:
        response = requests.post("http://localhost:3000/recipe", headers=headers, json=meal.to_json())
        if response.status_code == 201:
            print(f'Successfully posted {meal.title}')
        else:
            try:
                error_message = response.json().get('message', 'No error message provided')
            except json.JSONDecodeError:
                error_message = 'Response content is not valid JSON'
            print(f'Error posting {meal.title}: {response.status_code} - {error_message}')
            errors.append({"title": meal.title, "error": error_message})

    if errors:
        with open('error_log.json', 'w') as error_file:
            json.dump(errors, error_file, indent=4)

    print('Finished posting meals')

# post_ingredients('ingredientsDb.json')
post_meals('mealsDb.json')
