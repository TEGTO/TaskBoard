using FluentValidation;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskActivityValidator : AbstractValidator<BoardTaskActivity>
    {
        public BoardTaskActivityValidator()
        {
            RuleFor(x => x).NotNull();
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.BoardTaskId).NotNull();
            RuleFor(x => x.ActivityTime.ToUniversalTime()).LessThanOrEqualTo(DateTime.UtcNow);
        }
    }
}
