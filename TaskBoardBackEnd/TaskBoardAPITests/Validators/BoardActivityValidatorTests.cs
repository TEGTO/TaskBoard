using FluentValidation.TestHelper;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Validators;

namespace TaskBoardAPITests.Validators
{
    [TestFixture]
    public class BoardActivityValidatorTests
    {
        private BoardActivityValidator validator;

        [SetUp]
        public void Setup()
        {
            validator = new BoardActivityValidator();
        }
        [Test]
        public void Validate_WhenIdIsNull_ShouldHaveValidationErrorForId()
        {
            // Arrange
            var boardActivityDto = new BoardActivityDto { Id = null };
            // Act
            var result = validator.TestValidate(boardActivityDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Id);
        }
        [Test]
        public void Validate_WhenIdIsNotNull_ShouldNotHaveValidationErrorForId()
        {
            // Arrange
            var boardActivityDto = new BoardActivityDto { Id = "1" };
            // Act
            var result = validator.TestValidate(boardActivityDto);
            // Assert
            result.ShouldNotHaveValidationErrorFor(x => x.Id);
        }
    }
}
