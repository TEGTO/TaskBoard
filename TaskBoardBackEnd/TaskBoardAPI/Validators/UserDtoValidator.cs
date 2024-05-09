using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class UserDtoValidator : AbstractValidator<UserDto>
    {
        public UserDtoValidator()
        {
            RuleFor(x => x).NotNull();
            RuleFor(x => x.Id).NotNull();
        }
    }
}
