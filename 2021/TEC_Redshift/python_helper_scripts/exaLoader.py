import file_reader

"""
The inputs need to be hardcoded into the TEC Redshift exas so this script generates scripts to be copy/pasted into exas.
This will generate <1000 lines of code for each exa with instructions for those exas to write the input values to files.
Max lines for exas and files == 1000.
"""

problem_num = '01'
lines = file_reader.get_lines(f'2021/python/inputs/{problem_num}.txt')

exascript = ''
data = 'DATA'
exa = 0
for i in range(len(lines)):
    # pass input data. format is 'DATA 1 2 3 4...'. each line has a 24 char limit.
    nextnum = f' {lines[i]}'
    if (len(data) + len(nextnum) <= 24):
        data += nextnum
    else:
        data += '\n'
        exascript += data
        data = f'DATA {lines[i]}'
exascript += data

with open(f'2021/TEC_Redshift/python_helper_scripts/exa_scripts/{problem_num}.txt', 'w') as f:
    f.write(exascript)