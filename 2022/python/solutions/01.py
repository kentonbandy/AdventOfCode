import file_reader

lines = file_reader.get_int_lines('2022/python/inputs/01.txt')
if lines[-1] is not None: lines.append(None)
cals = []
elf = 0

for line in lines:
    if line is None:
        cals.append(elf)
        elf = 0
        continue
    elf += line

cals.sort(reverse=True)
print(cals[0])          #p1
print(sum(cals[:3]))    #p2