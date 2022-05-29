﻿
using System.Text;

namespace AOC.Solutions
{
    internal class Day16
    {
        string Binary { get; set; }
        Dictionary<char, string> HexDict = new()
        {
            { '0', "0000" },
            { '1', "0001" },
            { '2', "0010" },
            { '3', "0011" },
            { '4', "0100" },
            { '5', "0101" },
            { '6', "0110" },
            { '7', "0111" },
            { '8', "1000" },
            { '9', "1001" },
            { 'A', "1010" },
            { 'B', "1011" },
            { 'C', "1100" },
            { 'D', "1101" },
            { 'E', "1110" },
            { 'F', "1111" }
        };

        public Day16()
        {
            string rawInput = Helpers.ReadFile(16)[0];
            Binary = HexToBinary(rawInput);
        }

        public void RunDecoder()
        {
            Console.WriteLine(SumVersions(new RefString(Binary)));
            Console.WriteLine(EvaluateTransmission(new RefString(Binary)));
        }

        // recursively adds the versions and cuts off the rest of the packet
        public int SumVersions(RefString bin)
        {
            if (!bin.Val.Contains('1')) return 0;

            int version = Convert.ToInt32(bin.Cut(3), 2);
            int typeId = Convert.ToInt32(bin.Cut(3), 2);
            if (typeId == 4)
            {
                while (bin.Cut(1) == "1") bin.Cut(4);
                bin.Cut(4);
            }
            else
            {
                bool lenTypeId = bin.Cut(1) == "1";
                if (lenTypeId) bin.Cut(11);
                else bin.Cut(15);
            }
            return version + SumVersions(bin);
        }

        // recursively performs packet operations
        public long EvaluateTransmission(RefString bin)
        {
            if (!bin.Val.Contains('1')) return 0;

            int version = Convert.ToInt32(bin.Cut(3), 2);
            int typeId = Convert.ToInt32(bin.Cut(3), 2);

            if (typeId == 4) // literal value
            {
                string binVal = "";
                while (bin.Cut(1) == "1")
                {
                    binVal += bin.Cut(4);
                }
                binVal += bin.Cut(4);
                return Convert.ToInt64(binVal, 2);
            }

            // interpret the length type id
            bool lenTypeId = bin.Cut(1) == "1";
            int subLen = lenTypeId ? 0 : Convert.ToInt32(bin.Cut(15), 2);
            int subNum = lenTypeId ? Convert.ToInt32(bin.Cut(11), 2) : 0;

            // list the literal values of the sub-packets (calculated recursively)
            List<long> longs = new();
            if (lenTypeId)
            {
                for (int i = 0; i < subNum; i++) longs.Add(EvaluateTransmission(bin));
            }
            else
            {
                RefString newBin = new(bin.Cut(subLen));
                while (newBin.Len > 0) longs.Add(EvaluateTransmission(newBin));
            }

            // perform the appropriate operation
            if (typeId == 0) return longs.Sum();
            if (typeId == 1) return longs.Aggregate((a, b) => a * b);
            if (typeId == 2) return longs.Min();
            if (typeId == 3) return longs.Max();
            if (typeId == 5) return longs[0] > longs[1] ? 1 : 0;
            if (typeId == 6) return longs[0] < longs[1] ? 1 : 0;
            else return longs[0] == longs[1] ? 1 : 0;
        }

        private string HexToBinary(string hex)
        {
            StringBuilder output = new();
            foreach (char c in hex) output.Append(HexDict[c]);
            return output.ToString();
        }
    }

    internal class RefString
    {
        public string Val { get; set; }
        public int Len
        {
            get { return Val.Length; }
        }

        public RefString(string val)
        {
            Val = val;
        }

        public string Cut(int n)
        {
            string result = Val.Substring(0, n);
            Val = Val.Substring(n);
            return result;
        }
    }
}
