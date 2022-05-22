
namespace AOC.Solutions
{
    internal class Day9
    {
        private List<List<int>> map = new();
        private int W;
        private int H;

        public Day9()
        {
            List<List<char>> chars = Helpers.ReadFile(9).Select(s => s.ToCharArray().ToList()).ToList();
            map = chars.Select(l => l.Select(n => (int)Char.GetNumericValue(n)).ToList()).ToList();
            W = map[0].Count - 1;
            H = map.Count - 1;
        }

        public void RiskLevelSum()
        {
            int sum = 0;
            for (int i = 0; i < map.Count; i++)
            {
                for (int j = 0; j < map[i].Count; j++)
                {
                    sum += getRiskLevel(i, j);
                }
            }
            Console.WriteLine(sum);
        }

        private int getRiskLevel(int row, int col)
        {
            int point = map[row][col];
            if (row > 0 && map[row - 1][col] <= point ||
                row < map.Count - 1 && map[row + 1][col] <= point ||
                col > 0 && map[row][col - 1] <= point ||
                col < map[row].Count - 1 && map[row][col + 1] <= point)
            {
                return 0;
            }
            return point + 1;
        }


        public void BasinProduct()
        {
            Dictionary<int,HashSet<string>> basins = new();
            for (int r = 0; r <= H; r++)
            {
                for (int c = 0; c <= W; c++)
                {
                    if (map[r][c] == 9 || map[r][c] == -1) continue;
                    exploreBasin(r, c, basins);
                }
            }
            List<int> basinSizes = basins.Values.Select(v => v.Count).ToList();
            basinSizes.Sort((a, b) => b - a);
            Console.WriteLine(basinSizes[0] * basinSizes[1] * basinSizes[2]);
        }

        private void exploreBasin(int r, int c, Dictionary<int,HashSet<string>> basins)
        {
            int ind = basins.Count;
            string point = $"{r};{c}";
            basins[ind] = new HashSet<string>() { point };
            Start:
            checkNeighbors(basins[ind], point);
            foreach (string p in basins[ind])
            {
                if (!isNeg(p))
                {
                    point = p;
                    goto Start;
                }
            }
        }

        private void checkNeighbors(HashSet<string> basins, string point)
        {
            int[] rc = intArr(point);
            int r = rc[0];
            int c = rc[1];
            map[r][c] = -1;
            if (r > 0 && map[r - 1][c] != 9) basins.Add($"{r - 1};{c}");
            if (r < H && map[r + 1][c] != 9) basins.Add($"{r + 1};{c}");
            if (c > 0 && map[r][c - 1] != 9) basins.Add($"{r};{c - 1}");
            if (c < W && map[r][c + 1] != 9) basins.Add($"{r};{c + 1}");
        }

        private bool isNeg(string point)
        {
            int[] rc = intArr(point);
            return map[rc[0]][rc[1]] == -1;
        }

        private int[] intArr(string point)
        {
            return point.Split(";").Select(s => Convert.ToInt32(s)).ToArray();
        }
    }
}
