using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskBoardAPI.Models
{
    public class BoardTaskActivity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; } = null!;
        public string BoardTaskId { get; set; } = null!;
        public DateTime ActivityTime { get; set; }
        public string? Description { get; set; }
    }
}
