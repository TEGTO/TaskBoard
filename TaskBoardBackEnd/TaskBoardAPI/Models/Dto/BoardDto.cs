namespace TaskBoardAPI.Models.Dto
{
    public class BoardDto
    {
        public string Id { get; set; } = null!;
        public string UserId { get; set; } = null!;
        public DateTime CreationTime { get; set; }
        public string? Name { get; set; }
    }
}
