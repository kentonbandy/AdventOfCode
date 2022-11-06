
namespace AOC.Solutions
{
    internal class Day2
    {
        public void Day2_1()
        {
            List<string> commands = Helpers.ReadFile(2);
            int hor = 0, dep = 0;
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

        public void Day2_2()
        {

            List<string> commands = Helpers.ReadFile(2);
            int hor = 0, dep = 0, aim = 0;
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
