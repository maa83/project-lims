

using System;
using System.Collections.Generic;

namespace Lims.BaseModels
{
    public class MethodBaseModel
    {
        public virtual int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
        public string UnitOfMeasurement { get; set; }
    }
}