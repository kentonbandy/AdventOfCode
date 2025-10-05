import file_reader
import math
from typing import List

lines = file_reader.get_lines(__file__)
linelists = [line.replace(',', '').replace(':', '').split(' ') for line in lines]

class Ingredient:
    def __init__(self, line: List[str]):
        self.cap = int(line[2])
        self.dur = int(line[4])
        self.flv = int(line[6])
        self.tex = int(line[8])
        self.cal = int(line[10])

    def multiply(self, num: int):
        return Ingredient([
            0, 0, self.cap * num,
            0, self.dur * num,
            0, self.flv * num,
            0, self.tex * num,
            0, self.cal * num,
        ])

    def print(self):
        print(self.cap, self.dur, self.flv, self.tex, self.cal)

def get_score(ingredients: List[Ingredient], amounts: List[int]):
    sums = [0, 0, 0, 0]
    calories = 0

    for index, ingredient in enumerate(ingredients):
        result = ingredient.multiply(amounts[index])
        sums[0] += result.cap
        sums[1] += result.dur
        sums[2] += result.flv
        sums[3] += result.tex
        calories += result.cal
    
    pos_sums = [num if num > 0 else 0 for num in sums]

    return [math.prod(pos_sums), calories]

_ingredients = [Ingredient(line) for line in linelists]
_best_score = 0
_best_score_500_cal = 0

for a in range(101):
    for b in range(101 - a):
        for c in range(101 - a - b):
            d = 100 - a - b - c

            [score, calories] = get_score(_ingredients, [a, b, c, d])
            if score > _best_score:
                _best_score = score
            if calories == 500:
                _best_score_500_cal = max(score, _best_score_500_cal)

print(_best_score, _best_score_500_cal)
