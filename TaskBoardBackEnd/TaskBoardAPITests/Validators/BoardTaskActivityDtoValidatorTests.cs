using FluentValidation.TestHelper;
using Moq;
using NUnit.Framework;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Validators;

namespace TaskBoardAPITests.Validators
{
    [TestFixture]
    public class BoardTaskActivityDtoValidatorTests
    {
        private BoardTaskActivityDtoValidator validator;

        [SetUp]
        public void Setup()
        {
            validator = new BoardTaskActivityDtoValidator();
        }
        [Test]
        public void Validate_WhenIdIsNull_ShouldHaveValidationErrorForId()
        {
            // Arrange
            var boardTaskActivityDto = new BoardTaskActivityDto { Id = null, BoardTaskId = "1" };
            // Act
            var result = validator.TestValidate(boardTaskActivityDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Id);
        }
        [Test]
        public void Validate_WhenBoardTaskIdIsNull_ShouldHaveValidationErrorForBoardTaskId()
        {
            // Arrange
            var boardTaskActivityDto = new BoardTaskActivityDto { Id = "1", BoardTaskId = null };
            // Act
            var result = validator.TestValidate(boardTaskActivityDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.BoardTaskId);
        }
        [Test]
        public void Validate_WhenIdAndBoardTaskIdAreNotNull_ShouldNotHaveValidationErrors()
        {
            // Arrange
            var boardTaskActivityDto = new BoardTaskActivityDto { Id = "1", BoardTaskId = "2" };
            // Act
            var result = validator.TestValidate(boardTaskActivityDto);
            // Assert
            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}
