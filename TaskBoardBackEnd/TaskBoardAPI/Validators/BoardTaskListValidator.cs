using FluentValidation;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskListValidator : AbstractValidator<BoardTaskList>
    {
        public BoardTaskListValidator()
        {
            RuleFor(x => x).NotNull();
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.UserId).NotNull();
            RuleFor(x => x.BoardTasks).NotNull();
            RuleFor(x => x.CreationTime.ToUniversalTime()).LessThanOrEqualTo(DateTime.UtcNow);
        }
    }
}
