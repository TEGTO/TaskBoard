using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskActivityValidator : AbstractValidator<BoardTaskActivityDto>
    {
        public BoardTaskActivityValidator()
        {
            RuleFor(x => x).NotNull();
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.BoardTaskId).NotNull();
        }
    }
}
