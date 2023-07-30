import file_reader
import itertools
import sys

lines = file_reader.get_lines(__file__)


def build_dict(linestrings):
    linedict = {}
    for line in linestrings:
        linelist = [word for word in line.rstrip('.').split()]
        num = int(linelist[3])
        if linelist[2] == 'lose':
            num *= -1
        linedict[(linelist[0], linelist[10])] = num
    return linedict


def optimize_happiness(hdict, addname=None):
    names = list(set([key[0] for key in hdict.keys()]))
    if addname is not None:
        names.append(addname)
    permutations = list(itertools.permutations(range(len(names))))
    optimal_happiness = -sys.maxsize
    for perm in permutations:
        this_happiness = run_permutation(perm, names, hdict, addname)
        optimal_happiness = max(this_happiness, optimal_happiness)
    return optimal_happiness


def run_permutation(perm, names, hdict, addname):
    current_happiness = 0
    for i, val in enumerate(perm):
        key = (names[val], names[perm[0]]) if i == len(
            perm) - 1 else (names[val], names[perm[i+1]])
        if addname in key:
            continue
        current_happiness += hdict[key] + hdict[(key[1], key[0])]
    return current_happiness


happiness_dict = build_dict(lines)
print(optimize_happiness(happiness_dict))
print(optimize_happiness(happiness_dict, 'me'))
