import itertools


def get_index_permutations(lst):
    return list(itertools.permutations(range(len(lst))))


def get_permutations(lst):
    return list(itertools.permutations(lst))

def stars_bars(stars, bars, min = 0):
    filt = lambda x : (x[0] + x[1] + x[2]) <= 100
    return filter(filt, list(itertools.combinations(range(min, stars), bars)))