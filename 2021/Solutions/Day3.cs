using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day3
    {
        public void Day3_1()
        {
            List<string> bin = Helpers.readFile(3);
            Dictionary<int, int> counts = new();
            foreach (string bit in bin) for (int i = 0; i < bit.Length; i++)
                {
                    if (!counts.ContainsKey(i)) counts[i] = bit[i] == '1' ? 1 : 0;
                    else if (bit[i] == '1') counts[i]++;
                }
            List<bool> bools = new();
            for (int i = 0; i < bin[0].Length; i++) bools.Add(counts[i] > bin.Count / 2);
            string gam = "";
            string eps = "";
            foreach (bool b in bools)
            {
                gam += b ? "1" : "0";
                eps += b ? "0" : "1";
            }
            Console.WriteLine(binaryStringToDec(gam) * binaryStringToDec(eps));
        }

        public void Day3_2()
        {
            List<string> oxy = Helpers.readFile(3);
            List<string> co2 = oxy.ConvertAll(s => new string(s));
            string oxyString = reduceList(oxy, true);
            string co2String = reduceList(co2, false);
            Console.WriteLine(binaryStringToDec(oxyString) * binaryStringToDec(co2String));
        }

        private int binaryStringToDec(string binStr)
        {
            int dec = 0;
            for (int i = binStr.Length - 1, j = 0; i >= 0; i--, j++) if (binStr[i] == '1') dec += (int)Math.Pow(2, j);
            return dec;
        }

        private char findCommonDig(List<string> list, int i, bool isOxy)
        {
            int count = 0;
            int len = list.Count;
            int half = len % 2 == 0 ? len / 2 : (len / 2) + 1;
            foreach (string s in list) if (s[i] == '1') count++;
            if (count == half) return isOxy ? '1' : '0';
            else return count > half ? isOxy ? '1' : '0' : isOxy ? '0' : '1';
        }
        private string reduceList(List<string> list, bool isOxy)
        {
            int len = list.Count;
            for (int i = 0; list.Count > 1 && i < len; i++)
            {
                char bit = findCommonDig(list, i, isOxy);
                list = list.Where(x => x[i] == bit).ToList();
            }
            return list[0];
        }
    }
}
