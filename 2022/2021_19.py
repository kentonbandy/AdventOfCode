import file_reader
import math


"""https://adventofcode.com/2021/day/19"""


class Beacon:
    def __init__(self, x, y, z):
        self.x = x
        self.y = y
        self.z = z
        # use set so we don't have to worry about dealing with duplicates and can easily compare
        self.distances = set()

    def calculate_distances(self, beacons: list):
        """Calculates distance to each beacon in the provided list. Distances are stored in a set."""
        for beacon in beacons:
            self.distances.add(relative_distance(self, beacon))
        # discard beacon's distance to itself
        self.distances.discard(0.0)


class Scanner:
    def __init__(self, id, beacons):
        self.id = id
        self.beacons = beacons
        self.location = None
        self.calculate_distances()

    def calculate_distances(self):
        """calls the calculate_distances function on each beacon in this scanner's beacons."""
        for beacon in self.beacons:
            beacon.calculate_distances(self.beacons)

    def move(self, x: int, y: int, z: int):
        """moves each beacon in this scanner by the x y and z values provided."""
        for beacon in self.beacons:
            beacon.x += x
            beacon.y += y
            beacon.z += z

    def contains_beacon(self, match_beacon: Beacon):
        """checks to see if the scanner already contains a beacon at the same position."""
        for beacon in self.beacons:
            if same_beacon(beacon, match_beacon):
                return True
        return False

    # the following functions perform an operation on the coordinates of each beacon in the scanner, effectively changing the scanner's orientation in 3d space

    def swap_x_y(self):
        for beacon in self.beacons:
            newy = beacon.x
            beacon.x = beacon.y
            beacon.y = newy

    def swap_x_z(self):
        for beacon in self.beacons:
            newz = beacon.x
            beacon.x = beacon.z
            beacon.z = newz

    def swap_y_z(self):
        for beacon in self.beacons:
            newz = beacon.y
            beacon.y = beacon.z
            beacon.z = newz

    def invert_coord(self, coord: str):
        for beacon in self.beacons:
            if coord == 'x':
                beacon.x = -beacon.x
            elif coord == 'y':
                beacon.y = -beacon.y
            elif coord == 'z':
                beacon.z = -beacon.z


def parse_data(lines: list):
    """takes a list of strings and outputs a list of lists of Beacon objects"""
    scanners = [[]]
    for line in lines:
        if line.startswith('---'):
            continue
        if line == '':
            scanners.append([])
        else:
            ints = [int(num) for num in line.split(',')]
            scanners[-1].append(Beacon(ints[0], ints[1], ints[2]))
    return scanners


def relative_distance(beacon1: Beacon, beacon2: Beacon):
    """returns the distance between the given beacons rounded to four decimal places"""
    diffx = abs(beacon1.x - beacon2.x)
    diffy = abs(beacon1.y - beacon2.y)
    diffz = abs(beacon1.z - beacon2.z)
    # apply pythagorean theorem in three dimensions to get distance between beacons
    return round(math.sqrt((math.sqrt(diffx ** 2 + diffy ** 2) ** 2) + (diffz ** 2)), 4)


def match_beacon(beacon1: Beacon, beacon2: Beacon):
    """returns true if both passed beacons are exactly the same distance from 11 other beacons."""
    matches = beacon1.distances.intersection(beacon2.distances)
    # looking for 12 matching beacons - 11 matching distances plus the beacon itself
    return len(matches) >= 11


def match_scanner(scanner1: Scanner, scanner2: Scanner):
    """returns two of the matching beacons if the scanners share 12 or more beacons, else None."""
    matches = []
    for beacon1 in scanner1.beacons:
        for beacon2 in scanner2.beacons:
            if match_beacon(beacon1, beacon2):
                matches.append((beacon1, beacon2))
                # if there are any matches, we know that 12 beacons are shared. we only need 2 here to be able to align the beacons
                if len(matches) >= 2:
                    return matches
    return None


def same_beacon(beacon1: Beacon, beacon2: Beacon):
    return beacon1.x == beacon2.x and beacon1.y == beacon2.y and beacon1.z == beacon2.z


def get_difs(beacon1: Beacon, beacon2: Beacon):
    xdif = beacon1.x - beacon2.x
    ydif = beacon1.y - beacon2.y
    zdif = beacon1.z - beacon2.z
    return (xdif, ydif, zdif)


def swap_and_invert(abs_beacon1: Beacon, abs_beacon2: Beacon, rel_beacon1: Beacon, rel_beacon2: Beacon, scanner: Scanner):
    """takes two matching beacons from two scanners and matches the orientation of the passed scanner (and all of its beacons)"""
    (xdif, ydif, zdif) = get_difs(abs_beacon1, abs_beacon2)
    (xdif2, ydif2, zdif2) = get_difs(rel_beacon1, rel_beacon2)
    # handle necessary swaps
    while abs(xdif) != abs(xdif2) or abs(ydif) != abs(ydif2) or abs(zdif) != abs(zdif2):
        if abs(xdif) != abs(xdif2):
            if abs(ydif) != abs(ydif2):
                scanner.swap_x_y()
            else:
                scanner.swap_x_z()
        if abs(ydif) != abs(ydif2) and abs(zdif) != abs(zdif2):
            scanner.swap_y_z()
        # reset rel_beacon difs
        (xdif2, ydif2, zdif2) = get_difs(rel_beacon1, rel_beacon2)

    # handle inversions
    if xdif != xdif2:
        scanner.invert_coord('x')
    if ydif != ydif2:
        scanner.invert_coord('y')
    if zdif != zdif2:
        scanner.invert_coord('z')


def align_beacons(scanner: Scanner, beacons: list):
    """aligns beacons to orient with the absolute position scanner."""
    # beacon1 is the matching beacon in scanner1 (absolute) and beacon2 is the match from scanner2 (relative).
    # take two matched beacons. orient them the same way.

    (abs_beacon1, rel_beacon1) = beacons[0]
    (abs_beacon2, rel_beacon2) = beacons[1]
    swap_and_invert(abs_beacon1, abs_beacon2,
                    rel_beacon1, rel_beacon2, scanner)

    # scanner (and its beacons) is now oriented correctly.
    # calculate its offset from the absolute scanner and adjust beacon coordinates.
    xoffset = abs_beacon1.x - rel_beacon1.x
    yoffset = abs_beacon1.y - rel_beacon1.y
    zoffset = abs_beacon1.z - rel_beacon1.z
    scanner.move(xoffset, yoffset, zoffset)
    # set scanner location (relative to absolute scanner) to use for manhattan distance later.
    scanner.location = Beacon(xoffset, yoffset, zoffset)


def process_match(primary_scanner: Scanner, scanner: Scanner, result):
    """aligns the beacons of the scanners, adds all new beacons to the primary_scanner, and recalculates beacon distances in the primary_scanner."""
    align_beacons(scanner, result)
    for beacon in scanner.beacons:
        if not primary_scanner.contains_beacon(beacon):
            primary_scanner.beacons.append(beacon)
    primary_scanner.calculate_distances()


def remove_scanner_by_id(scanners: list, id: int, mapped_scanners: list):
    """removes the scanner with the passed id from the scanners list, removes its beacons, and appends it to the mapped_scanners list."""
    if id is None:
        return
    for i in range(len(scanners)):
        if (scanners[i].id == id):
            scanners[i].beacons = None
            mapped_scanners.append(scanners.pop(i))
            return


def seek_match(primary_scanner: Scanner, scanners: list):
    """runs all necessary processes and returns the id of the scanner if it is a match, otherwise returns None"""
    for scanner in scanners:
        result = match_scanner(primary_scanner, scanner)
        if result is not None:
            process_match(primary_scanner, scanner, result)
            return scanner.id
    return None


def larges_manhattan_distance(scanners: list):
    """calculates and returns the largest manhattan distance between scanners in the scanners list."""
    manhattan = 0
    for i in range(len(scanners)):
        comp = scanners.pop(i)
        for scanner in scanners:
            mh = (
                abs(comp.location.x - scanner.location.x) +
                abs(comp.location.y - scanner.location.y) +
                abs(comp.location.z - scanner.location.z)
            )
            manhattan = max(manhattan, mh)
        scanners.insert(i, comp)
    return manhattan


def build_beacon_map():
    """builds a 3d map of all of the beacons detected by scanners and prints the desired results."""
    lines = file_reader.get_lines('2022/inputs/2021_19.txt')
    data = parse_data(lines)
    scanners = [Scanner(data.index(group), group) for group in data]
    scanner0 = scanners.pop(0)
    # this is our absolute reference point for all beacons
    scanner0.location = Beacon(0, 0, 0)
    mapped_scanners = [scanner0]
    to_remove = None

    while len(scanners) > 0:
        remove_scanner_by_id(scanners, to_remove, mapped_scanners)
        to_remove = seek_match(scanner0, scanners)

    print(len(scanner0.beacons))                        # part one solution
    print(larges_manhattan_distance(mapped_scanners))   # part two solution


build_beacon_map()
