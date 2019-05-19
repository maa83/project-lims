
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Lims.BaseModels;

namespace Lims.Models
{
    public class SampleModel : SampleBaseModel
    {
        public SampleModel()
        {
        }
        public SampleModel(SampleBaseModel baseModel)
        {
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        //foreigns
        // public int SubmittedByUserId { get; set; }
        // [ForeignKey("SubmittedByUserId")]
        // public LimsUser SubmittedBy { get; set; }

        // public DateTime LastModifiedOn { get; set; }
        // public int LastModifiedByUserId { get; set; }
        // [ForeignKey("LastModifiedByUserId")]
        // public LimsUser LastModifiedBy { get; set; }

        // public int ApprovedByUserId { get; set; }
        // [ForeignKey("ApprovedByUserId")]
        // public LimsUser ApprovedBy { get; set; }

        [ForeignKey("ReceivedByUserId")]
        public LimsUser ReceivedBy { get; set; }
        [ForeignKey("MatrixId")]
        public MatrixModel Matrix { get; set; }

        [ForeignKey("PurchaseOrderRequestId")]
        public PurchaseOrderRequestModel PurchaseOrderRequest { get; set; }

        //[InverseProperty("Sample")]
        public List<SampleTestParameterModel> SampleTestParameters { get; set; }
    }
}