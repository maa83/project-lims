using System;
using System.Collections.Generic;

namespace Lims.BaseModels
{
    public class TestParameterMethodBaseModel
    {
        public virtual int Id { get; set; }
        public int TestParameterId { get; set; }
        public int MethodId { get; set; }
        public double Price { get; set; }
    }
}