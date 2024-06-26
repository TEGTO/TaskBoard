﻿using FluentValidation.TestHelper;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Validators;

namespace TaskBoardAPITests.Validators
{
    [TestFixture]
    public class BoardTaskListDtoValidatorTests
    {
        private BoardTaskListDtoValidator validator;

        [SetUp]
        public void Setup()
        {
            validator = new BoardTaskListDtoValidator();
        }
        [Test]
        public void Validate_WhenIdIsNull_ShouldHaveValidationErrorForId()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto { Id = null, BoardId = "1", BoardTasks = new List<BoardTaskDto>() };
            // Act
            var result = validator.TestValidate(boardTaskListDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Id);
        }
        [Test]
        public void Validate_WhenBoardIsNull_ShouldHaveValidationErrorForUserId()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto { Id = "1", BoardId = null, BoardTasks = new List<BoardTaskDto>() };
            // Act
            var result = validator.TestValidate(boardTaskListDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.BoardId);
        }
        [Test]
        public void Validate_WhenBoardTasksIsNull_ShouldHaveValidationErrorForBoardTasks()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto { Id = "1", BoardId = "1", BoardTasks = null };
            // Act
            var result = validator.TestValidate(boardTaskListDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.BoardTasks);
        }
        [Test]
        public void Validate_WhenIdAndBoardIdAndBoardTasksAreNotNull_ShouldNotHaveValidationErrors()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto { Id = "1", BoardId = "1", BoardTasks = new List<BoardTaskDto>() };
            // Act
            var result = validator.TestValidate(boardTaskListDto);
            // Assert
            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}
