

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

using Lims.BaseModels;
using Lims.Models;
using Lims.ViewModels;

namespace Lims.TransferModels
{


    public class PurchaseOrderRequestTransferModel : PurchaseOrderRequestBaseModel
    {
        public QuotationBaseModel Quotation { get; set; }
        public List<SampleTransferModel> Samples { get; set; }
    }
}