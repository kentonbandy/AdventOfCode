using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day18
    {
        public List<string> Lines { get; set; }
        private List<Pair> Pairs { get; set; }

        public Day18()
        {
            Lines = Helpers.ReadFile(18);
            Pairs = Lines.Select(l => (Pair)ConvertLine(l)).ToList();
        }

        public void BracketHell()
        {
            Console.WriteLine(CalculateMagnitude());
            Console.WriteLine(FindGreatestMagnitude());
        }

        private int CalculateMagnitude()
        {
            Pair sumPair = Pairs[0];
            List<Pair> pairs = Pairs.GetRange(1, Pairs.Count - 1);
            foreach (Pair pair in pairs)
            {
                sumPair = new Pair(sumPair, pair);
                ((Pair)sumPair.Left).Parent = sumPair;
                ((Pair)sumPair.Right).Parent = sumPair;
                Reduce(sumPair);
            }
            return GetMagnitude(sumPair);
        }

        private int FindGreatestMagnitude()
        {
            int mag = 0;
            Pair pair;
            for (int i = 0; i < Pairs.Count; i++)
            {
                for (int j = 0; j < Pairs.Count; j++)
                {
                    if (i == j) continue;
                    pair = new Pair(Pairs[i], Pairs[j]);
                    ((Pair)pair.Left).Parent = pair;
                    ((Pair)pair.Right).Parent = pair;
                    Reduce(pair);
                    mag = Math.Max(mag, GetMagnitude(pair));
                }
            }
            return mag;
        }

        private void Reduce(Pair pair)
        {
            while (true)
            {
                if (FindDepth5(pair)) continue;
                if (!FindLargeVal(pair)) break;
            }
        }

        // ugh I think I gotta do an inorder tree traversal
        private bool FindDepth5(Pair pair)
        {
            pair.MarkUnvisited();
            while (pair != null)
            {
                if (pair.Left.IsPair)
                {
                    if (((Pair)pair.Left).Depth > 4)
                    {
                        Explode((Pair)pair.Left);
                        return true;
                    }
                    if (!((Pair)pair.Left).Visited)
                    {
                        pair = (Pair)pair.Left;
                        continue;
                    }
                }
                if (pair.Right.IsPair)
                {
                    if (((Pair)pair.Right).Depth > 4)
                    {
                        Explode((Pair)pair.Right);
                        return true;
                    }
                    if (!((Pair)pair.Right).Visited)
                    {
                        pair = (Pair)pair.Right;
                        continue;
                    }
                }
                pair.Visited = true;
                pair = pair.Parent;
            }
            return false;
        }

        private bool FindLargeVal(Pair pair)
        {
            pair.MarkUnvisited();
            while (pair != null)
            {
                if (!pair.Left.IsPair)
                {
                    if (TrySplit(pair, true)) return true;
                }
                else if (!((Pair)pair.Left).Visited)
                {
                    pair = (Pair)pair.Left;
                    continue;
                }
                if (!pair.Right.IsPair)
                {
                    if (TrySplit(pair, false)) return true;
                }
                else if (!((Pair)pair.Right).Visited)
                {
                    pair = (Pair)pair.Right;
                    continue;
                }
                pair.Visited = true;
                pair = pair.Parent;
            }
            return false;
        }

        private bool TrySplit(Pair pair, bool isLeft)
        {
            int n = isLeft ? ((Num)pair.Left).Val : ((Num)pair.Right).Val;
            if (n > 9)
            {
                pair.SplitChild(isLeft, n);
                pair = pair.Root;
                return true;
            }
            return false;
        }

        // some repeated code in here; it's not my best work but I'm tryna get done
        private void Explode(Pair pair)
        {
            int left = ((Num)pair.Left).Val;
            int right = ((Num)pair.Right).Val;
            Pair origPair = pair;
            bool isLeft = pair.Parent.Left == pair;
            pair = pair.Parent;

            // find the next number to the left, add left to it
            if (!isLeft)
            {
                if (!pair.Left.IsPair) ((Num)pair.Left).Val = ((Num)pair.Left).Val + left;
                else // need to go down until we find a Num
                {
                    pair = (Pair)pair.Left;
                    while (pair.Right.IsPair) pair = (Pair)pair.Right;
                    ((Num)pair.Right).Val = ((Num)pair.Right).Val + left;
                }
            }
            else // need to go up while isLeft
            {
                while (pair != null && isLeft)
                {
                    isLeft = pair.Parent?.Left == pair;
                    pair = pair.Parent;
                }
                if (pair != null) // if pair is null we've gone all the way up and there are no numbers to the left
                {
                    if (!pair.Left.IsPair) ((Num)pair.Left).Val = ((Num)pair.Left).Val + left;
                    else
                    {
                        pair = (Pair)pair.Left;
                        while (pair.Right.IsPair) pair = (Pair)pair.Right;
                        ((Num)pair.Right).Val = ((Num)pair.Right).Val + left;
                    }
                }
            }

            // reset pair
            pair = origPair.Parent;
            isLeft = pair.Left == origPair;

            // find the next number to the right, add right to it
            if (isLeft)
            {
                if (!pair.Right.IsPair) ((Num)pair.Right).Val = ((Num)pair.Right).Val + right;
                else
                {
                    pair = (Pair)pair.Right;
                    while (pair.Left.IsPair) pair = (Pair)pair.Left;
                    ((Num)pair.Left).Val = ((Num)pair.Left).Val + right;
                }
            }
            else
            {
                while (pair != null && !isLeft)
                {
                    isLeft = pair.Parent?.Left == pair;
                    pair = pair.Parent;
                }
                if (pair != null)
                {
                    if (!pair.Right.IsPair) ((Num)pair.Right).Val = ((Num)pair.Right).Val + right;
                    else
                    {
                        pair = (Pair)pair.Right;
                        while (pair.Left.IsPair) pair = (Pair)pair.Left;
                        ((Num)pair.Left).Val = ((Num)pair.Left).Val + right;
                    }
                }
            }

            // set the pair to Num 0
            pair = origPair.Parent;
            isLeft = pair.Left == origPair;
            if (isLeft) pair.Left = new Num(0);
            else pair.Right = new Num(0);

            // set pair to root using origPair (in case pair == null) and mark unvisited
            pair = origPair.Root;
            pair.MarkUnvisited();
        }

        // recursively takes left * 3 + right * 2
        private int GetMagnitude(Pair pair)
        {
            int left = pair.Left.IsPair ? GetMagnitude((Pair)pair.Left) : ((Num)pair.Left).Val;
            int right = pair.Right.IsPair ? GetMagnitude((Pair)pair.Right) : ((Num)pair.Right).Val;
            return (left * 3) + (right * 2);
        }


        // Recursively constructs a Pair object from a line of input
        public static ISnail ConvertLine(string line)
        {
            // base case: we've gotten down to an int
            if (line.Length == 1) return new Num(Convert.ToInt32(line));

            // trim [] (in the context of this problem we can assume the outer characters are square brackets)
            line = line[1..^1];
            string left;
            string right;

            if (line[0] != '[')
            {
                left = line[0].ToString();
                right = line[2..];
            }
            else
            {
                // find the ] at the same level as the [ at index 0 to find the left side
                // the right side is the remainder to the right of the comma
                int count = 1;
                int ind = 0;
                for (int i = 1; count > 0; i++, ind = i)
                {
                    if (line[i] == '[') count++;
                    else if (line[i] == ']') count--;
                }
                left = line[..ind];
                right = line[(ind + 1)..];
            }

            // all snailfish numbers are pairs
            Pair pair = new();

            // Recursively set children, assign this pair as their parent for upward movement
            pair.Left = ConvertLine(left);
            if (pair.Left.IsPair) ((Pair)pair.Left).Parent = pair;
            pair.Right = ConvertLine(right);
            if (pair.Right.IsPair) ((Pair)pair.Right).Parent = pair;
            return pair;
        }
    }

    internal interface ISnail
    {
        bool IsPair { get; }
    }

    internal class Num : ISnail
    {
        public int Val { get; set; }
        public bool IsPair => false;

        public Num(int val)
        {
            Val = val;
        }
    }

    internal class Pair : ISnail
    {
        public ISnail Left { get; set; }
        public ISnail Right { get; set; }
        public Pair Parent { get; set; }
        public bool Visited { get; set; } = false;
        public bool IsPair => true;
        public bool IsSimple => (!Left.IsPair) && (!Right.IsPair);
        public Pair Root
        {
            get
            {
                Pair pair = this;
                while (pair.Parent != null) pair = pair.Parent;
                return pair;
            }
        }
        public int Depth
        {
            get
            {
                int d = 1;
                Pair pair = this;
                while (pair.Parent != null)
                {
                    pair = pair.Parent;
                    d++;
                }
                return d;
            }
        }

        public Pair() { }

        public Pair(ISnail left, ISnail right, Pair parent = null)
        {
            // Making deep copies by converting each pair to a string and back to a pair
            Left = left.IsPair ? Day18.ConvertLine(((Pair)left).BuildString((Pair)left)) : new Num(((Num)left).Val);
            Right = right.IsPair ? Day18.ConvertLine(((Pair)right).BuildString((Pair)right)) : new Num(((Num)right).Val);
            Parent = parent;
        }

        public void SplitChild(bool isLeft, int n)
        {
            Pair pair = new();
            // we're not going to check to see if the child is a Num first because we're CRAZY
            pair.Left = new Num(n / 2);
            pair.Right = new Num(n - ((Num)pair.Left).Val);
            pair.Parent = this;
            if (isLeft) this.Left = pair;
            else this.Right = pair;
        }

        // marks this pair unvisited and cascades downward if includeChildren = true
        public void MarkUnvisited(bool includeChildren = true)
        {
            Visited = false;
            if (includeChildren)
            {
                if (Left.IsPair) ((Pair)Left).MarkUnvisited();
                if (Right.IsPair) ((Pair)Right).MarkUnvisited();
            }
        }

        public void Print()
        {
            Console.WriteLine(this.BuildString(this));
        }

        // recursively builds a string representation of the snaifish number for printing (for debugging purposes)
        public string BuildString(Pair pair)
        {
            string left = pair.Left.IsPair ? BuildString((Pair)pair.Left) : ((Num)pair.Left).Val.ToString();
            string right = pair.Right.IsPair ? BuildString((Pair)pair.Right) : ((Num)pair.Right).Val.ToString();
            return $"[{left},{right}]";
        }
    }
}
