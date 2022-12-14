import file_reader

instructions = file_reader.get_lines(__file__)[0]

floor = 0
basement = None
for i, instruction in enumerate(instructions):
    floor += 1 if instruction == '(' else -1
    if basement is None and floor == -1: basement = i+1

print(floor)    # part 1
print(basement) # part 2