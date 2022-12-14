import file_reader

lines = [[int(n) for n in line.split('x')] for line in file_reader.get_lines(__file__)]
sqft = 0
ribbon = 0

for line in lines:
    a = line[0]
    b = line[1]
    c = line[2]
    x = min(a*b,b*c,c*a)
    m = max(a*b,b*c,c*a)
    tot = (2*a*b) + (2*b*c) + (2*c*a) + x
    ribbon += sum(sorted([a,b,c])[:2]) * 2 + (a*b*c)
    sqft += tot

print(sqft)
print(ribbon)