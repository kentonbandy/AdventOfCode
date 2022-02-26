using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC
{
    internal class Day1
    {
        private readonly Helpers help = new();

        public void day1_1()
        {
            List<int> depths = help.convertListToInt(help.readFile(1));
            int count = 0;
            int j;
            if (depths != null && depths.Count > 0)
            {
                j = depths[0];
            }
            else
            {
                Console.WriteLine("Something's fucked");
                return;
            }
            for (int i = 0; i < depths.Count; i++)
            {
                int current = depths[i];
                if (current > j) count++;
                j = current;
            }
            Console.WriteLine(count);
        }

        public void day1_2()
        {
            List<int> depths = help.convertListToInt(help.readFile(1));
            int count = 0;
            int j;
            if (depths != null && depths.Count > 0)
            {
                j = depths[0] + depths[1] + depths[2];
            }
            else
            {
                Console.WriteLine("Something's fucked");
                return;
            }
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
