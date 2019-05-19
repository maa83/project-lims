
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lims.Models
{
    public class TestParameterMatrixModel
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public int TestParameterId { get; set; }
        public TestParameterModel TestParameter { get; set; }

        public int MatrixId { get; set; }
        public MatrixModel Matrix { get; set; }
    }
}