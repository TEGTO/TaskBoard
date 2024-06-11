using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskListDtoValidator : AbstractValidator<BoardTaskListDto>
    {
        public BoardTaskListDtoValidator()
        {
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.BoardId).NotNull();
            RuleFor(x => x.BoardTasks).NotNull();
        }
    }
}
