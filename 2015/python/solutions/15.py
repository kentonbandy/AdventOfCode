import file_reader
import helpers
import numpy

lines = file_reader.get_lines(__file__)
linelists = [line.replace(',', '').replace(
    ':', '').split(' ') for line in lines]
combinations = helpers.stars_bars(100, 3, 0)
combinations = [group + ((100 - (group[0] + group[1] + group[2])),)
                for group in combinations]

print(len(combinations))


class Ingredient:
    def __init__(self, line):
        self.cap = int(line[2])
        self.dur = int(line[4])
        self.flv = int(line[6])
        self.tex = int(line[8])
        self.cal = int(line[10])

    def score(self):
        return self.cap * self.dur * self.flv * self.tex

    def multiply(self, num):
        return Ingredient([
            0, 0, self.cap * num,
            0, self.dur * num,
            0, self.flv * num,
            0, self.tex * num,
            0, self.cal * num,
        ])

    def print(self):
        print(self.cap, self.dur, self.flv, self.tex, self.cal)


istats = [
    Ingredient(linelists[0]),
    Ingredient(linelists[1]),
    Ingredient(linelists[2]),
    Ingredient(linelists[3])
]

biggest = 0


def addstat(lst, stat):
    tot = 0
    for ing in lst:
        tot += getattr(ing, stat)
    return max(tot, 0)


for combination in combinations:
    inglist = [
        istats[0].multiply(combination[0]),
        istats[1].multiply(combination[1]),
        istats[2].multiply(combination[2]),
        istats[3].multiply(combination[3]),
    ]

    stats = [
        addstat(inglist, 'cap'),
        addstat(inglist, 'dur'),
        addstat(inglist, 'flv'),
        addstat(inglist, 'tex'),
    ]

    if 0 in stats:
        continue

    prod = numpy.prod(numpy.array(stats))
    biggest = max(biggest, prod)

print(biggest)
