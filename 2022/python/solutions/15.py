import file_reader

sensordata = [[tuple(int(quarter.split('=')[1]) for quarter in half.split(',')) for half in line.split(': ')] for line in file_reader.get_lines(__file__)]
sensors = []
perims = set()

def find_distance(p1, p2):
    return abs(p1[0]-p2[0]) + abs(p1[1]-p2[1])

class Sensor:
    def __init__(self, coords, beacon, row):
        self.x = coords[0]
        self.y = coords[1]
        self.beac = beacon
        self.dist = find_distance(coords, beacon)
        self.ymin = self.y - self.dist
        self.ymax = self.y + self.dist
        self.includesrow = self.ymin > row or self.ymax < row
        self.get_perimeter()

    def get_perimeter(self):
        max = 4_000_000
        y = self.y - self.dist - 1
        x = self.x
        offset = 0
        while offset >= 0:
            if y >= 0 and y <= max:
                left = x - offset
                right = x + offset
                if left >= 0 and left <= max: perims.add((x - offset, y))
                if right >= 0 and right <= max: perims.add((x + offset, y))
            y += 1
            offset = offset + 1 if y <= self.y else offset - 1
            
def no_beacon_in_row(sensordata, row=2_000_000):
    nobeacon = set()
    beacons = set()
    for [sensor,beacon] in sensordata:
        sensor = Sensor(sensor,beacon,row)
        sensors.append(sensor)
        if sensor.y == row: nobeacon.add(sensor.x)
        if sensor.includesrow: continue
        dif = abs(sensor.y - row)
        xmin = sensor.x - (sensor.dist-dif)
        xmax = sensor.x + (sensor.dist-dif)
        for i in range(xmin,xmax+1):
            nobeacon.add(i)
        if beacon[1] == row: beacons.add(beacon[0])
    for beacon in beacons: nobeacon.remove(beacon)
    return len(nobeacon)

def find_distress_beacon(sensors):
    for perim in perims:
        found = True
        for sensor in sensors:
            if find_distance((sensor.x,sensor.y),perim) <= sensor.dist:
                found = False
                break
        if found: return (perim[0] * 4_000_000) + perim[1]
    return "oh no"

print(no_beacon_in_row(sensordata))
print(find_distress_beacon(sensors))