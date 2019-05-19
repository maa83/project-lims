

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

using Lims.BaseModels;

namespace Lims.Models
{
    public class PurchaseOrderRequestModel : PurchaseOrderRequestBaseModel
    {
        [ForeignKey("ContactId")]
        public ContactModel ReceivedFrom { get; set; }

        [ForeignKey("SubmittedById")]
        public LimsUser SubmittedBy { get; set; }

        [InverseProperty("PurchaseOrderRequest")]
        public QuotationModel Quotation { get; set; }

        [InverseProperty("PurchaseOrderRequest")]
        public List<SampleModel> Samples { get; set; }
    }
}