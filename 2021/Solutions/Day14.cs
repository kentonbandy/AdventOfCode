using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day14
    {
        private LinkedList<char> Poly { get; set; }
        private StringBuilder Poly2 { get; set; }
        private LinkedList<Tuple<char, int>> Poly3 { get; set; }
        private string Poly4 { get; set; }
        private Dictionary<string,char> Template { get; set; }

        public Day14()
        {
            List<string> rawInput = Helpers.readFile(14);
            Poly = new(rawInput[0].ToCharArray());
            Poly2 = new(rawInput[0]);
            Poly3 = new();
            Poly4 = rawInput[0];
            foreach (char c in rawInput[0]) Poly3.AddLast(new Tuple<char,int>(c, 0));
            Template = new();
            for (int i = 2; i < rawInput.Count; i++)
            {
                string[] kv = rawInput[i].Split(" -> ");
                Template[kv[0]] = Char.Parse(kv[1]);
            }
        }

        // this solution consistently gives an answer 1 under the correct answer so I should probably figure out what's happening
        public void Polymerize3(int steps)
        {
            HashSet<char> charSet = new(Template.Values);
            Dictionary<char, long> counts = new();
            foreach (char c in charSet) counts[c] = 0;
            Dictionary<string, long> blankPairs = new();
            foreach (string s in Template.Keys) blankPairs[s] = 0;
            Dictionary<string, long> pairs;
            Dictionary<string, long> newPairs;

            for (int i = 0; i < Poly4.Length - 1; i++)
            {
                pairs = new(blankPairs);
                pairs[$"{Poly4[i]}{Poly4[i + 1]}"]++;
                for (int j = 0; j < steps; j++)
                {
                    newPairs = new(blankPairs);
                    foreach (KeyValuePair<string, long> p in pairs)
                    {
                        if (p.Value == 0) continue;
                        char c = Template[p.Key];
                        counts[c] += p.Value;
                        newPairs[$"{p.Key[0]}{c}"] += p.Value;
                        newPairs[$"{c}{p.Key[1]}"] += p.Value;
                    }
                    pairs = newPairs;
                }
            }

            long max = counts.Values.Max();
            long min = counts.Values.Min();
            Console.WriteLine(max - min);
        }

        // linked list solution (only works on part 1)
        public void Polymerize(int steps)
        {
            for (int i = 0; i < steps; i++) Step();
            Dictionary<char,long> count = new();
            LinkedListNode<char> node = Poly.First;
            while (node != null)
            {
                char c = node.Value;
                if (count.Keys.Contains(c)) count[c]++;
                else count[c] = 1;
                node = node.Next;
            }
            long max = count.Values.Max();
            long min = count.Values.Min();
            Console.WriteLine(max - min);
        }

        private void Step()
        {
            LinkedListNode<char> node = Poly.First.Next;
            while (node != null)
            {
                char newVal = Template[$"{node.Previous.Value}{node.Value}"];
                Poly.AddBefore(node, newVal);
                node = node.Next;
            }
        }


        // stringbuilder solution (only works on part 1)
        public void Polymerize2(int steps)
        {
            Dictionary<char, int> count = new();
            for (int i = 0; i < Poly.Count; i++)
            {
                if (count.Keys.Contains(Poly2[i])) count[Poly2[i]]++;
                else count[Poly2[i]] = 1;
            }
            for (int i = 0; i < steps; i++) Step2(count);
            int max = count.Values.Aggregate((a, b) => Math.Max(a, b));
            int min = count.Values.Aggregate((a, b) => Math.Min(a, b));
            Console.WriteLine(max - min);
        }

        private void Step2(Dictionary<char,int> count)
        {
            StringBuilder newPoly = new();
            for (int i = 1; i < Poly2.Length; i++)
            {
                newPoly.Append(Poly2[i - 1]);
                char insertion = Template[$"{Poly2[i - 1]}{Poly2[i]}"];
                if (count.Keys.Contains(insertion)) count[insertion]++;
                else count[insertion] = 1;
                newPoly.Append(insertion);
            }
            newPoly.Append(Poly2[^1]);
            Poly2 = newPoly;
        }
    }
}
