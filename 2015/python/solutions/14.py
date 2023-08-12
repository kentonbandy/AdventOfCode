import file_reader

lines = file_reader.get_lines(__file__)
linelists = [line.split(' ') for line in lines]
reindeer = [
    {
        'name': lst[0],
        'speed': int(lst[3]),
        'move': int(lst[6]),
        'rest': int(lst[13]),
        'ismoving': True,
        'counter': 0,
        'distance': 0,
        'points': 0,
    } for lst in linelists]


def race(seconds):
    for _ in range(seconds):
        for r in reindeer:
            checkprop = r['move'] if r['ismoving'] else r['rest']
            if r['ismoving']:
                r['distance'] += r['speed']
            if r['counter'] == checkprop - 1:
                r['counter'] = 0
                r['ismoving'] = not r['ismoving']
            else:
                r['counter'] += 1
        for wr in getwinners():
            wr['points'] += 1


def getwinners(usepoints=False):
    prop = 'points' if usepoints else 'distance'
    maxvalue = 0
    winners = []
    for r in reindeer:
        maxvalue = max(maxvalue, r[prop])
    for r in reindeer:
        if r[prop] == maxvalue:
            winners.append(r)
    return winners


race(2503)
print(getwinners()[0]['distance'])
print(getwinners(True)[0]['points'])
