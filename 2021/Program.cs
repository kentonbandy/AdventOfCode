
void day1_1()
{
    List<int> depths = convertListToInt(readFile(1));
    int count = 0;
    int j;
    if (depths != null && depths.Count > 0)
    {
        j = depths[0];
    }
    else
    {
        Console.WriteLine("Something's fucked");
        return;
    }
    for (int i = 0; i < depths.Count; i++)
    {
        int current = depths[i];
        if (current > j) count++;
        j = current;
    }
    Console.WriteLine(count);
}

void day1_2() {
    List<int> depths = convertListToInt(readFile(1));
    int count = 0;
    int j;
    if (depths != null && depths.Count > 0)
    {
        j = depths[0] + depths[1] + depths[2];
    }
    else
    {
        Console.WriteLine("Something's fucked");
        return;
    }
    for (int i = 0; i < depths.Count - 2; i++)
    {
        int current = depths[i] + depths[i+1] + depths[i+2];
        if (current > j) count++;
        j = current;
    }
    Console.WriteLine(count);
}

void day2_1()
{
    List<string> commands = readFile(2);
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

void day2_2()
{

    List<string> commands = readFile(2);
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

void day3_1()
{
    List<string> bin = readFile(3);
    Dictionary<int, int> counts = new();
    foreach (string bit in bin) for (int i = 0; i < bit.Length; i++)
        {
            if (!counts.ContainsKey(i)) counts[i] = bit[i] == '1' ? 1 : 0;
            else if (bit[i] == '1') counts[i]++;
        }
    List<bool> bools = new();
    for (int i = 0; i < bin[0].Length; i++) bools.Add(counts[i] > bin.Count / 2);
    string gam = "";
    string eps = "";
    foreach (bool b in bools)
    {
        gam += b ? "1" : "0";
        eps += b ? "0" : "1";
    }
    Console.WriteLine(binaryStringToDec(gam) * binaryStringToDec(eps));
}

int binaryStringToDec(string binStr)
{
    int dec = 0;
    for (int i = binStr.Length - 1, j = 0; i >= 0; i--, j++) if (binStr[i] == '1') dec += (int)Math.Pow(2, j);
    return dec;
}




List<string> readFile(int day)
{
    string file = @$"C:\Users\Kenny\coding\AOC\2021\{(day > 9 ? day : $"0{day}")}_input.txt";
    if (file == null) return null;
    List<string> strings = new();
    if (File.Exists(file))
    {
        try
        {
            using (StreamReader sr = new StreamReader(file))
            {
                string? line;
                while ((line = sr.ReadLine()) != null)
                {
                    strings.Add(line);
                }
            }
        }
        catch (Exception)
        {
            Console.WriteLine("The file reader is broken");
        }
    }
    return strings;
}

List<int> convertListToInt(List<string> strings)
{
    List<int> ints = new();
    foreach (string s in strings)
    {
        try
        {
            ints.Add(Convert.ToInt32(s));
        }
        catch (Exception)
        {
            Console.WriteLine("Could not convert list to int");
        }
    }
    return ints;
}


// Main
day1_1();
day1_2();
day2_1();
day2_2();
day3_1();