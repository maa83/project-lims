


using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Collections.Generic;

using Newtonsoft.Json;

using Lims.BaseModels;

namespace Lims.Models
{
    [Table("SampleTestParameters")]
    public class SampleTestParameterModel : SampleTestParameterBaseModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public override int Id { get; set; }

        //Foreign

        [ForeignKey("SampleId")]
        public SampleModel Sample { get; set; }

        [ForeignKey("TestParameterId")]
        public TestParameterModel TestParameter { get; set; }

        [ForeignKey("MethodId")]
        public MethodModel Method { get; set; }

        [ForeignKey("TestParameterMethodId")]
        public TestParameterMethodModel TestParameterMethod { get; set; }

        [InverseProperty("SampleTestParameter")]
        public List<SampleTestParameterResultModel> SampleTestParameterResults { get; set; }
    }
}