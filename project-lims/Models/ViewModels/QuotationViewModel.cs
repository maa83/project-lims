
using System;
using System.Collections.Generic;

using Lims.Models;
using Lims.ViewModels;

namespace Lims.ViewModels
{
    public class QuotationViewModelModel
    {
        public decimal SamplingFees { get; set; }
        public decimal ExtraFees { get; set; }
        public string ExtraFeesReason { get; set; }
        public int Discount { get; set; }
        public DateTime Tstamp { get; set; }

        //foreign
        public int PurchaseOrderRequestId { get; set; }
    }
}