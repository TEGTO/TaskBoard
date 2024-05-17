using FluentValidation.TestHelper;
using Moq;
using NUnit.Framework;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Validators;

namespace TaskBoardAPITests.Validators
{
    [TestFixture]
    public class BoardTaskListValidatorTests
    {
        private BoardTaskListValidator validator;

        [SetUp]
        public void Setup()
        {
            validator = new BoardTaskListValidator();
        }
        [Test]
        public void Validate_WhenIdIsNull_ShouldHaveValidationErrorForId()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto { Id = null, UserId = "1", BoardTasks = new List<BoardTaskDto>() };
            // Act
            var result = validator.TestValidate(boardTaskListDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Id);
        }
        [Test]
        public void Validate_WhenUserIdIsNull_ShouldHaveValidationErrorForUserId()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto { Id = "1", UserId = null, BoardTasks = new List<BoardTaskDto>() };
            // Act
            var result = validator.TestValidate(boardTaskListDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.UserId);
        }
        [Test]
        public void Validate_WhenBoardTasksIsNull_ShouldHaveValidationErrorForBoardTasks()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto { Id = "1", UserId = "1", BoardTasks = null };
            // Act
            var result = validator.TestValidate(boardTaskListDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.BoardTasks);
        }
        [Test]
        public void Validate_WhenIdAndUserIdAndBoardTasksAreNotNull_ShouldNotHaveValidationErrors()
        {
            // Arrange
            var boardTaskListDto = new BoardTaskListDto { Id = "1", UserId = "1", BoardTasks = new List<BoardTaskDto>() };
            // Act
            var result = validator.TestValidate(boardTaskListDto);
            // Assert
            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}
