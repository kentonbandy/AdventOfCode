import file_reader

file_num = __file__.split("\\")[-1].split('.')[0]
lines = file_reader.get_lines(file_num)
