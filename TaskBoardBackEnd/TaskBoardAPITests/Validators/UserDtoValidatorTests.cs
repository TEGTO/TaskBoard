using FluentValidation.TestHelper;
using Moq;
using NUnit.Framework;
using TaskBoardAPI.Models.Dto;
using TaskBoardAPI.Validators;

namespace TaskBoardAPITests.Validators
{
    [TestFixture]
    public class UserDtoValidatorTests
    {
        private UserDtoValidator validator;

        [SetUp]
        public void Setup()
        {
            validator = new UserDtoValidator();
        }
        [Test]
        public void Validate_WhenIdIsNull_ShouldHaveValidationErrorForId()
        {
            // Arrange
            var userDto = new UserDto { Id = null };
            // Act
            var result = validator.TestValidate(userDto);
            // Assert
            result.ShouldHaveValidationErrorFor(x => x.Id);
        }
        [Test]
        public void Validate_WhenIdIsNotNull_ShouldNotHaveValidationErrorForId()
        {
            // Arrange
            var userDto = new UserDto { Id = "1" };
            // Act
            var result = validator.TestValidate(userDto);
            // Assert
            result.ShouldNotHaveValidationErrorFor(x => x.Id);
        }
    }
}
