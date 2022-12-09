import file_reader

lines = list(map(lambda r: list(map(int,r)),file_reader.get_lines(__file__)))
visible = 0
highscore = 0

def analyze_tree(x,y,row,val):
    vu,vd,vl,vr = True,True,True,True
    u,d,l,r = 0,0,0,0

    for i in reversed(range(x)):
        l += 1
        if row[i] >= val:
            vl = False
            break
    for i in range(x+1,len(row)):
        r += 1
        if row[i] >= val:
            vr = False
            break
    for i in reversed(range(y)):
        u += 1
        if lines[i][x] >= val:
            vu = False
            break
    for i in range(y+1,len(lines)):
        d += 1
        if lines[i][x] >= val:
            vd = False
            break

    isvis = vu or vd or vr or vl
    vis = u * d * r * l
    return (isvis, vis)

for y, row in enumerate(lines):
    for x, val in enumerate(row):
        (isvis, vis) = analyze_tree(x,y,row,val)
        if isvis: visible += 1
        highscore = max(vis, highscore)

print(visible)      #part 1
print(highscore)    #part 2
