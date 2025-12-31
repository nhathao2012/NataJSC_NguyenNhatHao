using System.ComponentModel.DataAnnotations;

namespace NataJSC_Web_Test3112.Models
{
    public class LandOwner
    {
        [Key]
        public int Id { get; set; }
        [Required]
        [MaxLength(200)]
        public string Name { get; set; }
        [MaxLength(20)]
        public string Phone { get; set; }
        [MaxLength(150)]
        public string? Email { get; set; }
        [MaxLength(300)]
        public string Address { get; set; }
        public string? Note { get; set; }
        
        public virtual ICollection<ForestArea>? ForestAreas { get; set; } = new List<ForestArea>();
    }
}
