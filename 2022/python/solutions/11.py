import file_reader
import math

groups = file_reader.get_line_groups(__file__)

class Monkey:
    def __init__(self, group):
        self.id = int(group[0].split(' ')[1][:1])
        self.items = [int(n.strip()) for n in group[1].split(':')[1].split(',')]
        ops = group[2].split('=')[1].strip().split(' ')[1:]
        self.ops = [ops[0] == '+', int(ops[1]) if ops[1] != 'old' else None]
        self.div = int(group[3].split('by')[1].strip())
        self.t = int(group[4].split('monkey')[1].strip())
        self.f = int(group[5].split('monkey')[1].strip())
        self.insp = 0

    def op(self, item):
        num = item if self.ops[1] is None else self.ops[1]
        return (item + num if self.ops[0] else item * num)

p1rounds = 20
p2rounds = 10000
p1monkeys = [Monkey(group) for group in groups]
p2monkeys = [Monkey(group) for group in groups]

def monkey_business(rounds, monkeys, divby3):
    lcm = math.lcm(*[m.div for m in monkeys])
    for _ in range(rounds):
        for m in monkeys:
            for i in m.items:
                newi = m.op(i) % lcm
                if divby3: newi = int(newi / 3)
                monkeys[m.t if newi % m.div == 0 else m.f].items.append(newi)
                m.insp += 1
            m.items = []
    return math.prod(sorted([m.insp for m in monkeys], reverse = True)[:2])

print(monkey_business(p1rounds, p1monkeys, True))
print(monkey_business(p2rounds, p2monkeys, False))
