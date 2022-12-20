import file_reader


class Cube:
    def __init__(self, x: int, y: int, z: int, form: str):
        self.x = x
        self.y = y
        self.z = z
        self.coords = (x, y, z)
        self.form = form  # lava/water/None


droplets = [Cube(*[int(n) for n in line.split(',')], None)
            for line in file_reader.get_lines(__file__)]

maxx = max([drop.x for drop in droplets])
minx = min([drop.x for drop in droplets])
maxy = max([drop.y for drop in droplets])
miny = min([drop.y for drop in droplets])
maxz = max([drop.z for drop in droplets])
minz = min([drop.z for drop in droplets])
dropcoords = set([drop.coords for drop in droplets])
water = set()

grid = set()
for x in range(minx-1, maxx+2):
    for y in range(miny-1, maxy+2):
        for z in range(minz-1, maxz+2):
            form = None
            if (x, y, z) in dropcoords:
                form = 'lava'
            elif (x == maxx+1 or x == minx-1 or
                  y == maxy+1 or y == miny-1 or
                  z == maxz+1 or z == minz-1):
                form = 'water'
                water.add((x, y, z))
            grid.add(Cube(x, y, z, form))

change = True
while change:
    change = False
    for cube in filter(lambda c: c.form is None, grid):
        (x, y, z) = cube.coords
        if ((x+1, y, z) in water or (x-1, y, z) in water or
            (x, y+1, z) in water or (x, y-1, z) in water or
                (x, y, z+1) in water or (x, y, z-1) in water):
            cube.form = 'water'
            water.add((x, y, z))
            change = True

air = set(filter(lambda c: c.form is None, grid))


def get_surface_area(drops):
    surface_area = 0
    for drop in drops:
        faces = 6
        for otherdrop in filter(lambda d: d != drop, drops):
            # condition: 2 axes are the same and the other is 1 off
            if drop.x == otherdrop.x and drop.y == otherdrop.y and abs(drop.z - otherdrop.z) == 1:
                faces -= 1
            if drop.y == otherdrop.y and drop.z == otherdrop.z and abs(drop.x - otherdrop.x) == 1:
                faces -= 1
            if drop.x == otherdrop.x and drop.z == otherdrop.z and abs(drop.y - otherdrop.y) == 1:
                faces -= 1

        surface_area += faces

    return surface_area


p1 = get_surface_area(droplets)
print(p1)                           # part 1
print(p1 - get_surface_area(air))   # part 2
