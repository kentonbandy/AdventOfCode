import file_reader

file_num = __file__.split("\\")[-1].split('.')[0]
lines = file_reader.get_lines(f"2022/python/inputs/{file_num}.txt")
rawstacks = lines[:8]
moves = [list(map(int, line.split(' ')[1::2])) for line in lines[10:]]
stacks = []
stacks2 = []
inds = [1,5,9,13,17,21,25,29,33] #where to find the value for each stack

for i in range(10):
    stacks.append([])
    stacks2.append([])

#load initial stacks
for stack in rawstacks:
    for i, ind in enumerate(inds):
        j = i + 1
        if ind > len(stack)-1: continue
        c = stack[ind]
        if c != ' ':
            stacks[j].insert(0,c)
            stacks2[j].insert(0,c)

#do moves
for move in moves:
    count = move[0]
    frm = move[1]
    to = move[2]

    #part 1
    for i in range(count):
        stacks[to].append(stacks[frm].pop())

    #part 2
    fromind = len(stacks2[frm]) - count
    pile = stacks2[frm][fromind:]
    stacks2[frm] = stacks2[frm][:fromind]
    stacks2[to].extend(pile)

for stack in stacks:
    print('' if len(stack) == 0 else stack.pop(), end='')
print()
for stack in stacks2:
    print('' if len(stack) == 0 else stack.pop(), end='')