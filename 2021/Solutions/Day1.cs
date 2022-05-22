
namespace AOC.Solutions
{
    internal class Day1
    {
        public void Day1_1()
        {
            List<int> depths = Helpers.ConvertListToInt(Helpers.ReadFile(1));
            int count = 0;
            int j = depths[0];
            for (int i = 0; i < depths.Count; i++)
            {
                int current = depths[i];
                if (current > j) count++;
                j = current;
            }
            Console.WriteLine(count);
        }

        public void Day1_2()
        {
            List<int> depths = Helpers.ConvertListToInt(Helpers.ReadFile(1));
            int count = 0;
            int j = depths[0] + depths[1] + depths[2];
            for (int i = 0; i < depths.Count - 2; i++)
            {
                int current = depths[i] + depths[i + 1] + depths[i + 2];
                if (current > j) count++;
                j = current;
            }
            Console.WriteLine(count);
        }
    }
}
