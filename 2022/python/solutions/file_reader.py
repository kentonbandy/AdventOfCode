def get_lines(file_num):
    """Returns a list of strings representing each line in the given file number"""
    filepath = "{}\\inputs\\{}.txt".format('\\'.join(__file__.split('\\')[:-2]), file_num)
    with open(filepath) as file:
        return [line.rstrip() for line in file.readlines()]

def get_int_lines(file_num):
    """Returns a list of integers or None representing each line in the given file containing integers"""
    lines = get_lines(file_num)
    for i in range(len(lines)):
        try:
            lines[i] = int(lines[i])
        except ValueError:
            lines[i] = None
    return lines

def remove_none(lst):
    """Removes all None values from the passed list and returns the filtered list"""
    return list(filter(lambda i: i != None, lst))