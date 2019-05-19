using System;

namespace Lims.BaseModels
{
    public class TestParameterBaseModel
    {
        public virtual int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }
}