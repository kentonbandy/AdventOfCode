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
totalheight = 0

def stackheight():
    return max([y for (_,y) in chamber])

def collapse():
    global chamber
    # get the highest y value in each column
    highestys = []
    for i in range(7):
        maxy = 0
        for coord in chamber:
            if coord[0] == i: maxy = max(maxy,coord[1])
        highestys.append(maxy)
    # the new floor is at the lowest highest y. IT MAKES SENSE SHUT UP
    newfloor = min(highestys)
    newchamber = set()
    for coord in chamber:
        if coord[1] >= newfloor:
            newchamber.add((coord[0],coord[1]-newfloor))
    global totalheight
    totalheight += newfloor
    chamber = newchamber

magicrockmath = 15_435 + ((1_000_000_000_000 - 15_435) % 6_860)

while rockcount < magicrockmath:
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
        # DON'T LOOK
        #if jetind % len(jets) == 0:
            #print("height: " + str(totalheight), rockcount)
            #rockcount = 0
            #totalheight = 0
        # move down
        for coord in rock:
            if (coord[0],coord[1]-1) in chamber:
                atrest = True
        if atrest:
            chamber.update([(x,y) for [x,y] in rock])
            if stackheight() > 1000: collapse()
            if rockcount == 2022: print(stackheight() + totalheight)    # part 1
        else:
            for coord in rock:
                coord[1] -= 1

print(stackheight() + totalheight + (145_772_592 * 10_844))             # part 2

# magic rock math, because I ain't got time to write the code right now
# do 15_435 + (1_000_000_000_000 - 15_435) % 6_860, get total
# add 145_772_592 * 10_844