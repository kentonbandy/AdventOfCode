import file_reader

lines = file_reader.get_lines(__file__)


def isint(val):
    return isinstance(val, int)


class Instruction:
    def __init__(self, instruction):
        [logic, output] = instruction.split(' -> ')
        self.output = output
        logiclist = logic.split(' ')
        if len(logiclist) == 1:
            val = self.getvalue(logiclist[0])
            if isint(val):
                self.signal = val
            else:
                self.left = val
        elif len(logiclist) == 2:
            self.left = self.getvalue(logiclist[1])
            self.operator = logiclist[0]
        elif len(logiclist) == 3:
            self.operator = logiclist[1]
            self.left = self.getvalue(logiclist[0])
            self.right = int(logiclist[2]) if self.operator in [
                'LSHIFT', 'RSHIFT'] else self.getvalue(logiclist[2])

    def getvalue(self, string):
        try:
            return int(string)
        except ValueError:
            return string

    def hasattr(self, attr):
        return hasattr(self, attr)


instructions = [Instruction(line) for line in lines]


logic = {
    'AND': lambda x, y: x & y,
    'OR': lambda x, y: x | y,
    'LSHIFT': lambda x, y: x << y,
    'RSHIFT': lambda x, y: x >> y,
    'NOT': lambda x: ~x,
}


def runcircuit(instructions, part2=False):
    wirevalues = dict()

    ilist = instructions.copy()
    while len(wirevalues) < len(ilist):
        for inst in ilist[::-1]:
            if inst.output in wirevalues:
                continue
            # has int signal
            if inst.hasattr('signal'):
                if part2 and inst.output == 'b':
                    wirevalues[inst.output] = 3176
                else:
                    wirevalues[inst.output] = inst.signal
            # has only wire input
            elif not inst.hasattr('operator'):
                if inst.left in wirevalues:
                    wirevalues[inst.output] = wirevalues[inst.left]
            # NOT operator
            elif inst.operator == 'NOT':
                if isvalid(inst.left, wirevalues):
                    wirevalues[inst.output] = makesigned(logic[inst.operator](
                        getintorvalue(inst.left, wirevalues)))
            # LSHIFT or RSHIFT operator
            elif inst.operator in ['LSHIFT', 'RSHIFT']:
                if isvalid(inst.left, wirevalues):
                    wirevalues[inst.output] = makesigned(logic[inst.operator](
                        getintorvalue(inst.left, wirevalues), inst.right))
            # AND, OR operator
            elif inst.operator in ['AND', 'OR']:
                if isvalid(inst.left, wirevalues) and isvalid(inst.right, wirevalues):
                    wirevalues[inst.output] = makesigned(logic[inst.operator](
                        getintorvalue(inst.left, wirevalues), getintorvalue(inst.right, wirevalues)))

    print(wirevalues['a'])


def isvalid(val, dict):
    return val in dict or isint(val)


def getintorvalue(val, dict):
    return val if isint(val) else dict[val]


def makesigned(n):
    return n & 0xffff


runcircuit(instructions)
runcircuit(instructions, True)
