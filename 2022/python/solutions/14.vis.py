import file_reader
import os
import time

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

def dropsand(cavemap: set, sandfall = (500,0)):
    floor = max([rock[1] for rock in list(cavemap)]) + 3
    xvals = sorted([rock[0] for rock in list(cavemap)])
    xmin = xvals[0] - 100
    xmax = xvals[-1] + 100

    def buildframe():
        frame = [[' ' for _ in range(xmax-xmin+1)] for _ in range(floor)]
        for (x,y) in list(cavemap):
            frame[y][x-xmin] = '#'
        frame[-1] = ['#' for _ in range(len(frame[-1]))]
        return frame

    frame = buildframe()

    def draw(currentsand):
        #time.sleep(0.018) #(for the small input)
        os.system('cls')
        frame[currentsand[1]][currentsand[0]-xmin] = '.'
        thisframe = '\n'.join([' '.join(line) for line in frame])
        print(thisframe)
        frame[currentsand[1]][currentsand[0]-xmin] = ' '

    while sandfall not in cavemap:
        falling = True
        (x,y) = sandfall
        while falling:
            draw((x,y))
            if y == floor - 2:
                cavemap.add((x,y))
                frame[y][x-xmin] = '.'
                falling = False
            if (x,y+1) not in cavemap: y += 1
            elif (x-1,y+1) not in cavemap:
                x -= 1
                y += 1
            elif (x+1,y+1) not in cavemap:
                x += 1
                y += 1
            else:
                cavemap.add((x,y))
                frame[y][x-xmin] = '.'
                falling = False

dropsand(drawmap(lines))