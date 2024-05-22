namespace TaskBoardAPI.Models.Dto
{
    public class BoardActivityDto
    {
        public string Id { get; set; } = null!;
        public string BoardId { get; set; } = null!;
        public DateTime ActivityTime { get; set; }
        public string? Description { get; set; }
    }
}
