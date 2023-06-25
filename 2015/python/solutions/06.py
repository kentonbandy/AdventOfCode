import file_reader

instructions = file_reader.get_lines(__file__)


def turnup(coord, lights, inc=1):
    lights[coord] = lights[coord] + inc if coord in lights else inc


def turndown(coord, lights):
    if coord in lights:
        lights[coord] -= 1
        if lights[coord] == 0:
            del lights[coord]


actions = ["turn on ", "turn off ", "toggle "]
funcs = {
    actions[0]: lambda coord, lights: lights.add(coord),
    actions[1]: lambda coord, lights: lights.remove(coord) if coord in lights else None,
    actions[2]: lambda coord, lights: lights.remove(
        coord) if coord in lights else lights.add(coord)
}
funcs2 = {
    actions[0]: lambda coord, lights: turnup(coord, lights),
    actions[1]: lambda coord, lights: turndown(coord, lights),
    actions[2]: lambda coord, lights: turnup(coord, lights, 2)
}


def getaction(instruction):
    for action in actions:
        if instruction.startswith(action):
            return action


def parseinstruction(instruction):
    action = getaction(instruction)
    bounds = [[int(bound) for bound in bound.split(',')]
              for bound in instruction.replace(action, '').split(' through ')]
    return (action, bounds)


def dostep(step, lightson, funcdict):
    (action, bounds) = step
    [[x1, y1], [x2, y2]] = bounds
    for x in range(x1, x2 + 1):
        for y in range(y1, y2 + 1):
            funcdict[action]((x, y), lightson)


def light_show(lights, funcdict=funcs):
    steps = [parseinstruction(instruction) for instruction in instructions]
    for step in steps:
        dostep(step, lights, funcdict)
    if type(lights) == type({}):
        print(sum([lights[key] for key in lights.keys()]))
    else:
        print(len(lights))


# part 1
light_show(set())
# part 2
light_show({}, funcs2)
