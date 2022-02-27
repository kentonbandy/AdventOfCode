using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC
{
    internal class Day6
    {
        private Helpers help = new();
        public void Angler1(int days)
        {
            List<int> anglerfish = help.readFile(6)[0].Split(',').Select(x => Convert.ToInt32(x)).ToList();
            List<int> newAnglerfish = new();
            for (int i = 0; i < days; i++)
            {
                foreach (int n in anglerfish)
                {
                    if (n > 0) newAnglerfish.Add(n - 1);
                    else
                    {
                        newAnglerfish.Add(6);
                        newAnglerfish.Add(8);
                    }
                }
                anglerfish = newAnglerfish;
                newAnglerfish = new();
            }
            Console.WriteLine(anglerfish.Count);
        }

        public void Angler2(int days)
        {
            List<int> rawData = help.readFile(6)[0].Split(',').Select(x => Convert.ToInt32(x)).ToList();
            Dictionary<int, long> blank = new()
            {
                { 0, 0 },
                { 1, 0 },
                { 2, 0 },
                { 3, 0 },
                { 4, 0 },
                { 5, 0 },
                { 6, 0 },
                { 7, 0 },
                { 8, 0 }
            };
            Dictionary<int, long> anglerfish = new(blank);
            Dictionary<int, long> newAnglerfish = new(blank);
            foreach (int i in rawData) anglerfish[i]++;
            for (int _ = 0; _ < days; _++)
            {
                for (int i = 7; i >= 0; i--) newAnglerfish[i] = anglerfish[i + 1];
                newAnglerfish[6] += anglerfish[0];
                newAnglerfish[8] = anglerfish[0];
                anglerfish = newAnglerfish;
                newAnglerfish = new(blank);
            }
            long total = 0;
            foreach (long l in anglerfish.Values) total += l;
            Console.WriteLine(total);
        }

        public void AnglerBad(int days)
        {
            StringBuilder anglerfish = new(help.readFile(6)[0]);
            anglerfish.Append(",");
            StringBuilder newAnglerfish = new();
            StringBuilder temp = new();
            int num;
            int len = anglerfish.Length;
            for (int i = 0; i < days; i++)
            {
                for (int j = 0; j < len; j++)
                {
                    if (anglerfish[j] == ',')
                    {
                        num = Convert.ToInt32(temp.ToString());
                        temp.Clear();
                        if (num > 0) newAnglerfish.Append($"{num - 1},");
                        else
                        {
                            newAnglerfish.Append("6,8,");
                        }
                    }
                    else
                    {
                        temp.Append(anglerfish[j]);
                    }
                }
                anglerfish = newAnglerfish;
                newAnglerfish = new();
                len = anglerfish.Length;
            }
            Console.WriteLine(anglerfish.ToString().Count(c => c == ','));
        }
    }
}
