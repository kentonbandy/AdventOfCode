
namespace AOC.Solutions
{
    internal class Day15
    {
        List<string> RawData { get; set; }
        HashSet<Node> UnvisitedWithDistance { get; set; }
        Node Current { get; set; } = null;
        Node Destination { get; set; } = null;

        public Day15()
        {
            RawData = Helpers.ReadFile(15);
            UnvisitedWithDistance = new();
        }

        // using Dijkstra's algorithm to find the shortest path (or "lowest risk") between two nodes
        // For memory efficiency, instead of creating a set of all unvisited nodes, the set will only contain those unvisited nodes that have not null Distance values set (null signifies infinity here)
        public void Navigate(int widthMult = 1, int heightMult = 1, int inc = 1)
        {
            LoadGraph(RawData, widthMult, heightMult, inc);

            while (Current != Destination)
            {
                // current node is always unvisited with shortest path outward
                // If neighbor isn't visited but has distance, check to see if the route through the current node is shorter. Otherwise set neighbor distance additively and add to the set.
                foreach (Node neighbor in Current.Neighbors)
                {
                    if (UnvisitedWithDistance.Contains(neighbor))
                    {
                        neighbor.Distance = Math.Min((int)neighbor.Distance, (int)Current.Distance + neighbor.Value);
                    }
                    else if (!neighbor.Visited)
                    {
                        neighbor.Distance = Current.Distance + neighbor.Value;
                        UnvisitedWithDistance.Add(neighbor);
                    }
                }

                Current.Visited = true;
                UnvisitedWithDistance.Remove(Current);

                // set current as the unvisited node with shortest distance
                // UnvisitedWithDistance will only be empty if the initial and destination nodes aren't connected; that won't happen in this problem as it is a square grid
                Current = UnvisitedWithDistance.Aggregate((a, b) => a.Distance < b.Distance ? a : b);
            }
            Console.WriteLine(Destination.Distance);
        }

        private void LoadGraph(List<string> lines, int widthMult = 1, int heightMult = 1, int inc = 1)
        {
            // convert lines to int values
            List<List<int>> intLines = new();
            foreach (string line in lines)
            {
                List<int> newLine = new();
                foreach (char c in line) newLine.Add((int)Char.GetNumericValue(c));
                intLines.Add(newLine);
            }

            // use a grid to maintain the order of the nodes so that neighbors (edges) can be set after nodes are initialized
            List<List<Node>> nodes = new();

            // set node values respecting width and height multipliers and increment
            for (int i = 0; i < intLines.Count * heightMult; i++)
            {
                int h = i / intLines.Count;
                nodes.Add(new List<Node>());
                for (int w = 0; w < widthMult; w++)
                {
                    foreach (int n in intLines[i % intLines.Count])
                    {
                        int val = n + (w * inc) + (h * inc);
                        Node node = new(val > 9 ? val % 9 : val);
                        nodes[i].Add(node);
                    }
                }
            }

            // set neighbors
            int rows = nodes.Count;
            int cols = nodes[0].Count;
            for (int i = 0; i < nodes.Count; i++)
            {
                List<Node> row = nodes[i];
                for (int j = 0; j < nodes[0].Count; j++)
                {
                    Node node = row[j];
                    if (i > 0) node.Neighbors.Add(nodes[i - 1][j]);
                    if (j > 0) node.Neighbors.Add(row[j - 1]);
                    if (i < rows - 1) node.Neighbors.Add(nodes[i + 1][j]);
                    if (j < cols - 1) node.Neighbors.Add(row[j + 1]);
                }
            }

            // set starting node with 0 distance, destination node (hardcoded to top left and bottom right, respectively)
            Current = nodes[0][0];
            Current.Distance = 0;
            UnvisitedWithDistance.Add(Current);
            Destination = nodes[rows - 1][cols - 1];
        }
    }

    internal class Node
    {
        public bool Visited { get; set; } = false;
        public int Value { get; set; }
        public int? Distance { get; set; } = null;
        public List<Node> Neighbors { get; set; } = new();

        public Node(int val)
        {
            Value = val;
        }
    }
}
