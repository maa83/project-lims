
using System;
using System.Collections.Generic;

using Lims.BaseModels;

namespace Lims.TransferModels
{
    public class TestTransferModel
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public List<TestParameterMethodBaseModel> Methods { get; set; }
        public List<int> Matrices { get; set; }
    }
}