using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskBoardAPI.Models
{
    public class BoardActivity
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public DateTime ActivityTime { get; set; }
        public string? Description { get; set; }
    }
}
