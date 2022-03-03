using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC.Solutions
{
    internal class Day11
    {
        private int[][] Octos { get; set; }
        
        public Day11()
        {
            Octos = Helpers.readFile(11).Select(l => l.Select(c => c - '0').ToArray()).ToArray();
        }
        
        public void OctoFlashes()
        {
            //1 increase all by 1
            //2 change > 9 to -9, increment neighbors
            //3 repeat 2 until all numbers are < 9
            //4 switch < 0 to 0
            int count = 0;
            for (int i = 0; i < 100; i++)
            {
                Octos = Octos.Select(a => a.Select(i => i + 1).ToArray()).ToArray();
                int flashes = 1;
                while (flashes > 0)
                {
                    flashes = FindFlashes();
                    count += flashes;
                }
                ResetFlashed();
            }
            Console.WriteLine(count);

            //part 2

            count = 100;
            bool synced = false;
            while (!synced)
            {
                count++;
                Octos = Octos.Select(a => a.Select(i => i + 1).ToArray()).ToArray();
                int flashes = 1;
                while (flashes > 0) flashes = FindFlashes();
                synced = ResetFlashed();
            }
            Console.WriteLine(count);
        }

        private void Flash(int r, int c)
        {
            Octos[r][c] = -9;
            bool up = r > 0;
            bool down = r < Octos.Length - 1;
            bool left = c > 0;
            bool right = c < Octos[0].Length - 1;
            if (up) Octos[r - 1][c]++;
            if (up && right) Octos[r - 1][c + 1]++;
            if (right) Octos[r][c + 1]++;
            if (down && right) Octos[r + 1][c + 1]++;
            if (down) Octos[r + 1][c]++;
            if (down && left) Octos[r + 1][c - 1]++;
            if (left) Octos[r][c - 1]++;
            if (left && up) Octos[r - 1][c - 1]++;
        }

        private int FindFlashes()
        {
            int found = 0;
            for (int r = 0; r < Octos.Length; r++)
            {
                for (int c = 0; c < Octos[r].Length; c++)
                {
                    if (Octos[r][c] > 9)
                    {
                        Flash(r, c);
                        found++;
                    }
                }
            }
            return found;
        }

        private bool ResetFlashed()
        {
            bool sync = true;
            for (int r = 0; r < Octos.Length; r++)
            {
                for (int c = 0; c < Octos[r].Length; c++)
                {
                    if (Octos[r][c] < 0) Octos[r][c] = 0;
                    else sync = false;
                }
            }
            return sync;
        }
    }
}
