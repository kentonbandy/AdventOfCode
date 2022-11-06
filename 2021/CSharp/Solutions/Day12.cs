
namespace AOC.Solutions
{
    internal class Day12
    {
        private Dictionary<string, List<string>> Graph { get; set; }

        public Day12()
        {
            List<string[]> lines = Helpers.ReadFile(12).Select(l => l.Split("-").ToArray()).ToList();
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
    }
}