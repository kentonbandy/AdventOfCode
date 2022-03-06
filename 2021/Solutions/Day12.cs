using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day12
    {
        private Dictionary<string, List<string>> Graph { get; set; }

        public Day12()
        {
            List<string[]> lines = Helpers.readFile(12).Select(l => l.Split("-").ToArray()).ToList();
            Graph = new();
            foreach (string[] line in lines)
            {
                if (Graph.ContainsKey(line[0])) Graph[line[0]].Add(line[1]);
                else Graph[line[0]] = new List<string> { line[1] };
                if (Graph.ContainsKey(line[1])) Graph[line[1]].Add(line[0]);
                else Graph[line[1]] = new List<string> { line[0] };
            }
            Graph["end"].Clear();
            foreach (List<string> val in Graph.Values) val.Remove("start");
        }

        //FINE I'll use a tree
        public void CavePaths(int smallVisitsAllowed)
        {
            int count = 0;
            Node node = new Node("start");
            List<string> ancestors = new();

            while (node != null)
            {
                string? newVal = Graph[node.Val].FirstOrDefault(s => ValidChild(node, s, smallVisitsAllowed, ancestors), null);
                if (newVal == null)
                {
                    node = node.Parent;
                    ancestors.Remove(node?.Val);
                }
                else
                {
                    ancestors.Add(node.Val);
                    node = new Node(newVal, node);
                    if (node.Val == "end")
                    {
                        count++;
                        node = node.Parent;
                        ancestors.Remove(node?.Val);
                    }
                }
            }
            Console.WriteLine(count);
        }

        private bool ValidChild(Node node, string? child, int smallVisitsAllowed, List<string> ancestors)
        {
            if (child == null || node.Children.Contains(child)) return false;
            if (child != "end" && child == child.ToLower() &&
                ancestors.FindAll(x => x == child).Count >= 1 &&
                (smallVisitsAllowed == 1 || TwoXSmallCave(ancestors, node.Val)))
            {
                return false;
            }
            return true;
        }

        private bool TwoXSmallCave(List<string> ancestors, string nodeVal)
        {
            List<string> smalls = ancestors.Where(x => x != "start" && x == x.ToLower()).ToList();
            smalls.Add(nodeVal);
            foreach (string small in smalls)
            {
                if (smalls.FindAll(x => x == small).Count == 2) return true;
            }
            return false;
        }

        internal class Node
        {
            public string Val { get; set; }
            public Node Parent { get; set; }
            public List<string> Children { get; set; }

            public Node(string val, Node parent = null)
            {
                Val = val;
                Children = new();
                Parent = parent;
                if (parent != null) Parent.Children.Add(this.Val);
            }
        }







        //-------------------------------------------------------------------------------------
        //Inefficient solution
        //using this for part 2 takes 7.5 minutes to run on my PC lol BUT THE OUTPUT IS CORRECT
        public void CavePaths(bool part2 = false)
        {
            List<string> paths = new() { "start" };
            List<string> toAdd;
            List<int> toRemove = new();
            while (!AllEnd(paths))
            {
                int thisCount = paths.Count;
                for (int i = 0; i < thisCount; i++)
                {
                    if (paths[i].EndsWith("end")) continue;
                    if (part2) toAdd = SplitPaths2(paths[i], paths);
                    else toAdd = SplitPaths(paths[i], paths);
                    if (toAdd.Count == 0)
                    {
                        toRemove.Add(i);
                        continue;
                    }
                    for (int j = 1; j < toAdd.Count; j++) paths.Add($"{paths[i]} {toAdd[j]}");
                    paths[i] = $"{paths[i]} {toAdd[0]}";
                }
                toRemove.Reverse();
                foreach (int i in toRemove) paths.Remove(paths[i]);
                toRemove.Clear();
            }
            Console.WriteLine(paths.Count);
        }

        private List<string> SplitPaths(string path, List<string> paths)
        {
            List<string> toAdd = new();
            string[] splitPaths = path.Split(" ");
            string at = splitPaths[^1];
            foreach (string option in Graph[at])
            {
                if (option != "end" && option == option.ToLower() && path.Contains(option)) continue;
                else if (paths.Contains($"{path} {option}")) continue;
                else toAdd.Add(option);
            }
            return toAdd;
        }

        private List<string> SplitPaths2(string path, List<string> paths)
        {
            List<string> toAdd = new();
            List<string> splitPaths = path.Split(" ").ToList();
            string at = splitPaths[^1];
            string dub = "";
            for (int i = 0; i < splitPaths.Count; i++)
            {
                string s = splitPaths[i];
                if (s == "start" || s != s.ToLower()) continue;
                if (splitPaths.FindAll(x => x == s).Count > 1) dub = s;
            }
            foreach (string option in Graph[at])
            {
                if (option == "start") continue;
                if (dub != "" && option != "end" && option == option.ToLower() && path.Contains(option)) continue;
                else if (paths.Contains($"{path} {option}")) continue;
                else toAdd.Add(option);
            }
            return toAdd;
        }

        private bool AllEnd(List<string> paths)
        {
            return paths.TrueForAll(s => s.EndsWith("end"));
        }
    }
}