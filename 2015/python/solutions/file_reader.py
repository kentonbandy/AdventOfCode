def get_lines(path):
    """Returns a list of strings representing each line in the text file that corresponds with the given path"""
    with open(get_input_filepath(path)) as file:
        return [line.rstrip() for line in file.readlines()]

def get_line_groups(path):
    """Returns a list of 'groups' - sections of input delineated by blank lines. Each group is split into a lits of lines"""
    with open(get_input_filepath(path)) as file:
        return [group.split('\n') for group in file.read().split('\n\n')]

def get_int_lines(path):
    """Returns a list of integers or None representing each line in the given file containing integers"""
    lines = get_lines(path)
    for i in range(len(lines)):
        try:
            lines[i] = int(lines[i])
        except ValueError:
            lines[i] = None
    return lines

def remove_none(lst):
    """Removes all None values from the passed list and returns the filtered list"""
    return list(filter(lambda i: i != None, lst))

def get_input_filepath(solutionpath):
    file_num = solutionpath.split("\\")[-1].split('.')[0]
    return "{}\\inputs\\{}.txt".format('\\'.join(__file__.split('\\')[:-2]), file_num)