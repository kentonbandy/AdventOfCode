import file_reader

lines = file_reader.get_lines(__file__)

class Dir:
    def __init__(self, name, parent):
        self.name = name
        self.children = []
        self.parent = parent
        self.size = 0
    
    def propogate_size(self, num):
        at = self
        self.size += num
        while at.parent is not None:
            at.parent.size += num
            at = at.parent

def docommand(at, command):
    if command[0] == "cd":
        if command[1] == "..":
            return at.parent
        elif command[1] == "/":
            return head
        else:
            for child in at.children:
                if child.name == command[1]:
                    return child

def find_dir_to_delete(sorted_sizes):
    free_space = 70_000_000 - head.size
    diff = 30_000_000 - free_space
    for size in sorted_sizes:
        if size > diff:
            return size

head = Dir("/", None)
at = head
dirs = []

for line in lines:
    if line == "$ ls": continue
    elif line.startswith("$"):
        at = docommand(at, line.split(" ")[1:])
    elif line.startswith("dir"):
        name = line.split(" ")[1]
        newdir = Dir(name, at)
        at.children.append(newdir)
        dirs.append(newdir)
    else:
        at.propogate_size(int(line.split(" ")[0]))

sorted_sizes = sorted(map(lambda d: d.size, dirs))

#part 1
print(sum(filter(lambda d: d <= 100000, sorted_sizes)))

#part 2
print(find_dir_to_delete(sorted_sizes))