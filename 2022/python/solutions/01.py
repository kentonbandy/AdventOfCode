import file_reader

file_num = __file__.split("\\")[-1].split('.')[0]
lines = file_reader.get_int_lines(file_num)
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