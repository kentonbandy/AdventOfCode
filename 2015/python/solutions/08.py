import file_reader

lines = [line.replace(' ', '') for line in file_reader.get_lines(__file__)]

def getcountall(strings):
    return sum([len(string) for string in strings])

def getcountunescaped(strings):
    return sum([len(eval(string)) for string in strings])

def part2(strings):
    ttl = 0
    for string in strings:
        ttl += 2 + string.count('\\') + string.count('"')
    return ttl

print(getcountall(lines) - getcountunescaped(lines))
print(part2(lines))
