using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskValidator : AbstractValidator<BoardTaskDto>
    {
        public BoardTaskValidator()
        {
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.BoardTaskListId).NotNull();
        }
    }
}
