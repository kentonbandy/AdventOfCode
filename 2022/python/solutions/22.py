import file_reader

groups = file_reader.get_line_groups(__file__)
board = groups[0]
path = []
for c in groups[1][0]:
    if str.isalpha(c):
        path.append(c)
        path.append('')
    else:
        if len(path) == 0: path.append(c)
        else: path[-1] += c
for i, e in enumerate(path):
    if str.isnumeric(e):
        path[i] = int(e)


def changedir(d, turn):
    return (d + 1 if turn == 'R' else d + 3) % 4


def getnext(x,y,d):
    coord = None
    if d == 0:
        if x == len(board[y]) - 1 or board[y][x+1] == ' ':
            wrap = min(board[y].index('.'), board[y].index('#'))
            if board[y][wrap] == '.': coord = (wrap,y)
        elif board[y][x+1] == '.': coord = (x+1,y)
    elif d == 1:
        if y == len(board) - 1 or board[y+1][x] == ' ':
            newy = 0
            while board[newy][x] == ' ': newy += 1
            if board[newy][x] == '.': coord = (x,newy)
        elif board[y+1][x] == '.': coord = (x,y+1)
    elif d == 2:
        if x == 0 or board[y][x-1] == ' ':
            wrap = wrap = max(board[y].rindex('.'), board[y].rindex('#'))
            if board[y][wrap] == '.': coord = (wrap,y)
        elif board[y][x-1] == '.': coord = (x-1,y)
    elif d == 3:
        if y == 0 or board[y-1][x] == ' ':
            newy = len(board) - 1
            while board[newy][x] == ' ': newy -= 1
            if board[newy][x] == '.': coord = (x,newy)
        elif board[y-1][x] == '.': coord = (x,y-1)
    return coord
    

def move(x, y, d, steps):
    for _ in range(steps):
        coord = getnext(x,y,d)
        if coord is None: break
        (x,y) = coord
    return (x,y)

def get_start():
    x = board[0].index('.')
    return (x,0)

def input_password():
    direction = 0
    (x,y) = get_start()
    for inst in path:
        if isinstance(inst, str):
            direction = changedir(direction, inst)
        else:
            (x,y) = move(x,y,direction,inst)
    
    return (1000 * y) + (4 * x) + direction

print(input_password())