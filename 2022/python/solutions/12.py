import file_reader

key = 'SEabcdefghijklmnopqrstuvwxyz'
lines = [[key.index(c) for c in line] for line in file_reader.get_lines(__file__)]

class Node:
    def __init__(self, val):
        self.visited = False
        self.val = val
        self.dis = None
        self.options = []

def load_height_map(lines, part2 = False):
    nodes = [[Node(n) if n != key.index('E') else Node(key.index('z')) for n in line] for line in lines]

    #set options
    for y, row in enumerate(nodes):
        for x, node in enumerate(row):
            node.xy = (x,y)
            if node.val == key.index("S"):
                node.val = key.index('a')
                if not part2:
                    current = node
            if lines[y][x] == key.index('E'):
                if part2:
                    current = node
                    end = None
                else:
                    end = node
            addoptions(node, nodes, row, part2)
    
    current.dis = 0
    unvisited_with_distance = set([current])
    
    return (current, end, unvisited_with_distance)

def addoptions(node, nodes, row, part2):
    (x,y) = node.xy
    if y > 0:
        checkadd_option(node, nodes[y-1][x], part2)
    if y < len(nodes)-1:
        checkadd_option(node, nodes[y+1][x], part2)
    if x > 0:
        checkadd_option(node, nodes[y][x-1], part2)
    if x < len(row)-1:
        checkadd_option(node, nodes[y][x+1], part2)

def checkadd_option(node, option, part2):
    if (node.val - option.val) <= 1 if part2 else (option.val - node.val) <= 1:
        node.options.append(option)

(current, end, unvisited_with_distance) = load_height_map(lines)
(current2, end2, unvisited_with_distance2) = load_height_map(lines, True)

def find_shortest_path(current, uwd, end):
    while (current.val != key.index('a')) if end is None else(current != end):
        for option in current.options:
            if option in uwd:
                option.dis = min(option.dis, current.dis + 1)
            elif not option.visited:
                option.dis = current.dis + 1
                uwd.add(option)
        
        current.visited = True
        uwd.remove(current)
        current = sorted(list(uwd), key = lambda n: n.dis)[0]
        
    return current.dis

print(find_shortest_path(current, unvisited_with_distance, end))      # part 1
print(find_shortest_path(current2, unvisited_with_distance2, None))   # part 2