﻿using FluentValidation;
using TaskBoardAPI.Models.Dto;

namespace TaskBoardAPI.Validators
{
    public class BoardTaskListValidator : AbstractValidator<BoardTaskListDto>
    {
        public BoardTaskListValidator()
        {
            RuleFor(x => x.Id).NotNull();
            RuleFor(x => x.BoardId).NotNull();
            RuleFor(x => x.BoardTasks).NotNull();
        }
    }
}
