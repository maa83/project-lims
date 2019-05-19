using System;

namespace Lims.BaseModels
{
    public class QuotationBaseModel
    {
        public decimal SamplingFees { get; set; }
        public decimal ExtraFees { get; set; }
        public string ExtraFeesReason { get; set; }
        public int Discount { get; set; }

        public DateTime Tstamp { get; set; }
    }
}