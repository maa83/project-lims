using System;
using System.Collections.Generic;

namespace Lims.BaseModels
{
    public class PurchaseOrderRequestBaseModel
    {
        public int Id { get; set; }
        public string Code { get; set; }
        public int ContactId { get; set; }
        public int SubmittedById { get; set; }
        public DateTime ReceivedDate { get; set; }
        public DateTime Tstamp { get; set; }
    }
}