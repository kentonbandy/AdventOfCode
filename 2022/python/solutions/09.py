import file_reader

lines = list(map(lambda l: [l[0],int(l[1])], [line.split(' ') for line in file_reader.get_lines(__file__)]))

class Knot:
    def __init__(self):
        self.x = 0
        self.y = 0
        self.pos = set()
        self.pos.add((0,0))
        # set((0,0)) = {0} but adding (0,0) after init = {(0,0)} ??? why python :'(

    def mark(self):
        self.pos.add((self.x,self.y))

    def follow(self, knot):
        x,y = 0,0
        if abs(knot.x - self.x) > 1 or abs(knot.y - self.y) > 1:
            x = knot.x - self.x
            y = knot.y - self.y
        # clamp x and y changes to -1:1
        self.x += sorted([-1, x, 1])[1]
        self.y += sorted([-1, y, 1])[1]
        self.mark()

knots = [Knot() for _ in range(10)]

for [d, m] in lines:
    head = knots[0]
    while m > 0:
        if d == 'U': head.y += 1
        elif d == 'D': head.y -= 1
        elif d == 'L': head.x -= 1
        elif d == 'R': head.x += 1
        for i in range(9):
            knots[i+1].follow(knots[i])
        m -= 1

print(len(knots[1].pos)) # part 1
print(len(knots[9].pos)) # part 2
