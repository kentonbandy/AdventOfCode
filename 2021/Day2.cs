using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AOC
{
    internal class Day2
    {
        private readonly Helpers help = new();

        public void day2_1()
        {
            List<string> commands = help.readFile(2);
            int hor = 0;
            int dep = 0;
            foreach (string cmd in commands)
            {
                string[] vs = cmd.Split(' ');
                string dir = vs[0];
                int dis = Convert.ToInt32(vs[1]);
                if (dir == "forward") hor += dis;
                else dep += dir == "up" ? dis * -1 : dis;
            }
            Console.WriteLine(hor * dep);
        }

        public void day2_2()
        {

            List<string> commands = help.readFile(2);
            int hor = 0;
            int dep = 0;
            int aim = 0;
            foreach (string cmd in commands)
            {
                string[] vs = cmd.Split(' ');
                string dir = vs[0];
                int dis = Convert.ToInt32(vs[1]);
                if (dir == "forward")
                {
                    hor += dis;
                    dep += dis * aim;
                }
                else aim += dir == "up" ? dis * -1 : dis;
            }
            Console.WriteLine(hor * dep);
        }
    }
}
