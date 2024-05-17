using FluentValidation.Results;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Moq;
using System.Net;
using TaskBoardAPI.Middleware;
using ValidationException = FluentValidation.ValidationException;

namespace TaskBoardAPITests.Middleware
{
    [TestFixture]
    public class ExceptionMiddlewareTests
    {
        private Mock<ILogger<ExceptionMiddleware>> loggerMock;
        private DefaultHttpContext httpContext;

        [SetUp]
        public void Setup()
        {
            loggerMock = new Mock<ILogger<ExceptionMiddleware>>();
            httpContext = new DefaultHttpContext();
            httpContext.Response.Body = new MemoryStream();
        }
        private ExceptionMiddleware CreateMiddleware(RequestDelegate next)
        {
            return new ExceptionMiddleware(next, loggerMock.Object);
        }
        [Test]
        public async Task InvokeAsync_ValidException_StatusCodeBadRequest()
        {
            // Arrange
            var validationException = new ValidationException("Validation error.");
            RequestDelegate next = context => throw validationException;
            var exceptionMiddleware = CreateMiddleware(next);
            // Act
            await exceptionMiddleware.InvokeAsync(httpContext);
            // Assert
            Assert.That(httpContext.Response.StatusCode, Is.EqualTo((int)HttpStatusCode.BadRequest));
            loggerMock.Verify(x => x.Log(
                LogLevel.Error,
                It.IsAny<EventId>(),
                It.IsAny<It.IsAnyType>(),
                validationException,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()
                ), Times.Exactly(1));
        }
        [Test]
        public async Task InvokeAsync_ValidException_ResponseBodyContainsErrors()
        {
            // Arrange
            IEnumerable<ValidationFailure> errors = new List<ValidationFailure> { new ValidationFailure("Name", "Name is required.") };
            var validationException = new ValidationException(errors);
            RequestDelegate next = context => throw validationException;
            var exceptionMiddleware = CreateMiddleware(next);
            // Act
            await exceptionMiddleware.InvokeAsync(httpContext);
            httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
            var responseBody = new StreamReader(httpContext.Response.Body).ReadToEnd();
            var expectedResponseBody = "{\"StatusCode\":\"400\",\"Messages\":[\"Name: Name is required.\"]}";
            // Assert
            Assert.That(responseBody, Is.EqualTo(expectedResponseBody));
            loggerMock.Verify(x => x.Log(
              LogLevel.Error,
              It.IsAny<EventId>(),
              It.IsAny<It.IsAnyType>(),
              validationException,
              It.IsAny<Func<It.IsAnyType, Exception?, string>>()
              ), Times.Exactly(1));
        }
        [Test]
        public async Task InvokeAsync_GenericException_StatusCodeInternalServerError()
        {
            // Arrange
            var exception = new Exception("Internal Server Error.");
            RequestDelegate next = context => throw exception;
            var exceptionMiddleware = CreateMiddleware(next);
            // Act
            await exceptionMiddleware.InvokeAsync(httpContext);
            // Assert
            Assert.That(httpContext.Response.StatusCode, Is.EqualTo((int)HttpStatusCode.InternalServerError));
            loggerMock.Verify(x => x.Log(
              LogLevel.Error,
              It.IsAny<EventId>(),
              It.IsAny<It.IsAnyType>(),
              exception,
              It.IsAny<Func<It.IsAnyType, Exception?, string>>()
              ), Times.Exactly(1));
        }
        [Test]
        public async Task InvokeAsync_GenericException_ResponseBodyContainsErrorMessage()
        {
            // Arrange
            var exception = new Exception("Internal Server Error.");
            RequestDelegate next = context => throw exception;
            var exceptionMiddleware = CreateMiddleware(next);
            // Act
            await exceptionMiddleware.InvokeAsync(httpContext);
            httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
            var responseBody = new StreamReader(httpContext.Response.Body).ReadToEnd();
            var expectedResponseBody = "{\"StatusCode\":\"500\",\"Messages\":[\"Internal Server Error.\"]}";
            // Assert
            Assert.That(responseBody, Is.EqualTo(expectedResponseBody));
            loggerMock.Verify(x => x.Log(
           LogLevel.Error,
           It.IsAny<EventId>(),
           It.IsAny<It.IsAnyType>(),
           exception,
           It.IsAny<Func<It.IsAnyType, Exception?, string>>()
           ), Times.Exactly(1));
        }
    }
}