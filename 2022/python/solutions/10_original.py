import file_reader

lines = map(lambda l: [l[0], int(l[1])] if len(l) > 1 else l, [line.split(' ') for line in file_reader.get_lines(__file__)])
cycle = 0
x = 1
nums = [20,60,100,140,180,220]
i = 0
screen = []

def docycle(cycle, x):
    if len(screen) == 0 or len(screen[-1]) == 40:
        screen.append([])
    localcycle = cycle % 40
    screen[-1].append('#' if localcycle >= x-1 and localcycle <= x+1 else ' ') #problem calls for '.' but it's easier to read with ' '
    return cycle + 1

for line in lines:
    cycle = docycle(cycle, x)
    if line[0] == "addx":
        cycle = docycle(cycle, x)
        if i < len(nums) and cycle >= nums[i]:
            nums[i] = nums[i] * x
            i += 1
        x += line[1]

print(sum(nums))            #part 1

for line in screen:         #part 2
    for pix in line:
        print(pix, end='')
    print()