import file_reader

groups = [[eval(line) for line in group] for group in file_reader.get_line_groups(__file__)]

def compare(groups):
    inds = []
    for i, group in enumerate(groups):
        left = group[0]
        right = group[1]
        inorder = isinorder(left,right)
        if inorder: inds.append(i+1)
    return sum(inds)

def isinorder(left, right):
    if isinstance(left, list) and len(left) == 0:
        if isinstance(right, list) and len(right) == 0: return None
        else: return True
    if isinstance(right, list) and len(right) == 0: return False
    if isinstance(left, int) and isinstance(right, int):
        if right - left > 0: return True
        if right - left < 0: return False
        else: return None
    if isinstance(left, int) and isinstance(right, list): left = [left]
    if isinstance(right, int) and isinstance(left, list): right = [right]
    for i, el in enumerate(left):
        if i >= len(right): return len(right) > 0
        inorder = isinorder(el, right[i])
        if inorder is not None: return inorder
        if i == len(right) - 1 and len(left) > len(right): return False
    return len(right) >= len(left)

def finddividerinds(lst):
    groups.append([[[2]],[[6]]])
    d1,d2 = 1,1
    for packetgroup in lst:
        for packet in packetgroup:
            if not isinorder([[2]], packet): d1 += 1
            if not isinorder([[6]], packet): d2 += 1
    return d1 * d2

print(compare(groups))
print(finddividerinds(groups))