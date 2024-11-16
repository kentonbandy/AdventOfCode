import file_reader

lines = file_reader.get_lines(__file__)
instructions = map(lambda l: [l[0], int(l[1])] if len(l) > 1 else l, [line.split(' ') for line in lines])

cycles = [20, 60, 100, 140, 180, 220]
strengths = []
cycle = 1
value = 1
screen = [[]]

for instruction in instructions:
  # noop adds nothing and takes one cycle. addx instruction adds the value on the second cycle.
  to_add = [0] if instruction[0] == "noop" else [0, instruction[1]]
  for val in to_add:
    # get column position, figure out whether current pixel is lit
    column_pos = (cycle- 1) % 40
    if column_pos == 0: screen.append([])
    if column_pos >= (value - 1) and column_pos <= (value + 1): screen[-1].append("#")
    else: screen[-1].append(" ")
    # append strength values
    if cycle in cycles: strengths.append(cycle * value)
    # add value and increment cycle
    value += val
    cycle += 1

print(sum(strengths))
for row in screen:
  print("".join(row))
