using FluentValidation;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskValidator : AbstractValidator<BoardTask>
    {
        public BoardTaskValidator()
        {
            RuleFor(x => x).NotNull();
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.BoardTaskListId).NotNull();
            RuleFor(x => x.IsHead).NotNull();
            RuleFor(x => x.CreationTime.ToUniversalTime()).LessThanOrEqualTo(DateTime.UtcNow);
            RuleFor(x => x.Priority).NotNull();
        }
    }
}
