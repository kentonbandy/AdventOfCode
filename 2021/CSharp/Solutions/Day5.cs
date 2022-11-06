
namespace AOC.Solutions
{
    internal class Day5
    {
        public void Vents(bool isPart2 = false)
        {
            List<string> rawInput = Helpers.ReadFile(5);
            Diagram diagram = new();
            List<Line> lines = new();
            foreach (string line in rawInput) lines.Add(new Line(line));
            foreach (Line line in lines)
            {
                if (!isPart2 && !line.Horizontal() && !line.Vertical()) continue;
                diagram.AddLine(line);
            }
            Console.WriteLine(diagram.GetIntersections());
        }
    }

    internal class Diagram
    {
        public List<List<int>> Graph { get; set; }

        public Diagram()
        {
            Graph = new();
            for (int i = 0; i < 1000; i++) Graph.Add(new List<int>(new int[999]));
        }

        public void AddLine(Line line)
        {
            if (line.Horizontal())
            {
                int start = Math.Min(line.x1, line.x2);
                int diff = Math.Abs(line.x2 - line.x1);
                for (int i = 0; i <= diff; i++)
                {
                    Graph[line.y1][start + i]++;
                }
            }
            else if (line.Vertical())
            {
                int start = Math.Min(line.y1, line.y2);
                int diff = Math.Abs(line.y2 - line.y1);
                for (int i = 0; i <= diff; i++) Graph[start + i][line.x1]++;
            }
            else
            {
                bool downward = line.y1 < line.y2;
                bool forward = line.x1 < line.x2;
                int diff = Math.Abs(line.x2 - line.x1);
                for (int i = 0; i <= diff; i++)
                {
                    Graph[downward ? line.y1 + i : line.y1 - i][forward ? line.x1 + i : line.x1 - i]++;
                }
            }
        }

        public int GetIntersections()
        {
            int count = 0;
            foreach (List<int> row in Graph) foreach (int i in row) if (i > 1) count++;
            return count;
        }
    }

    internal class Line
    {
        public int x1 { get; set; } = 0;
        public int y1 { get; set; } = 0;
        public int x2 { get; set; } = 0;
        public int y2 { get; set; } = 0;

        public Line(string s)
        {
            string[] halves = s.Split(" -> ");
            List<string[]> all = halves.Select(x => x.Split(',')).ToList();
            x1 = int.Parse(all[0][0]);
            y1 = int.Parse(all[0][1]);
            x2 = int.Parse(all[1][0]);
            y2 = int.Parse(all[1][1]);
        }

        public bool Horizontal()
        {
            return y1 == y2;
        }

        public bool Vertical()
        {
            return x1 == x2;
        }
    }
}
