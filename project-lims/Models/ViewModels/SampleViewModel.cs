

using System;
using System.Collections.Generic;

using Lims.Models;
using Lims.BaseModels;

namespace Lims.ViewModels
{
    public class SampleSummaryViewModel
    {
        public virtual int Id { get; set; }
        public string Code { get; set; }
        public string Location { get; set; }
        public DateTime ReceivedDate { get; set; }
        public string PurchaseOrderRequestCode { get; set; }
        public string CustomerName { get; set; }
        public string MatrixName { get; set; }
    }

    public class SampleViewModel : SampleBaseModel
    {
        public string PurchaseOrderRequestCode { get; set; }
        public DateTime PurchaseOrderRequestReceivedDate { get; set; }
        public string MatrixName { get; set; }
        public string ContactName { get; set; }
        public string CustomerName { get; set; }

        public List<SampleTestParameterViewModel> TestParameters { get; set; }
    }
}