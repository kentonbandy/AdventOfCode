using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day4
    {
        private readonly Helpers help = new();

        public void Bingo1()
        {
            List<string> rawInput = help.readFile(4);
            List<int> nums = rawInput[0].Split(',').Select(s => Convert.ToInt32(s)).ToList();
            rawInput.RemoveRange(0, 2);
            List<Board> boards = buildBoardList(rawInput);
            foreach (int num in nums)
            {
                foreach (Board board in boards)
                {
                    board.MarkSquare(num);
                    if (board.IsWinner())
                    {
                        Console.WriteLine(board.SumUnmarked() * num);
                        return;
                    }
                }
            }
        }

        public void Bingo2()
        {
            List<string> rawInput = help.readFile(4);
            List<int> nums = rawInput[0].Split(',').Select(s => Convert.ToInt32(s)).ToList();
            rawInput.RemoveRange(0, 2);
            List<Board> boards = buildBoardList(rawInput);
            foreach (int num in nums)
            {
                foreach (Board board in boards)
                {
                    board.MarkSquare(num);
                    if (board.IsWinner()) board.Bingo = true;
                }
                if (boards.Count > 1) boards = boards.Where(b => !b.Bingo).ToList();
                else if (boards[0].Bingo)
                {
                    Console.WriteLine(boards[0].SumUnmarked() * num);
                    return;
                }
            }
        }

        private List<Board> buildBoardList(List<string> rawInput)
        {
            List<Board> boards = new();
            Board board = new();
            List<Square> row = new();
            foreach (string s in rawInput)
            {
                if (s == "")
                {
                    if (board.Squares.Count > 0)
                    {
                        boards.Add(board);
                        board = new();
                    }
                }
                else
                {
                    foreach (int n in s.Split(' ').Where(s => s != "").Select(s => Convert.ToInt32(s)).ToList()) row.Add(new Square(n, false));
                    board.Squares.Add(row);
                    row = new();
                }
            }
            return boards;
        }
    }


    internal class Board
    {
        public List<List<Square>> Squares { get; set; }
        public bool Bingo { get; set; }

        public Board()
        {
            Squares = new();
            Bingo = false;
        }

        public void MarkSquare(int num)
        {
            foreach (List<Square> row in Squares) foreach (Square square in row) if (square.Val == num) square.Marked = true;
        }

        public bool IsWinner()
        {
            for (int i = 0; i < Squares.Count; i++) if (allTrue(Squares[i]) || allTrue(column(i))) return true;
            return allTrue(diag(true)) || allTrue(diag(false));
        }

        public int SumUnmarked()
        {
            int sum = 0;
            foreach (List<Square> row in Squares) foreach (Square s in row) if (!s.Marked) sum += s.Val;
            return sum;
        }

        private bool allTrue(List<Square> line)
        {
            return line.TrueForAll(s => s.Marked);
        }

        private List<Square> column(int col)
        {
            List<Square> result = new();
            if (col < 0 || col > Squares.Count - 1) return result;
            foreach (List<Square> row in Squares)
            {
                result.Add(row[col]);
            }
            return result;
        }

        private List<Square> diag(bool topLeft)
        {
            List<Square> result = new();
            int len = Squares.Count;
            for (int i = 0; i < Squares[0].Count; i++) result.Add(Squares[topLeft ? i : (len-1) - i][i]);
            return result;
        }
    }


    internal class Square
    {
        public int Val { get; set; }
        public bool Marked { get; set; }

        public Square(int Val, bool Marked)
        {
            this.Val = Val;
            this.Marked = Marked;
        }
    }
}
