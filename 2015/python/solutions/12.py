import file_reader
import re
import json

jsonstring = file_reader.get_lines(__file__)[0]

# part 1
numbers_re = r'-?\d+(?:\.\d+)?'


def get_sum(regex, jsonstring):
    numbers = [int(num) for num in re.findall(regex, jsonstring)]
    return sum(numbers)


print(get_sum(numbers_re, jsonstring))

# part 2
jsonobj = json.loads(jsonstring)


def sum_no_red(thing):
    return sum_list(thing) if isinstance(thing, list) else sum_dict(thing)


def sum_list(lst, total=0):
    for item in lst:
        if isinstance(item, int):
            total += item
        elif not isinstance(item, str):
            total += sum_no_red(item)
    return total


def sum_dict(dct, total=0, redval='red'):
    for val in dct.values():
        if val == redval:
            return 0
        elif isinstance(val, int):
            total += val
        elif isinstance(val, dict) or isinstance(val, list):
            total += sum_no_red(val)
    return total


print(sum_no_red(jsonobj))
