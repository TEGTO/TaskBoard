using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskActivityDtoValidator : AbstractValidator<BoardTaskActivityDto>
    {
        public BoardTaskActivityDtoValidator()
        {
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.BoardTaskId).NotNull();
        }
    }
}
