using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskDtoValidator : AbstractValidator<BoardTaskDto>
    {
        public BoardTaskDtoValidator()
        {
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.BoardTaskListId).NotNull();
        }
    }
}
