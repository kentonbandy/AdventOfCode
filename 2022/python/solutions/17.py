import file_reader

jets = file_reader.get_lines(__file__)[0]

rocks = [
    [(0,0),(1,0),(2,0),(3,0)],
    [(1,0),(0,1),(1,1),(2,1),(1,2)],
    [(0,0),(1,0),(2,0),(2,1),(2,2)],
    [(0,0),(0,1),(0,2),(0,3)],
    [(0,0),(1,0),(0,1),(1,1)]
]
chamber = set([(0,0),(1,0),(2,0),(3,0),(4,0),(5,0),(6,0)])
rockcount = 0
jetlen = len(jets)
jetind = 0

def stackheight():
    return max([y for (_,y) in chamber])

while rockcount < 2022:
    rock = [[x+2, y+stackheight()+4] for (x,y) in rocks[rockcount % 5]]
    rockcount += 1
    # alternate gas and falling, starting with gas
    # coming to rest counts as a falling turn
    atrest = False
    while not atrest:
        instruction = jets[jetind % jetlen]
        # jets
        if jets[jetind % jetlen] == '>' and max([c[0] for c in rock]) < 6:
            move = True
            for coord in rock:
                if (coord[0]+1,coord[1]) in chamber:
                    move = False
            if move:
                for coord in rock: coord[0] += 1
        elif jets[jetind % jetlen] == '<' and min([c[0] for c in rock]) > 0:
            move = True
            for coord in rock:
                if (coord[0]-1,coord[1]) in chamber:
                    move = False
            if move:
                for coord in rock: coord[0] -= 1
        jetind += 1
        # move down
        for coord in rock:
            if (coord[0],coord[1]-1) in chamber:
                atrest = True
        if atrest:
            chamber.update([(x,y) for [x,y] in rock])
        else:
            for coord in rock:
                coord[1] -= 1

print(stackheight())