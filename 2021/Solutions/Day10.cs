using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day10
    {
        private Helpers Help = new();
        private List<string> Lines;
        private List<Stack<char>> IncompleteLines = new();
        private Dictionary<char, char> Match;
        private Dictionary<char, int> Score;
        private Dictionary<char, long> Score2;
        private Stack<char> Stack = new();

        public Day10()
        {
            Lines = Help.readFile(10);
            Match = new() {{ ')', '(' },    { ']', '[' },   { '}', '{' },   { '>', '<' }};
            Score = new() {{ ')', 3 },      { ']', 57 },    { '}', 1197 },  { '>', 25137 }};
            Score2 = new(){{ '(', 1 },      { '[', 2 },     { '{', 3 },     { '<', 4 }};
        }

        public void SyntaxScore()
        {
            int synScore = 0;
            Lines.ForEach(x => synScore += checkLine(x));
            Console.WriteLine(synScore);
        }

        public void AutoComplete()
        {
            Lines.ForEach(x => checkLine(x, true));
            List<long> scores = new();
            long score = 0;
            foreach (Stack<char> s in IncompleteLines)
            {
                while (s.Count > 0) score = (score * 5) + Score2[s.Pop()];
                scores.Add(score);
                score = 0;
            }
            scores.Sort();
            Console.WriteLine(scores[scores.Count / 2]);
        }

        private int checkLine(string line, bool filterList = false)
        {
            foreach(char c in line)
            {
                if (Match.Values.Contains(c)) Stack.Push(c);
                else if (Stack.Count > 0 && Stack.Peek() == Match[c]) Stack.Pop();
                else
                {
                    Stack.Clear();
                    return Score[c];
                }
            }
            if (filterList) IncompleteLines.Add(new Stack<char>(Stack.Reverse()));
            Stack.Clear();
            return 0;
        }
    }
}
