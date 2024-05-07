using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace TaskBoardAPI.Models.Dto
{
    public class BoardTaskListDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public DateTime CreationTime { get; set; }
        public string? Name { get; set; }
        public List<BoardTaskDto> BoardTasks { get; set; } = new List<BoardTaskDto>();
    }
}
