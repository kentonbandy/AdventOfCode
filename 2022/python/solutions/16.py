import sys
import file_reader

lines = [line.split('; ') for line in file_reader.get_lines(__file__)]
valves = []

class Valve:
    def __init__(self,name,flow,tunnelnames):
        self.name = name
        self.flow = flow
        self.tunnelnames = tunnelnames
        self.tunnels = []
        self.open = False
        self.visited = False
        self.distance = 0

def buildmap(lines: list):
    for line in lines:
        firsthalf = line[0].split(' ')
        name = firsthalf[1]
        flow = int(firsthalf[4].split('=')[1])
        tunnelnames = line[1].split('valves' if 'valves' in line[1] else 'valve')[1].strip().split(', ')
        valves.append(Valve(name,flow,tunnelnames))
    set_tunnels()
    valves.sort(key=lambda v: v.flow,reverse=True)

def set_tunnels():
    for valve in valves:
        for name in valve.tunnelnames:
            valve.tunnels.append(next(t for t in valves if t.name == name))

def get_directions(current: Valve):
    closed_nonzero = list(filter(lambda v : not v.open and v.flow > 0 and v.name != current.name,valves))
    if len(closed_nonzero) == 0: return None
    if len(closed_nonzero) == 1: return findpath(current,closed_nonzero[0])
    priorities = {}
    # get valve distances first
    for valve in closed_nonzero:
        priorities[valve.name] = getshortestpathdist(current,valve)
    maxdist = max([priorities[key] for key in priorities])
    # calculate valve priority
    for valve in closed_nonzero:
        priorities[valve.name] = valve.flow if maxdist == priorities[valve.name] else valve.flow * (maxdist - priorities[valve.name])
    maxpriority = max([v for v in priorities.values()])
    target = next(v for v in closed_nonzero if priorities[v.name] == maxpriority)
    return findpath(current,target)

def findpath(current: Valve,target: Valve):
    getshortestpathdist(current,target)
    return buildpath(current,target)

def getshortestpathdist(current, target):
    # clear properties used in search
    for valve in valves:
            valve.distance = sys.maxsize
            valve.visited = False
    current.distance = 0
    uwd = set([current]) # unvisited with distance

    while current != target:
        for valve in current.tunnels:
            if valve in uwd:
                valve.distance = min(valve.distance, current.distance + 1)
            elif not valve.visited:
                valve.distance = current.distance + 1
                uwd.add(valve)
        
        current.visited = True
        uwd.remove(current)
        current = sorted(list(uwd), key = lambda v: v.distance)[0]
    
    return current.distance

def buildpath(current: Valve, target: Valve):
    #build path using set distances
    path = []
    currentname = current.name
    while current != target:
        nextvalve = next((v for v in valves if v.distance == current.distance + 1), None)
        if nextvalve is None:
            path = []
            current = next(v for v in valves if v.name == currentname)
        else:
            path.append(nextvalve)
            current = nextvalve

    return path

buildmap(lines)
current = next(v for v in valves if v.name == "AA")
minutes = 0
flow = 0
totalflow = 0
directions = get_directions(current)
while minutes < 30:
    totalflow += flow
    minutes += 1
    if directions is None: continue
    elif len(directions) == 0:
        print("minute " + str(minutes))
        print("open " + current.name)
        current.open = True
        flow += current.flow
        directions = get_directions(current)
    elif len(directions) > 0:
        current = directions[0]
        directions.pop(0)

print(totalflow)