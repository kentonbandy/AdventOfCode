import file_reader

file_num = __file__.split("\\")[-1].split('.')[0]
lines = file_reader.get_lines(f"2022/python/inputs/{file_num}.txt")
guide = {
    "A X": 4,
    "A Y": 8,
    "A Z": 3,
    "B X": 1,
    "B Y": 5,
    "B Z": 9,
    "C X": 7,
    "C Y": 2,
    "C Z": 6
}
guide2 = {
    "A X": 3,
    "A Y": 4,
    "A Z": 8,
    "B X": 1,
    "B Y": 5,
    "B Z": 9,
    "C X": 2,
    "C Y": 6,
    "C Z": 7
}
score = 0
score2 = 0

for line in lines:
    score += guide[line]
    score2 += guide2[line]

print(score)
print(score2)
