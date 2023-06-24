import file_reader

directions = file_reader.get_lines(__file__)[0]

def process_dir(dir, coord, coords):
    (x, y) = coord
    if dir == ">": x += 1
    elif dir == "<": x -= 1
    elif dir == "^": y += 1
    elif dir == "v": y -= 1
    coords.add((x, y))
    return (x, y)

def santa_delivery():
    coord = (0, 0)
    coords = {coord}
    for dir in directions:
        coord = process_dir(dir, coord, coords)
    print(len(coords))

def dual_delivery():
    santa = (0, 0)
    robo = (0, 0)
    coords = {santa}
    for i in range(len(directions) - 1):
        if i % 2 == 0:
            santa = process_dir(directions[i], santa, coords)
        else:
            robo = process_dir(directions[i], robo, coords)
    print(len(coords))



#part 1
santa_delivery()
#part 2
dual_delivery()