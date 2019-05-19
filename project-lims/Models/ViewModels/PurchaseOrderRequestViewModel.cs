

using System;
using System.Collections.Generic;

using Lims.Models;

namespace Lims.ViewModels
{

    public class PurchaseOrderRequestViewModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int ContactId { get; set; }
        public string ContactName { get; set; }
        public string ContactPhoneNumber { get; set; }
        public int CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string CustomerPhoneNumber { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime Tstamp { get; set; }

        public decimal SamplingFees { get; set; }
        public decimal ExtraFees { get; set; }
        public string ExtraFeesReason { get; set; }
        public int Discount { get; set; }
        public List<SampleViewModel> Samples { get; set; }
    }
}