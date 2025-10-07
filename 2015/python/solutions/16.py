import file_reader
import re

lines = file_reader.get_lines(__file__)

characteristics = {
    "children": 3,
    "cats": 7,
    "samoyeds": 2,
    "pomeranians": 3,
    "akitas": 0,
    "vizslas": 0,
    "goldfish": 5,
    "trees": 3,
    "cars": 2,
    "perfumes": 1,
}

greater_than_keys = {"cats", "trees"}
less_than_keys = {"pomeranians", "goldfish"}

sues = []


def process_line(line):
    stripped = re.sub('Sue \d+: ', '', line)
    arr = stripped.split(", ")

    sue = {}
    for element in arr:
        split_element = element.split(": ")
        sue[split_element[0]] = int(split_element[1])

    return sue


def does_sue_match(sue: dict):
    for key, value in characteristics.items():
        suevalue = sue.get(key)
        if not does_characteristic_match(key, suevalue, value):
            return False

    return True


def does_characteristic_match(characteristic, suevalue, value):
    if suevalue is None:
        return True
    # part 1: return suevalue == value
    if characteristic in greater_than_keys:
        return suevalue > value
    if characteristic in less_than_keys:
        return suevalue < value
    return suevalue == value


def which_sue_matches():
    for index, sue in enumerate(sues):
        if (does_sue_match(sue)):
            return index + 1


for line in lines:
    processed = process_line(line)
    sues.append(processed)

print(which_sue_matches())
