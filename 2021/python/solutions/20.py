import file_reader


"""https://adventofcode.com/2021/day/20"""


def enhance():
    lines = file_reader.get_lines('2021/python/inputs/20.txt')
    image_enhancement_algorithm = lines[0]
    image = lines[2:]
    enhancements = 50
    pad_image(image, 100) # part 2 needs minimum 100 padding

    for i in range(enhancements):
        image = process_image(image, image_enhancement_algorithm)
        if i == 1: print(count_light_pixels(image)) # part 1 solution

    print(count_light_pixels(image)) # part 2 solution

def pad_image(image: list, padding: int):
    # pad image with {padding} rows/columns of dark pixels on top, bottom, left, right
    new_width = len(image[0]) + (padding * 2)
    for i in range(len(image)):
        image[i] = ('.' * padding) + image[i] + ('.' * padding)
    for _ in range(padding):
        image.insert(0, "." * new_width)
        image.append("." * new_width)


def process_image(image: list, algo: str):
    # run analyze_pixel on each pixel of image, return new image
    new_image = []
    new_line = None

    for y in range(1, len(image) - 1):
        new_line = ''
        for x in range(1, len(image[0]) - 1):
            new_line += analyze_pixel(image, x, y, algo)
            if x == len(image[0]) - 2:
                new_image.append(new_line)
    
    return new_image


def analyze_pixel(image: list, x: int, y: int, algo: str):
    # look at 9 pixel area, create binary, convert to decimal, read algo, return pixel
    bnumstr = image[y-1][x-1:x+2] + image[y][x-1:x+2] + image[y+1][x-1:x+2]
    bnumstr = bnumstr.replace('.', '0').replace('#', '1')
    dec = int(bnumstr, 2)
    return algo[dec]


def count_light_pixels(image: list):
    count = 0
    for line in image:
        for pixel in line:
            if pixel == '#':
                count += 1
    return count

enhance()