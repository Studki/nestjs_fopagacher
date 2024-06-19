import json
import requests

class Ingredient:
    def __init__(self, title, description):
        self.title = title
        self.description = description
    
    def to_json(self):
        return {
            "title": self.title,
            "description": self.description
        }

ingzzzeeer = []
response = requests.get("https://www.themealdb.com/api/json/v2/9973533/list.php?i=list")

if response.status_code == 200:
    try:
        data = response.json()
        for ing in data['meals']:
            ing_obj = Ingredient(
                ing['strIngredient'],
                ing['strDescription']
            )
            ingzzzeeer.append(ing_obj)
    except:
        print('googoogaga tété :[')
else:
    print('GROUAR je veux tété :3')

ingzDict = [ingtété.to_json() for ingtété in ingzzzeeer]

with open('ingredientsDb.json', 'w') as jason_file:
    json.dump({"ingredients": ingzDict}, jason_file, indent=4)

print("je suis rassasié ihih")