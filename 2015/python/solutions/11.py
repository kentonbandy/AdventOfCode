import file_reader

password = file_reader.get_lines(__file__)[0]

alpha = "abcdefghijklmnopqrstuvwxyz"
filtered = "abcdefghjkmnpqrstuvwxyz"


def no_bad_chars(string):
    return first_bad_char(string) is None


# return index of first bad character
def first_bad_char(string):
    bad = 'ilo'
    for i in range(len(string)):
        if string[i] in bad:
            return i
    return None


def has_straight(string):
    for i in range(len(string) - 2):
        if f'{string[i]}{string[i+1]}{string[i+2]}' in alpha:
            return True
    return False


def two_pairs(string):
    # find first occurrence of a pair
    pair_ind = get_pair_ind(string)
    if pair_ind is None:
        return False
    # take remainder of string after pair
    newstring = string[pair_ind + 2:] if pair_ind < len(string) - 1 else ''
    return get_pair_ind(newstring) is not None


# return index of first pair
def get_pair_ind(string):
    for i in range(len(string) - 1):
        if string[i] == string[i+1]:
            return i
    return None


# return next iteration that doesn't have any bad characters
def next_no_bad_chars(string):
    # index of bad character in string
    i = first_bad_char(string)
    newstring = string[:i]
    # index of bad character in alphabet
    index = alpha.index(string[i])
    newstring += alpha[index + 1]
    # fill with a
    while len(newstring) < len(string):
        newstring += 'a'
    return newstring


def is_valid(string):
    return \
        no_bad_chars(string) and \
        has_straight(string) and \
        two_pairs(string)


# return the next iteration
def iterate_password(string):
    # shortcut if bad character(s) present
    if not no_bad_chars(string):
        return next_no_bad_chars(string)
    # indicator for wrap, need to go to the next character
    carry = False

    # iterate backward since we're incrementing
    for i in range(len(string) - 1, -1, -1):
        index = filtered.index(string[i]) + 1
        # last letter - wrap
        if index == len(filtered):
            carry = True
            index = 0
        # replace character with next
        string = string[:i] + filtered[index] + \
            (string[i+1:] if i < len(string) - 1 else '')
        if not carry:
            break
        carry = False
    return string


def generate_password(string):
    while True:
        string = iterate_password(string)
        if is_valid(string):
            return string


newpassword = generate_password(password)
print(newpassword)
print(generate_password(newpassword))
