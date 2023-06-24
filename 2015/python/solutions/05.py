import file_reader

strings = file_reader.get_lines(__file__)

#part 1

def is_nice(string):
    c3v = contains_3_vowels(string)
    hdl = has_double_letter(string)
    nb = no_baddies(string)
    return nb and c3v and hdl

def contains_3_vowels(string):
    num = 0
    for char in "aeiou":
        num += string.count(char)
        if num >= 3: return True
    return False

def has_double_letter(string):
    if len(string) < 2: return False
    for i in range(1, len(string)):
        if string[i] == string[i - 1]:
            return True
    return False

def no_baddies(string):
    for pair in ["ab", "cd", "pq", "xy"]:
        if string.find(pair) > -1: return False
    return True

def count_nice_strings(strings):
    count = 0
    for s in strings:
        if is_nice(s): count += 1
    print(count)

count_nice_strings(strings)

#part 2

def has2pair(string):
    if len(string) < 4: return False
    for i in range(len(string) - 2):
        pair = string[i:i+2]
        sub1 = string[:i]
        sub2 = string[i+2:]
        if sub1.find(pair) > -1 or sub2.find(pair) > -1:
            return True
    return False

def has_repeating_letter(string):
    if len(string) < 3: return False
    for i in range(len(string) - 2):
        if string[i] == string[i+2]: return True
    return False

def count_nice_strings2(strings):
    count = 0
    for string in strings:
        if has2pair(string) and has_repeating_letter(string):
            count += 1
    print(count)

count_nice_strings2(strings)