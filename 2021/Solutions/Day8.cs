using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day8
    {
        private Helpers help = new();
        private Dictionary<string, string> NumberKey = new()
        {
            { "abcefg",  "0" },
            { "cf",      "1" },
            { "acdeg",   "2" },
            { "acdfg",   "3" },
            { "bcdf",    "4" },
            { "abdfg",   "5" },
            { "abdefg",  "6" },
            { "acf",     "7" },
            { "abcdefg", "8" },
            { "abcdfg",  "9" }
        };

        public void UniqueSegments()
        {
            List<string> segments = help.readFile(8);
            int allUniqueSegs = 0;
            foreach (string segment in segments)
            {
                int i = segment.IndexOf('|');
                int[] findThese = new int[] { 2, 3, 4, 7 };
                allUniqueSegs += segment.Substring(i + 2).Split(' ').ToList().Aggregate(0, (a, b) => findThese.Contains(b.Length) ? a + 1 : a);
            }
            Console.WriteLine(allUniqueSegs);
        }

        public void SumOutputs()
        {
            List<string> segments = help.readFile(8);
            int sum = 0;
            foreach (string s in segments) sum += decodeOutput(s, decodeConnections(s));
            Console.WriteLine(sum);
        }

        private Dictionary<char, char> decodeConnections(string line)
        {
            /*
            1. start with len 2: those are rt and rb
            2. find len 3: the odd one out is TOP
            3. find len 6 with only two of len 3 (number 6): the missing one is RT, the other is RB
            4. find len 5 with all three (3): mid and bot
            5. find len 4: match MID, get TL and deduce BOT
            6. deduce BL 
             */

            //clean up input
            line = line[..line.IndexOf(" |")];
            List<string> codes = line.Split(' ').ToList();

            //1
            List<char> rtRb = codes.Find(s => s.Length == 2)?.ToCharArray().ToList() ?? new();
            //2
            List<char> len3 = codes.Find(s => s.Length == 3)?.ToCharArray().ToList() ?? new();
            char top = len3.Find(s => !rtRb.Contains(s));
            //3
            string len6Missing1 = codes.Find(s => s.Length == 6 && (!s.Contains(len3[0]) || !s.Contains(len3[1]) || !s.Contains(len3[2]))) ?? "";
            char rt = len3.Find(c => !len6Missing1.Contains(c));
            char rb = len3.Find(c => c != top && c != rt);
            //4
            List<char> midBot = codes.Find(s => s.Length == 5 && s.Contains(top) && s.Contains(rt) && s.Contains(rb))?.ToCharArray().ToList() ?? new();
            midBot.RemoveAll(c => c == top || c == rt || c == rb);
            //5
            List<char> len4 = codes.Find(s => s.Length == 4)?.ToCharArray().ToList() ?? new();
            char mid = len4.Find(c => midBot.Contains(c));
            char bot = mid == midBot[0] ? midBot[1] : midBot[0];
            char lt = len4.Find(c => c != rt && c != mid && c != rb);
            //6
            List<char> all = new() { 'a', 'b', 'c', 'd', 'e', 'f', 'g' };
            List<char> found = new() { top, rt, lt, mid, rb, bot };
            all.RemoveAll(s => found.Contains(s));
            char lb = all[0];

            return new()
            {
                { top, 'a' },
                { lt,  'b' },
                { rt,  'c' },
                { mid, 'd' },
                { lb,  'e' },
                { rb,  'f' },
                { bot, 'g' }
            };
        }

        private int decodeOutput(string input, Dictionary<char, char> key)
        {
            input = input[(input.IndexOf("|") + 2)..];
            List<string> codes = input.Split(" ").ToList();
            string outputString = "";
            foreach (string s in codes)
            {
                string decoded = "";
                foreach (char c in s)
                {
                    decoded += key[c];
                }
                char[] charArray = decoded.ToCharArray();
                Array.Sort(charArray);
                outputString += NumberKey[string.Join("", charArray)];
            }
            return Convert.ToInt32(outputString);
        }
    }
}
