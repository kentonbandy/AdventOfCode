
namespace AOC.Solutions
{
    internal class Day19
    {
        private List<Scanner> Scanners { get; set; }

        // load input
        public Day19()
        {
            Scanners = BuildBeacons();
        }

        // scanner 0 will be our reference point.
        // build a list of beacon locations relative to scanner 0
        // scanner object that can rotate and alter relative object coords?
        // beacon point object?
        // keep track of relative differences of beacons
        // for each beacon, make a set of relative coordinates to the other beacons for each possible orientation (dict)
        // when attempting to find a match between scanners, compare the relative beacon coords
        // once a match has been found, you have the orientation of the new scanner
        // orient it and add the beacons to the list



        private List<Scanner> BuildBeacons()
        {
            List<string> lines = Helpers.ReadFile(200);
            List<Scanner> scanners = new();
            Scanner scanner = null;
            foreach (string line in lines)
            {
                if (line.Length > 0 && line.Substring(0, 3) == "---") scanner = new();
                else if (line == "") scanners.Add(scanner);
                else
                {
                    int[] coords = line.Split(",").Select(n => Convert.ToInt32(n)).ToArray();
                    Beacon beacon = new(coords[0], coords[1], coords[2]);
                    scanner.Beacons.Add(beacon);
                }
            }
            return scanners;
        }
    }

    internal class Beacon
    {
        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
        // relative positions of fellow beacons in a single orientation
        public List<Beacon> Relatives { get; set; }

        public Beacon(int x, int y, int z)
        {
            X = x;
            Y = y;
            Z = z;
            Relatives = new();
        }
    }

    internal class Scanner
    {
        public List<Beacon> Beacons { get; set; }
        public int Orient { get; set; }

        public Scanner()
        {
            Beacons = new();
            Orient = 0;
        }

        public void CalcRelatives()
        {
            
        }
    }
}
