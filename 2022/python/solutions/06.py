import file_reader

lines = file_reader.get_lines(__file__)
inpt = lines[0]

def find_first_marker(count, inpt):
    for i in range(len(inpt)):
        word = inpt[i:i+count]
        newword = ''.join(set(word))
        if len(newword) == count:
            return i + count

print(find_first_marker(4, inpt))
print(find_first_marker(14, inpt))
