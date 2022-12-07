import file_reader

file_num = __file__.split("\\")[-1].split('.')[0]
lines = file_reader.get_lines(file_num)
inpt = lines[0]

def find_first_marker(count, inpt):
    for i in range(len(inpt)):
        word = inpt[i:i+count]
        newword = ''.join(set(word))
        if len(newword) == count:
            return i + count

print(find_first_marker(4, inpt))
print(find_first_marker(14, inpt))
