using BookLabs.Controllers;
using BookLabs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BookLabs.Tests
{
    public class AuthorsControllerTests
    {
        private readonly AuthorsController _controller;
        private readonly BookBaseContext _context;

        public AuthorsControllerTests()
        {

            var _options = new DbContextOptionsBuilder<BookBaseContext>()
                 .UseInMemoryDatabase(databaseName: "TestDatabase")
                 .Options;
            _context = new BookBaseContext(_options);
            _controller = new AuthorsController(_context);

        }

        internal void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetAuthors_ReturnsListOfAuthors()
        {
            // Arrange

            var author1 = new Author { AuthorName = "Author 1", BirthDate = new DateTime(1950, 10, 12) };
            var author2 = new Author { AuthorName = "Author 2", BirthDate = new DateTime(1964, 8, 21) };

            // Add the authors to the in-memory database

            _context.Authors.AddRange(author1, author2);
            _context.SaveChanges();


            // Act
            var result = await _controller.GetAuthors();

            // Assert
            Assert.IsType<ActionResult<IEnumerable<Author>>>(result);
            Assert.IsType<List<Author>>(result.Value);
            Assert.Equal(2, result.Value.Count());
            Assert.Contains(result.Value, a => a.AuthorId == 1 && a.AuthorName == "Author 1" && a.BirthDate == new DateTime(1950, 10, 12));
            Assert.Contains(result.Value, a => a.AuthorId == 2 && a.AuthorName == "Author 2" && a.BirthDate == new DateTime(1964, 8, 21));
            Dispose();
        }
        [Fact]
        public async Task GetAuthorsCount_ReturnsCorrectCount()
        {
            // Arrange

            var author1 = new Author { AuthorName = "Author 1", BirthDate = new DateTime(1985, 2, 3) };
            var author2 = new Author { AuthorName = "Author 2", BirthDate = new DateTime(1971, 2, 4) };
            var author3 = new Author { AuthorName = "Author 3", BirthDate = new DateTime(1999, 4, 15) };

            // Add the authors to the in-memory database
            _context.Authors.AddRange(author1, author2, author3);
            _context.SaveChanges();

            // Act
            var result = _controller.GetAuthorsCount();

            //Assert 
            Assert.Equal(3, result);
            Dispose();
        }
        [Fact]
        public async Task GetAuthor_ReturnCorrectAuthor()
        {
            // Arrange

            var author1 = new Author { AuthorName = "Author 1", BirthDate = new DateTime(1988, 2, 23) };
            var author2 = new Author { AuthorName = "Author 2", BirthDate = new DateTime(1988, 12, 4) };
            _context.AddRange(author1, author2);
            _context.SaveChanges();
            var autId = author2.AuthorId;

            //Act
            var result = await _controller.GetAuthor(autId);

            //Assert
            Assert.IsType<ActionResult<Author>>(result);
            var author = Assert.IsType<Author>(result.Value);
            Assert.Equal(2, author.AuthorId);
            Assert.Equal("Author 2", author.AuthorName);
            Assert.Equal(new DateTime(1988, 12, 4), author.BirthDate);
            Dispose();

        }
        [Fact]
        public async Task GetAuthor_WithInvalidId_ReturnsNull()
        {
            // Arrange

            var author1 = new Author { AuthorName = "Author 1", BirthDate = new DateTime(1988, 2, 23) };
            var author2 = new Author { AuthorName = "Author 2", BirthDate = new DateTime(1988, 12, 4) };
            _context.AddRange(author1, author2);
            _context.SaveChanges();

            //Act
            var result = await _controller.GetAuthor(27);

            //Assert
            Assert.Null(result.Value);
            Dispose();

        }
        [Fact]
        public async Task PostAuthor_ShouldAddAuthor()
        {
            // Arrange           

            var author = new Author { AuthorName = "Author 1", BirthDate = new DateTime(1997, 8, 12) };

            // Act
            var result = await _controller.PostAuthor(author);

            // Assert
            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdAuthor = Assert.IsType<Author>(createdAtActionResult.Value);
            Assert.Equal(author.AuthorName, createdAuthor.AuthorName);
            Assert.Equal(author.BirthDate, createdAuthor.BirthDate);
            Assert.Equal(author.AuthorId, createdAuthor.AuthorId);
            Dispose();

        }
        [Fact]
        public async Task PostAuthor_WithNullAuthorsSet_ReturnsBadRequest()
        {
            // Arrange


            // Act
            var result = await _controller.PostAuthor(null);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Author cannot be null", badRequestResult.Value);
            Dispose();
        }
        [Fact]
        public async Task PutAuthor_ShouldReturnNoContentResult_WhenAuthorIsUpdated()
        {
            // Arrange

            var author = new Author
            {
                AuthorName = "Test Author",
                BirthDate = new DateTime(1999, 9, 9)
            };

            _context.Authors.Add(author);
            _context.SaveChanges();


            var authorToUpdate = new Author { AuthorId = author.AuthorId, AuthorName = "Updated Test Author", BirthDate = new DateTime(1998, 8, 8) };

            // Act
            var result = await _controller.PutAuthor(1, authorToUpdate);

            // Assert
            Assert.IsType<NoContentResult>(result);
            var updatedAuthor = await _context.Authors.Include(b => b.Books).FirstOrDefaultAsync(a => a.AuthorId == 1);
            Assert.Equal("Updated Test Author", updatedAuthor.AuthorName);
            Assert.Equal(new DateTime(1998, 8, 8), updatedAuthor.BirthDate);
            Dispose();

        }

        // Unsuccessful update with invalid id
        [Fact]
        public async Task PutAuthor_ShouldReturnBadRequestResult_WhenAuthorIdDoesNotMatch()
        {
            // Arrange

            var author = new Author
            {
                AuthorName = "Test Author",
                BirthDate = new DateTime(1999, 9, 9)
            };

            _context.Authors.Add(author);
            _context.SaveChanges();

            // Act
            var updatedAuthor = new Author { AuthorId = author.AuthorId, AuthorName = "Updated Test Author" };
            var result = await _controller.PutAuthor(99, updatedAuthor);

            // Assert
            Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("Test Author", _context.Authors.Single().AuthorName);
            Assert.Equal(new DateTime(1999, 9, 9), _context.Authors.Single().BirthDate);
            Dispose();
        }
        [Fact]
        public async Task DeleteAuthor_ReturnsNoContentResult()
        {
            // Arrange

            var author = new Author
            {
                AuthorName = "Test Author",
                BirthDate = new DateTime(1999, 9, 9)
            };

            _context.Authors.Add(author);
            _context.SaveChanges();

            // Act
            var result = await _controller.DeleteAuthor(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Dispose();
        }
    }

}

