using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC
{
    internal class Helpers
    {
        public List<string> readFile(int day)
        {
            string file = @$"C:\Users\Kenny\coding\AOC\2021\Input\{(day > 9 ? day : $"0{day}")}_input.txt";
            if (file == null) return null;
            List<string> strings = new();
            if (File.Exists(file))
            {
                try
                {
                    using (StreamReader sr = new StreamReader(file))
                    {
                        string? line;
                        while ((line = sr.ReadLine()) != null)
                        {
                            strings.Add(line);
                        }
                    }
                }
                catch (Exception)
                {
                    Console.WriteLine("The file reader is broken");
                }
            }
            return strings;
        }

        public List<int> convertListToInt(List<string> strings)
        {
            return strings.Select(s => Convert.ToInt32(s)).ToList();
        }
    }
}
