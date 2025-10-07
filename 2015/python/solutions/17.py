import file_reader

lines = file_reader.get_lines(__file__)
containers = [int(line) for line in lines]
liters = 150
combination = "0"
finalcombination = "1" * len(containers)
count = 0
containercountdict = {}

while combination != finalcombination:
    total = 0
    for index, bit in enumerate(combination):
        if bit == "0":
            continue
        total += containers[index]

    if total == liters:
        count += 1
        used = combination.count("1")
        if containercountdict.get(used) is not None:
            containercountdict[used] += 1
        else:
            containercountdict[used] = 1

    nextbinary = bin(int(combination, base=2) + 1)[2:]
    combination = ("0" * (len(finalcombination) -
                   len(nextbinary))) + nextbinary

lowestkey = min(containercountdict.keys())
occurrences = containercountdict[lowestkey]

print(count, occurrences)
