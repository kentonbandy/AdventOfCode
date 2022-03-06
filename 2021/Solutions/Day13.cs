using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day13
    {
        private List<int[]> Coords { get; set; }
        private List<ValueTuple<char, int>> Folds { get; set; }
        private OrigamiPage Page { get; set; }

        public Day13()
        {
            Coords = new();
            Folds = new();
            int maxX = 0;
            int maxY = 0;
            List<string> rawInput = Helpers.readFile(13);
            foreach (string s in rawInput)
            {
                if (s == "") continue;
                if (s.StartsWith('f'))
                {
                    string[] line = s.Split(" ")[2].Split("=");
                    Folds.Add((Char.Parse(line[0]), Convert.ToInt32(line[1])));
                }
                else Coords.Add(s.Split(",").Select(x => Convert.ToInt32(x)).ToArray());
                if (Coords[^1][0] >= maxX) maxX = Coords[^1][0] + 1;
                if (Coords[^1][1] >= maxY) maxY = Coords[^1][1] + 1;
            }
            Page = new(maxY, maxX);
        }

        public void Origami()
        {
            foreach (int[] pair in Coords) Page.MarkCoord(pair[1], pair[0]);
            Page.Fold(Folds[0].Item1, Folds[0].Item2);
            Console.WriteLine(Page.CountMarks());
            for (int i = 1; i < Folds.Count; i++)
            {
                Page.Fold(Folds[i].Item1, Folds[i].Item2);
            }
            foreach (List<bool> line in Page.Coords)
            {
                foreach (bool b in line)
                {
                    Console.Write(b ? 'X' : ' ');
                }
                Console.WriteLine();
            }
        }
    }

    internal class OrigamiPage
    {
        public List<List<bool>> Coords { get; set; }

        public OrigamiPage(int rows, int cols)
        {
            Coords = new();
            List<bool> row = new();
            for (int i = 0; i < cols; i++) row.Add(false);
            for (int i = 0; i < rows; i++) Coords.Add(new List<bool>(row));
        }

        public void MarkCoord(int row, int col)
        {
            Coords[row][col] = true;
        }

        public int CountMarks()
        {
            return Coords.Aggregate(0, (a, r) => a + r.Aggregate(0, (b, c) => b + (c ? 1 : 0)));
        }

        public void Fold(char xy, int ind)
        {
            bool horizontal = xy == 'y';
            List<List<bool>> orig;
            List<List<bool>> flipped;
            if (horizontal)
            {
                orig = Coords.GetRange(0, ind);
                flipped = Coords.GetRange(ind + 1, Coords.Count - ind - 1);
            }
            else
            {
                orig = new();
                flipped = new();
                foreach (List<bool> row in Coords)
                {
                    orig.Add(row.GetRange(0, ind));
                    flipped.Add(row.GetRange(ind + 1, row.Count - ind - 1));
                }
            }
            Flip(flipped, horizontal);
            Merge(orig, flipped);
        }

        private void Flip(List<List<bool>> toFlip, bool horizontal)
        {
            if (horizontal) toFlip.Reverse();
            else foreach (List<bool> row in toFlip) row.Reverse();
        }

        private void Merge(List<List<bool>> orig, List<List<bool>> flipped)
        {

            var main = orig.Count > flipped.Count ? orig : orig[0].Count > flipped[0].Count ? orig : flipped;
            var merge = main == orig ? flipped : orig;
            int height = main.Count;
            int width = main[0].Count;
            int widthDiff = width - merge[0].Count;
            int heightDiff = height - merge.Count;
            for (int r = 0; r < height; r++)
            {
                if (r < heightDiff) continue;
                for (int c = 0; c < width; c++)
                {
                    if (c < widthDiff) continue;
                    main[r][c] = main[r][c] || merge[r][c];
                }
            }
            Coords = new(main);
        }
    }
}
