import file_reader

"""
The inputs need to be hardcoded into the TEC Redshift exas so this script generates scripts to be copy/pasted into exas.
This will generate <1000 lines of code for each exa with instructions for those exas to write the input values to files.
Max lines for exas and files == 1000.
"""

problem_num = '01'
lines = file_reader.get_lines(f'2021/python/inputs/{problem_num}.txt')

exascript = ''
exa = 0
for i in range(len(lines)):
    if i % (999 - exa) == 0:
        exa = int(i / (999 - exa))
        if i != 0:
            exascript += '\n'
        exascript += f'EXA {exa}\n'
        for n in range(exa):
            exascript += 'WAIT\n'
        exascript += 'MAKE\n'
    exascript += f'COPY {lines[i]} F\n'

with open(f'2021/TEC_Redshift/python_helper_scripts/exa_scripts/{problem_num}.txt', 'w') as f:
    f.write(exascript)