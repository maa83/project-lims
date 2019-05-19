using System;
using System.Collections.Generic;

using Lims.Models;
using Lims.BaseModels;

namespace Lims.ViewModels
{
    public class SampleTestParameterViewModel : SampleTestParameterBaseModel
    {
        public string TestParameterName { get; set; }
        public string TestParameterCode { get; set; }
        public string TestParameterDescription { get; set; }
        public string MethodName { get; set; }
        public string MethodCode { get; set; }
        public string MethodDescription { get; set; }
        public string MethodUnit { get; set; }
        public List<SampleTestParameterResultBaseModel> SampleTestParameterResults { get; set; }
    }
}