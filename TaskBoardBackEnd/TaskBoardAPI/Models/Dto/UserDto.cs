namespace TaskBoardAPI.Models.Dto
{
    public class UserDto
    {
        public string Id { get; set; } = null!;
        public List<BoardTaskListDto> BoardTaskLists { get; set; } = new List<BoardTaskListDto>();
    }
}
