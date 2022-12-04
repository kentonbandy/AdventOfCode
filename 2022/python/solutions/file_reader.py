def get_lines(filepath):
    """Returns a list of strings representing each line in the given file"""
    with open(filepath) as file:
        return [line.rstrip() for line in file.readlines()]

def get_int_lines(filepath):
    """Returns a list of integers or None representing each line in the given file containing integers"""
    lines = get_lines(filepath)
    for i in range(len(lines)):
        try:
            lines[i] = int(lines[i])
        except ValueError:
            lines[i] = None
    return lines

def remove_none(lst):
    """Removes all None values from the passed list and returns the filtered list"""
    return list(filter(lambda i: i != None, lst))