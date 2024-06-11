using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardActivityDtoValidator : AbstractValidator<BoardActivityDto>
    {
        public BoardActivityDtoValidator()
        {
            RuleFor(x => x.Id).NotNull();
        }
    }
}
