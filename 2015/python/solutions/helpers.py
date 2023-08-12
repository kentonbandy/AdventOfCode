import itertools


def get_index_permutations(lst):
    return list(itertools.permutations(range(len(lst))))


def get_permutations(lst):
    return list(itertools.permutations(lst))
