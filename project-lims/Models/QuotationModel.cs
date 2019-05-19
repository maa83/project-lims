using System;
using System.ComponentModel.DataAnnotations.Schema;

using Lims.BaseModels;

namespace Lims.Models
{
    public class QuotationModel : QuotationBaseModel
    {
        //foreign
        public int PurchaseOrderRequestId { get; set; }
        [ForeignKey("PurchaseOrderRequestId")]
        public PurchaseOrderRequestModel PurchaseOrderRequest { get; set; }
    }
}