import file_reader


lines = [line.split(' ') for line in file_reader.get_lines(__file__)]
blueprints = [[int(n) for n in [line[6], line[12], line[18], line[21], line[27], line[30]]] for line in lines]


def collect(ore, clay, obs, geo, orebot, claybot, obsbot, geobot):
    ore += orebot
    clay += claybot
    obs += obsbot
    geo += geobot
    return (ore, clay, obs, geo)

def simulate(blueprint, id):
    ore = 0
    clay = 0
    obs = 0
    geo = 0
    bots = [1,0,0,0] # orebot, claybot, obsbot, geobot
    minutes = 24

    for _ in range(minutes):
        # start build
        # needs to be smarter - maybe calculate how many turns away each type of bot is
        build = None
        if obs >= blueprint[5] and ore >= blueprint[4]:
            obs -= blueprint[5]
            ore -= blueprint[4]
            build = 3
        elif clay >= blueprint[3] and (ore >= blueprint[2] or (ore >= blueprint[1] and clay >= blueprint[3] - (blueprint[2] - blueprint[1]))):
            clay -= blueprint[3]
            ore -= blueprint[2]
            build = 2
        elif ore >= blueprint[1]:
            ore -= blueprint[1]
            build = 1

        # collect
        ore += bots[0]
        clay += bots[1]
        obs += bots[2]
        geo += bots[3]

        # complete build
        if build is not None:
            bots[build] += 1
    
    return geo * id

print(simulate(blueprints[0], 1))