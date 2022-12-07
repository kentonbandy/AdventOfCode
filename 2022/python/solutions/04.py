import file_reader

lines = file_reader.get_lines(__file__)
count = 0
count2 = 0

for line in lines:
    assignments = line.split(',')
    a = [int(c) for c in assignments[0].split('-')]
    b = [int(c) for c in assignments[1].split('-')]
    if (a[0] >= b[0] and a[1] <= b[1]) or (b[0] >= a[0] and b[1] <= a[1]):
        count += 1
    if (a[0] <= b[0] and a[1] >= b[0]) or (b[0] <= a[0] and b[1] >= a[0]):
        count2 += 1

print(count)
print(count2)