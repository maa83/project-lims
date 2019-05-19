using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

using Lims.BaseModels;

namespace Lims.Models
{
    public class TestParameterMethodModel : TestParameterMethodBaseModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }
        
        public TestParameterModel TestParameter { get; set; }
        public MethodModel Method { get; set; }
        
        [InverseProperty("TestParameterMethod")]
        public List<SampleTestParameterModel> SampleTestParameters { get; set; }
    }
}