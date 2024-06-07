using FluentValidation.TestHelper;
using TaskBoardAPI.Models;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Validators;

namespace TaskBoardAPITests.Validators
{
    [TestFixture]
    public class BoardTaskValidatorTests
    {
        private BoardTaskValidator validator;

        [SetUp]
        public void Setup()
        {
            validator = new BoardTaskValidator();
        }
        [Test]
        public void Validate_WhenIdIsNull_ShouldHaveValidationErrorForId()
        {
            // Arrange
            var boardTaskDto = new BoardTaskDto { Id = null, BoardTaskListId = "1" };
            // Act
            var result = validator.TestValidate(boardTaskDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Id);
        }

        [Test]
        public void Validate_WhenBoardTaskListIdIsNull_ShouldHaveValidationErrorForBoardTaskListId()
        {
            // Arrange
            var boardTaskDto = new BoardTaskDto { Id = "1", BoardTaskListId = null, Priority = Priority.Low };
            // Act
            var result = validator.TestValidate(boardTaskDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.BoardTaskListId);
        }
        [Test]
        public void Validate_WhenIdAndBoardTaskListIdAndPriorityAreNotNull_ShouldNotHaveValidationErrors()
        {
            // Arrange
            var boardTaskDto = new BoardTaskDto { Id = "1", BoardTaskListId = "1", Priority = Priority.Low };
            // Act
            var result = validator.TestValidate(boardTaskDto);
            // Assert
            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}
