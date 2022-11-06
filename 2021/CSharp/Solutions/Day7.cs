
namespace AOC.Solutions
{
    internal class Day7
    {
        public void CrabPositioner()
        {
            List<int> positions = Helpers.ReadFile(7)[0].Split(',').Select(s => Convert.ToInt32(s)).ToList();
            int max = 0;
            foreach (int i in positions) if (i > max) max = i;
            int bestFuel = -1;
            int fuel;
            for (int i = 0; i <= max; i++)
            {
                fuel = positions.Aggregate(0, (acc, cur) => acc + Math.Abs(cur - i));
                if (bestFuel == -1) bestFuel = fuel;
                else if (fuel < bestFuel) bestFuel = fuel;
            }
            Console.WriteLine(bestFuel);
        }

        public void CrabPositioner2()
        {
            List<int> positions = Helpers.ReadFile(7)[0].Split(',').Select(s => Convert.ToInt32(s)).ToList();
            int max = 0;
            foreach (int i in positions) if (i > max) max = i;
            int ave = positions.Aggregate((acc, cur) => acc + cur) / positions.Count();
            int fuel = 0;
            foreach (int i in positions)
            {
                int dis = Math.Abs(i - ave);
                fuel += (dis * (dis + 1)) / 2;
            }
            Console.WriteLine(fuel);
        }
    }
}
