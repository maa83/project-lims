using System;

using Lims.Models;

namespace Lims.ViewModels
{
    public class TestParameterMethodViewModel
    {
        public int TestParameterId { get; set; }
        public string TestParameterName { get; set; }
        public string TestParameterCode { get; set; }
        public string TestParameterDescription { get; set; }
        public int MethodId { get; set; }
        public string MethodName { get; set; }
        public string MethodCode { get; set; }
        public string MethodDescription { get; set; }
        public string MethodUnit { get; set; }
        public double TestParameterMethodPrice { get; set; }
    }
}