
using System;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Lims.BaseModels;

namespace Lims.Models
{
    [Table("SampleTestParameterResults")]
    public class SampleTestParameterResultModel : SampleTestParameterResultBaseModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public override int Id { get; set; }

        [Timestamp]
        public byte[] RowId { get; set; }

        //Foreign
        [ForeignKey("SampleTestParameterId")]
        public SampleTestParameterModel SampleTestParameter { get; set; }
        [ForeignKey("UserId")]
        public LimsUser SubmittedBy { get; set; }
    }
}