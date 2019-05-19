
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Lims.Models
{
    public class MatrixModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }

        [JsonIgnore]
        public List<SampleModel> Samples { get; set; }
        [JsonIgnore]
        public List<TestParameterMatrixModel> TestParameterMatrices { get; set; }
        public static class Codes
        {
            public const string Solid = "SLD";
            public const string Liquid = "LQD";
            public const string Gas = "GAS";

            public static string Get(string matrixName)
            {
                string code = string.Empty;
                switch(matrixName)
                {
                    case "Solid":
                    code = Codes.Solid;
                    break;
                    case "Liquid":
                    code = Codes.Liquid;
                    break;
                    case "Gas":
                    code = Codes.Gas;
                    break;
                }

                return code;
            }
        }
    }
}