using System;

namespace Lims.BaseModels
{
    public class MatrixBaseModel
    {
        public virtual int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }
}