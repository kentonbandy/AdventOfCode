import file_reader

lines = [[tuple(map(int, pair.split(','))) for pair in line.split(' -> ')] for line in file_reader.get_lines(__file__)]

def drawmap(lines: list):
    cavemap = set()
    (x,y) = 0,0
    for line in lines:
        for i, coord in enumerate(line):
            if i == 0:
                (x,y) = coord
                cavemap.add(coord)
            elif x == coord[0]:
                while y != coord[1]:
                    y += 1 if coord[1] > y else -1
                    cavemap.add((x,y))
            elif y == coord[1]:
                while x != coord[0]:
                    x += 1 if coord[0] > x else -1
                    cavemap.add((x,y))
    return cavemap

def dropsand(cavemap: set, sandfall=(500,0)):
    lowest = max([rock[1] for rock in list(cavemap)])
    floor = lowest + 2
    sandcount = 0
    part1 = None

    def settle(coord, sandcount):
        cavemap.add(coord)
        return (sandcount + 1, False)

    while sandfall not in cavemap:
        falling = True
        (x,y) = sandfall
        while falling:
            if y == floor - 1: (sandcount,falling) = settle((x,y),sandcount)
            if y > lowest and part1 is None: part1 = sandcount
            if (x,y+1) not in cavemap: y += 1
            elif (x-1,y+1) not in cavemap:
                x -= 1
                y += 1
            elif (x+1,y+1) not in cavemap:
                x += 1
                y += 1
            else: (sandcount,falling) = settle((x,y),sandcount)
    return (part1, sandcount)

print(dropsand(drawmap(lines)))