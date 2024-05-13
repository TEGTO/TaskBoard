using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardActivityValidator : AbstractValidator<BoardActivityDto>
    {
        public BoardActivityValidator()
        {
            RuleFor(x => x.Id).NotNull();
        }
    }
}
