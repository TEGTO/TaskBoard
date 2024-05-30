using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardDtoValidator : AbstractValidator<BoardDto>
    {
        public BoardDtoValidator()
        {
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.UserId).NotNull();
        }
    }
}
