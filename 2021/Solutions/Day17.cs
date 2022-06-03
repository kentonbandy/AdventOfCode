
namespace AOC.Solutions
{
    internal class Day17
    {
        private int ymin { get; set; }
        private int ymax { get; set; }
        private int xmin { get; set; }
        private int xmax { get; set; }

        public Day17()
        {
            string rawData = Helpers.ReadFile(17)[0];
            rawData = rawData.Split(": ")[1];
            string[] xy = rawData.Split(", ");
            string[] xx = xy[0].Split("..");
            string[] yy = xy[1].Split("..");
            xmin = int.Parse(xx[0].Substring(2));
            xmax = int.Parse(xx[1]);
            ymin = int.Parse(yy[0].Substring(2));
            ymax = int.Parse(yy[1]);
        }

        public void Launch()
        {
            Console.WriteLine(FindHighestYPosition());
            Console.WriteLine(TotalPossiblevalues());
        }

        public int FindHighestYPosition()
        {
            int height = 0;
            for (int i = Math.Abs(ymin) - 1; i > 0; i--) height += i;
            return height;
        }

        public int TotalPossiblevalues()
        {
            int highesty = FindHighestYPosition();
            int lowestx = FindLowestX();
            List<int> xValues = new();
            List<int> yValues = new();
            for (int i = lowestx; i <= xmax; i++) xValues.Add(i);
            for (int i = ymin; i <= highesty; i++) yValues.Add(i);
            int count = 0;
            foreach (int x in xValues) foreach(int y in yValues) if (TestFire(x, y)) count++;
            return count;
        }

        private int FindLowestX()
        {
            int n = 0;
            for (int i = 1, x = 0; x < xmin; n = i, i++) x += i;
            return n;
        }

        private bool TestFire(int xvel, int yvel)
        {
            int x = 0, y = 0;
            while (x < xmax && y > ymin)
            {
                x += xvel;
                y += yvel;
                if (xvel > 0) xvel--;
                yvel--;
                if (x >= xmin && x <= xmax && y >= ymin && y <= ymax) return true;
            }
            return false;
        }
    }
}
