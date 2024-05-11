using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskBoardAPI.Models.Dto
{
    public class BoardTaskDto
    {
        public string Id { get; set; } = null!;
        public string BoardTaskListId { get; set; } = null!;
        public DateTime CreationTime { get; set; }
        public DateTime? DueTime { get; set; }
        public string? Name { get; set; }
        public string? Description { get; set; }
        public Priority Priority { get; set; }
    }
}
