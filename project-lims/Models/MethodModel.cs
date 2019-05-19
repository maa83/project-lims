using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

using Newtonsoft.Json;

using Lims.BaseModels;

namespace Lims.Models
{
    public class MethodModel : MethodBaseModel
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [Key]
        public override int Id { get; set; }

        [JsonIgnore]
        [InverseProperty("Method")]
        public List<TestParameterMethodModel> TestParameterMethods { get; set; }
        [JsonIgnore]
        [InverseProperty("Method")]
        public List<SampleTestParameterModel> SampleTestParameters { get; set; }
    }
}