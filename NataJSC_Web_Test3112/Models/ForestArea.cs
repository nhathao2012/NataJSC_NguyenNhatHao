using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NataJSC_Web_Test3112.Models
{
    public class ForestArea
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(50)]
        public string Code { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [Column(TypeName = "decimal(10,2)")]
        public decimal Area { get; set; }
        [MaxLength(100)]
        public string TreeType { get; set; }
        [MaxLength(300)]
        public string Location { get; set; }
        public int PlantYear { get; set; }
        [MaxLength(30)]
        public string Status { get; set; }
        [Required]
        public int LandOwnerId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        [ForeignKey("LandOwnerId")]
        public virtual LandOwner? LandOwner { get; set; }
    }
}
