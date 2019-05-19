
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

using Lims.BaseModels;

namespace Lims.Models
{
    public class TestParameterModel : TestParameterBaseModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        //Foreign
        [JsonIgnore]
        public List<TestParameterMatrixModel> TestParameterMatrices { get; set; }
        [JsonIgnore]
        public List<TestParameterMethodModel> TestParameterMethods { get; set; }
        [JsonIgnore]
        public List<SampleTestParameterModel> SampleTestParameters { get; set; }
    }
}