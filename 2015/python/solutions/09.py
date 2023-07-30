import sys
import file_reader
import itertools

lines = file_reader.get_lines(__file__)
distances = [{'cities': [lst[0], lst[2]], 'distance': int(lst[4])} for lst in [line.split() for line in lines]]
dmap = {tuple(sorted(distance['cities'])): distance['distance'] for distance in distances}

cities = list(set([city for citypair in [distance['cities'] for distance in distances] for city in citypair]))
permutations = list(itertools.permutations(range(len(cities))))

min_distance = sys.maxsize
max_distance = 0

for permutation in permutations:
    distance = 0
    for i in range(len(permutation) - 1):
        distance += dmap[tuple(sorted([cities[permutation[i]], cities[permutation[i + 1]]]))]
    min_distance = min(min_distance, distance)
    max_distance = max(max_distance, distance)

print(min_distance)
print(max_distance)