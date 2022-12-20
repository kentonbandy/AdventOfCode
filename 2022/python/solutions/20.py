import file_reader


class Mixnum:
    def __init__(self, val):
        self.val = val


def mix(order, d_key=None, times=1):
    if d_key is not None:
        for mn in order:
            mn.val *= d_key
    mixnums = order[:]

    for _ in range(times):
        for mixnum in order:
            i = mixnums.index(mixnum)
            maxind = len(order) - 1
            if i + mixnum.val > 0:
                newi = ((i + mixnum.val) % maxind)
            else:
                quot = int(-(i+mixnum.val) / maxind)
                newi = (maxind * (quot+1)) + (i+mixnum.val)
            mixnums.insert(newi, mixnums.pop(i))
    return mixnums


def get_grove_coords(mixnums):
    z = next(mixnums.index(m) for m in mixnums if m.val == 0)
    l = len(mixnums)
    a = mixnums[(z + 1000) % l].val
    b = mixnums[(z + 2000) % l].val
    c = mixnums[(z + 3000) % l].val
    return sum([a, b, c])


order = [Mixnum(n) for n in file_reader.get_int_lines(__file__)]

mixnums1 = mix(order)
print(get_grove_coords(mixnums1))   # part 1
mixnums2 = mix(order, 811589153, 10)
print(get_grove_coords(mixnums2))   # part 2