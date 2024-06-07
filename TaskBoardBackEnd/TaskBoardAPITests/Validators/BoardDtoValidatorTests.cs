using FluentValidation.TestHelper;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Validators;

namespace TaskBoardAPITests.Validators
{
    [TestFixture]
    public class BoardDtoValidatorTests
    {
        private BoardDtoValidator validator;

        [SetUp]
        public void Setup()
        {
            validator = new BoardDtoValidator();
        }
        [Test]
        public void Validate_WhenIdIsNull_ShouldHaveValidationErrorForId()
        {
            // Arrange
            var boardDto = new BoardDto { Id = null };
            // Act
            var result = validator.TestValidate(boardDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Id);
        }
        [Test]
        public void Validate_WhenIdIsNotNull_ShouldNotHaveValidationErrorForId()
        {
            // Arrange
            var boardDto = new BoardDto { Id = "1" };
            // Act
            var result = validator.TestValidate(boardDto);
            // Assert
            result.ShouldNotHaveValidationErrorFor(x => x.Id);
        }
        [Test]
        public void Validate_WhenUserIsNull_ShouldHaveValidationErrorForUserId()
        {
            // Arrange
            var boardDto = new BoardDto { Id = "1", UserId = null };
            // Act
            var result = validator.TestValidate(boardDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.UserId);
        }
        [Test]
        public void Validate_WhenIdAndUserIdAreNotNull_ShouldNotHaveValidationErrors()
        {
            // Arrange
            var boardDto = new BoardDto { Id = "1", UserId = "1" };
            // Act
            var result = validator.TestValidate(boardDto);
            // Assert
            result.ShouldNotHaveAnyValidationErrors();
        }
    }
}
