using FluentValidation;
using TaskBoardAPI.Models;

namespace TaskBoardAPI.Validators
{
    public class BoardActivityValidator : AbstractValidator<BoardActivity>
    {
        public BoardActivityValidator()
        {
            RuleFor(x => x).NotNull();
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.ActivityTime.ToUniversalTime()).LessThanOrEqualTo(DateTime.UtcNow);
        }
    }
}
