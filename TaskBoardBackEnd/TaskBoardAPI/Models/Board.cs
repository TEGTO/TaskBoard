using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskBoardAPI.Models
{
    public class Board
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public DateTime CreationTime { get; set; }
        public string? Name { get; set; }

        public void CopyOther(Board other)
        {
            UserId = other.UserId;
            Name = other.Name;
            CreationTime = other.CreationTime;
        }
    }
}
