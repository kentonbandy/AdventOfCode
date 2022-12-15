import file_reader

sensors = [[tuple(int(quarter.split('=')[1]) for quarter in half.split(',')) for half in line.split(': ')] for line in file_reader.get_lines(__file__)]
nobeacon = set()
row = 10

for [sensor,beacon] in sensors:
    print(nobeacon)
    if sensor[1] == row: nobeacon.add(sensor[0])
    print(sensor,beacon)
    dis = (abs(sensor[0] - beacon[0])) + (abs(sensor[1] - beacon[1]))
    print(dis)
    ymin = sensor[1] - dis
    ymax = sensor[1] + dis
    if ymin > row or ymax < row: continue
    dif = row - ymin
    print(dif)
    xmin = sensor[0] - dif
    xmax = sensor[0] + dif
    print(xmin, xmax)
    for i in range(xmin,xmax + 1):
        nobeacon.add(i)
    if beacon[1] == row: nobeacon.remove(beacon[0])

print(len(nobeacon))