import file_reader

# AoC 2021 day 1 for practice
lines = file_reader.get_int_lines('inputs/2021_01.txt')

def practice01():
    """https://adventofcode.com/2021/day/1"""
    count = 0
    for i in range(1, len(lines)):
        if lines[i] > lines[i-1]:
            count += 1
    print(count)

def practice02():
    """https://adventofcode.com/2021/day/1"""
    count = 0
    for i in range(3, len(lines)):
        if (lines[i-2] + lines[i-1] + lines[i] > lines[i-3] + lines[i-2] + lines[i-1]):
            count += 1
    print(count)

practice01()
practice02()