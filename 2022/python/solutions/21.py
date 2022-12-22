import file_reader

lines = [line.split(': ') for line in file_reader.get_lines(__file__)]
monkeys = {}
opposites = {
    '+': '-',
    '-': '+',
    '*': '/',
    '/': '*',
}

for line in lines:
    valsplit = line[1].split(' ')
    val = int(valsplit[0]) if len(valsplit) == 1 else valsplit
    monkeys[line[0]] = val


def nonintmonkeys():
    return {k: v for k, v in monkeys.items() if isinstance(v, list)}


def bothintmonkeys(m1, m2):
    return isinstance(monkeys[m1], int) and isinstance(monkeys[m2], int)


def riddle():
    stack = []
    watch = 'humn'
    while isinstance(monkeys['root'], list):
        for name, val in nonintmonkeys().items():
            [m1, op, m2] = val
            if bothintmonkeys(m1, m2):
                if m1 == watch or m2 == watch:
                    stack.append([name, *val])
                    watch = name
                monkeys[name] = int(eval(f'{monkeys[m1]} {op} {monkeys[m2]}'))

    return stack


def riddle2(stack):
    num = 0
    while len(stack) > 0:
        turn = stack.pop()
        prev = stack[-1][0] if len(stack) > 0 else 'humn'
        other = turn[1] if turn[3] == prev else turn[3]
        if turn[0] == 'root':
            num = monkeys[other]
        elif turn[3] == prev and turn[2] == '-':
            num = monkeys[turn[1]] - num
        else:
            num = int(eval(f'{num} {opposites[turn[2]]} {monkeys[other]}'))

    return num


stack = riddle()
print(monkeys['root'])  # part 1
print(riddle2(stack))   # part 2
