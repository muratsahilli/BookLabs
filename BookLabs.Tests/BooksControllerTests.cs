
using BookLabs.Controllers;
using BookLabs.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BookLabs.Tests
{

    public class BooksControllerTests
    {
        private readonly BooksController _controller;
        private readonly BookBaseContext _context;

        public BooksControllerTests()
        {
            var _options = new DbContextOptionsBuilder<BookBaseContext>()
                 .UseInMemoryDatabase(databaseName: "TestDatabase")
                 .Options;
            _context = new BookBaseContext(_options);
            _controller = new BooksController(_context);

        }
        internal void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }

        [Fact]
        public async Task GetBooks_ReturnsListOfBooks()
        {
            // Arrange
            var book1 = new Book { Title = "Book 1", TotalPages = 120, PublishedDate = DateTime.UtcNow };
            var book2 = new Book { Title = "Book 2", TotalPages = 150, PublishedDate = DateTime.UtcNow };
            var author1 = new Author { AuthorName = "Author 1", BirthDate = DateTime.UtcNow };
            var author2 = new Author { AuthorName = "Author 2", BirthDate = DateTime.UtcNow };
            
            _context.Books.AddRange(book1, book2);
            _context.Authors.AddRange(author1, author2);
            _context.SaveChanges();

            // Associate the authors with the books
            book1.Authors.Add(author1);
            book2.Authors.Add(author1);
            book2.Authors.Add(author2);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetBooks();

            // Assert
            Assert.IsType<ActionResult<IEnumerable<Book>>>(result);
            Assert.IsType<List<Book>>(result.Value);
            Assert.Equal(2, result.Value.Count());
            Assert.Contains(result.Value, b => b.BookId == 1 && b.Title == "Book 1" && b.TotalPages == 120 && b.Authors.Count == 1);
            Assert.Contains(result.Value, b => b.BookId == 2 && b.Title == "Book 2" && b.TotalPages == 150 && b.Authors.Count == 2);
            Dispose();
        }
        [Fact]
        public void GetBooksCount_ReturnsCorrectCount()
        {
            // Arrange

            var book1 = new Book { Title = "Book 1", TotalPages = 120, PublishedDate = DateTime.UtcNow };
            var book2 = new Book { Title = "Book 2", TotalPages = 150, PublishedDate = DateTime.UtcNow };

            _context.Books.AddRange(book1, book2);
            _context.SaveChanges();


            // Act
            var result = _controller.GetBooksCount();

            // Assert
            Assert.IsType<int>(result);
            Assert.Equal(2, result);
            Dispose();
        }

        [Fact]
        public async Task GetBook_ReturnCorrectBook()
        {
            // Arrange

            var book1 = new Book { Title = "Book 1", TotalPages = 150, PublishedDate = new DateTime(2004, 5, 6) };
            var book2 = new Book { Title = "Book 2", TotalPages = 250, PublishedDate = new DateTime(2004, 5, 26) };
            _context.Books.AddRange(book1, book2);
            _context.SaveChanges();
            var bookId = book2.BookId;

            //Act
            var result = await _controller.GetBook(bookId);

            //Assert
            Assert.IsType<ActionResult<Book>>(result);

            var book = Assert.IsType<Book>(result.Value);
            Assert.Equal(2, book.BookId);
            Assert.Equal("Book 2", book.Title);
            Assert.Equal(250, book.TotalPages);
            Assert.Equal(new DateTime(2004, 5, 26), book.PublishedDate);
            Dispose();
        }
        [Fact]
        public async Task GetBook_WithInvalidId_ReturnsNotFound()
        {
            // Arrange

            var book1 = new Book { Title = "Book 1", TotalPages = 150, PublishedDate = new DateTime(2004, 5, 6) };
            var book2 = new Book { Title = "Book 2", TotalPages = 250, PublishedDate = new DateTime(2004, 5, 26) };
            _context.Books.AddRange(book1, book2);
            _context.SaveChanges();

            //Act
            var result = await _controller.GetBook(27);

            //Assert
            Assert.IsType<NotFoundResult>(result.Result);
            Dispose();

        }
        [Fact]
        public async Task PostBook_ShouldAddBookAndAuthors()
        {
            // Arrange

            var book = new Book
            {
                Title = "Test Book",
                TotalPages = 500,
                PublishedDate = DateTime.UtcNow
            };
            var author1 = new Author { AuthorName = "Author 1", BirthDate = DateTime.UtcNow };
            var author2 = new Author { AuthorName = "Author 2", BirthDate = DateTime.UtcNow };
            await _context.Authors.AddRangeAsync(author1, author2);
            await _context.SaveChangesAsync();

            var authorIds = new int[] { author1.AuthorId, author2.AuthorId };

            // Act
            var result = await _controller.PostBook(book, authorIds);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdBook = Assert.IsType<Book>(createdResult.Value);
            Assert.Equal(book.Title, createdBook.Title);
            Assert.Equal(book.TotalPages, createdBook.TotalPages);
            Assert.Equal(book.PublishedDate, createdBook.PublishedDate);
            Assert.Equal(2, createdBook.Authors.Count);
            Assert.Equal(author1.AuthorName, createdBook.Authors.First().AuthorName);
            Assert.Equal(author2.AuthorName, createdBook.Authors.Last().AuthorName);
            Dispose();
        }
        [Fact]
        public async Task PostBook_ShouldReturnBadRequest_WhenBookIsNull()
        {
            // Arrange           
            var authorIds = new int[] { 1, 2 };

            // Act
            var result = await _controller.PostBook(null, authorIds);

            // Assert
            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Book object cannot be null", badRequestResult.Value);
        }
        [Fact]
        public async Task PutBook_ShouldChangeBookInformation()
        {
            // Arrange

            var author1 = new Author { AuthorName = "Author 1", BirthDate = new DateTime(1980, 1, 1) };
            var author2 = new Author { AuthorName = "Author 2", BirthDate = new DateTime(1990, 1, 1) };

            var book = new Book { Title = "Test Book", TotalPages = 100, PublishedDate = new DateTime(2021, 1, 1) };
            book.Authors.Add(author1);
            book.Authors.Add(author2);
            _context.Authors.AddRange(author1, author2);
            _context.Books.Add(book);
            _context.SaveChanges();

            var authorIds = new int[] { 1, 2 }; // add Author 1 and Author 2 to the book

            var bookToUpdate = new Book { BookId = 1, Title = "Updated Book", TotalPages = 200, PublishedDate = new DateTime(2022, 1, 1) };

            // Act
            var result = await _controller.PutBook(1, bookToUpdate, authorIds);

            // Assert
            Assert.IsType<NoContentResult>(result);

            var updatedBook = await _context.Books.Include(b => b.Authors).FirstOrDefaultAsync(b => b.BookId == 1);

            Assert.Equal("Updated Book", updatedBook.Title);
            Assert.Equal(200, updatedBook.TotalPages);
            Assert.Equal(new DateTime(2022, 1, 1), updatedBook.PublishedDate);
            Assert.Equal(2, updatedBook.Authors.Count);
            Dispose();

        }

        
        [Fact]
        public async Task DeleteBook_ReturnsNoContentResult()
        {
            // Arrange

            var book = new Book { Title = "Book 1", TotalPages = 350, PublishedDate = new DateTime(2009, 12, 12) };

            _context.Books.Add(book);
            _context.SaveChanges();

            // Act
            var result = await _controller.DeleteBook(1);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Dispose();
        }


    }


}
