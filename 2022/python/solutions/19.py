import file_reader


lines = [line.split(' ') for line in file_reader.get_lines(__file__)]
blueprints = [[line[6], line[12], line[18], line[21], line[27], line[30]] for line in lines]
