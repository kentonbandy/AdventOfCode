import file_reader
import time
import os

lines = list(map(lambda l: [l[0],int(l[1])], [line.split(' ') for line in file_reader.get_lines(__file__)]))

class Knot:
    def __init__(self):
        self.x = 0
        self.y = 0

    def follow(self, knot):
        x,y = 0,0
        if abs(knot.x - self.x) > 1 or abs(knot.y - self.y) > 1:
            x = knot.x - self.x
            y = knot.y - self.y
        # clamp x and y changes to -1:1
        self.x += sorted([-1, x, 1])[1]
        self.y += sorted([-1, y, 1])[1]

knots = [Knot() for _ in range(10)]
head = knots[0]
totalframes = sum([line[1] for line in lines])
framecount = 0
#settings
height = 21
width = 31
bearingspace = 8
fps = 61 # not actual frames per second, but close enough

for [d, m] in lines:
    while m > 0:
        if d == 'U': head.y += 1
        elif d == 'D': head.y -= 1
        elif d == 'L': head.x -= 1
        elif d == 'R': head.x += 1
        for i in range(9):
            knots[i+1].follow(knots[i])
        m -= 1

        # visualizer
        frame = [['+' if ((head.x + i) % bearingspace == 0 and (head.y + j) % bearingspace == 0) else '.' for i in range(width)] for j in range(height)]
        for knot in knots:
            x = knot.x - head.x + int(width/2)
            y = knot.y - head.y + int(height/2)
            frame[y][x] = '#'
        frame = '\n'.join([' '.join(line) for line in frame])
        os.system('cls')
        print(frame)
        framecount += 1
        print(f'Frame {framecount}/{totalframes}')
        time.sleep(1/fps)