using System;

namespace Lims.BaseModels
{
    public class SampleTestParameterBaseModel
    {
        public virtual int Id { get; set; }
        public int SampleId { get; set; }
        public int TestParameterId { get; set; }
        public int MethodId { get; set; }
        public int TestParameterMethodId { get; set; }

        public double ModifiedPrice { get; set; }
    }
}