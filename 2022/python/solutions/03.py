import file_reader

lines = file_reader.get_lines(__file__)
priority = 0
badge_priority = 0
group = []
priorities = " abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"

for line in lines:
    a = line[:int(len(line)/2)]
    b = line[int(len(line)/2):]
    for c in a:
        if c in b:
            priority += priorities.index(c)
            break
    group.append(line)
    if len(group) == 3:
        for c in group[0]:
            if c in group[1] and c in group[2]:
                badge_priority += priorities.index(c)
                break
        group = []

print(priority)
print(badge_priority)