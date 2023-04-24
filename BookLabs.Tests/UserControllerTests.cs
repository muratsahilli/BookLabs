using BookLabs.Controllers;
using BookLabs.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Xunit;

namespace BookLabs.Tests
{
    public class UserControllerTests
    {
        private readonly UsersController _controller;
        private readonly BookBaseContext _context;

        public UserControllerTests()
        {
            var _options = new DbContextOptionsBuilder<BookBaseContext>()
                 .UseInMemoryDatabase(databaseName: "TestDatabase")
                 .Options;
            _context = new BookBaseContext(_options);
            _controller = new UsersController(_context);
        }

        internal void Dispose()
        {
            _context.Database.EnsureDeleted();
            _context.Dispose();
        }
        [Fact]
        public async Task GetUsers_ReturnListOfUsers()
        {
            // Arrange 
            var user1 = new User { UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password" };

            _context.Users.Add(user1);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetUsers();

            // Assert
            Assert.IsType<ActionResult<IEnumerable<User>>>(result);
            Assert.IsType<List<User>>(result.Value);
            Assert.Single(result.Value);
            Assert.Contains(result.Value, u => u.UserName == "johndoe" && u.FullName == "John Doe" && u.Email == "johndoe@mail.com" && u.Password == "password");
            Dispose();
        }

        [Fact]
        public async Task GetUserCount_ReturnsCorrectCount()
        {
            // Arrange
            var user1 = new User { UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password" };
            var user2 = new User { UserName = "janedoe", FullName = "Jane Doe", Email = "janedoe@mail.com", Password = "password" };

            _context.Users.AddRange(user1, user2);
            _context.SaveChanges();
            // Act
            var result = _controller.GetUsersCount();


            //Assert
            Assert.IsType<int>(result);
            Assert.Equal(2, result);
            Dispose();
        }

        [Fact]
        public async Task GetUser_ReturnCorrectUser()
        {
            // Arrange
            var user1 = new User { UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password" };
            var user2 = new User { UserName = "janedoe", FullName = "Jane Doe", Email = "janedoe@mail.com", Password = "password" };

            _context.Users.AddRange(user1, user2);
            _context.SaveChanges();

            // Act
            var result = await _controller.GetUser(user2.UserId);

            // Assert
            Assert.IsType<ActionResult<User>>(result);
            var user = Assert.IsType<User>(result.Value);
            Assert.Equal(2, user.UserId);
            Assert.Equal("janedoe", user.UserName);
            Assert.Equal("Jane Doe", user.FullName);
            Assert.Equal("janedoe@mail.com", user.Email);
            Assert.Equal("password", user.Password);
            Dispose();
        }

        [Fact]
        public async Task PostUser_ShouldRegisterUserWithRole()
        {
            // Arrange
            var user = new User { UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password" };
            var role = new Role { RoleName = "user" };
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();
            // Act
            var result = await _controller.PostUser(user);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
            var createdUser = Assert.IsType<User>(createdResult.Value);
            Assert.Equal(user.UserName, createdUser.UserName);
            Assert.Equal(user.FullName, createdUser.FullName);
            Assert.Equal(user.Email, createdUser.Email);
            Assert.Equal(user.Password, createdUser.Password);
            Assert.Equal(1, createdUser.Roles.Count);
            Assert.Equal("user", createdUser.Roles.First().RoleName);
            Dispose();
        }
        [Fact]
        public async Task Login_WithValidCredentials_ReturnsCurrentUser()
        {
            // Arrange
            var role = new Role { RoleName = "user" };
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            var user = new User { UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password" };
            user.Roles.Add(role);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.Login(new User { UserName = "johndoe", Password = "password" });

            // Assert
            var currentUser = Assert.IsType<User>(result.Value);
            Assert.Equal(user.UserName, currentUser.UserName);
            Assert.Equal(user.FullName, currentUser.FullName);
            Assert.Equal(user.Email, currentUser.Email);
            Assert.Equal(user.Password, currentUser.Password);
            Assert.Single(currentUser.Roles);
            Assert.Equal(role.RoleName, currentUser.Roles.First().RoleName);
            Dispose();
        }

        [Fact]
        public async Task Login_WithInvalidCredentials_ReturnsBadRequest()
        {
            // Arrange

            var role = new Role { RoleName = "user" };
            _context.Roles.Add(role);
            await _context.SaveChangesAsync();

            var user = new User { UserName = "johndoe", FullName = "John Doe", Email = "janedoe@mail.com", Password = "password" };
            user.Roles.Add(role);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.Login(new User { Email = "janedoe@mail.com", Password = "password" });

            // Assert
            var requestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
            Assert.Equal("Wrong email or password", requestResult.Value);
            Dispose();
        }
        [Fact]
        public async Task PutUser_WithMatchingId_ReturnsNoContent()
        {
            // Arrange

            var user = new User { UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var updatedUser = new User { UserId = user.UserId, UserName = "janedoe", FullName = "Jane Doe", Email = "janedoe@mail.com", Password = "password" };

            // Act
            var result = await _controller.PutUser(user.UserId, updatedUser);

            // Assert
            Assert.IsType<NoContentResult>(result);
            Assert.Equal(StatusCodes.Status204NoContent, (result as NoContentResult).StatusCode);

            var userInDb = await _context.Users.FindAsync(user.UserId);
            Assert.Equal("janedoe", userInDb.UserName);
            Assert.Equal("Jane Doe", userInDb.FullName);
            Assert.Equal("janedoe@mail.com", userInDb.Email);
            Dispose();
        }

        [Fact]
        public async Task PutUser_WithUnmatchedId_ReturnsBadRequest()
        {
            // Arrange

            var user = new User { UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var updatedUser = new User { UserId = user.UserId + 100, UserName = "janedoe", FullName = "Jane Doe", Email = "janedoe@mail.com", Password = "password" };

            // Act
            var result = await _controller.PutUser(user.UserId, updatedUser);

            // Assert
            var badRequestResult =  Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal(StatusCodes.Status400BadRequest, badRequestResult.StatusCode);
            Assert.Equal("Unmatched Id", badRequestResult.Value);

            var userInDb = await _context.Users.FindAsync(user.UserId);
            Assert.Equal("johndoe", userInDb.UserName);
            Assert.Equal("John Doe", userInDb.FullName);
            Assert.Equal("johndoe@mail.com", userInDb.Email);
            Dispose();
        }
        [Fact]
        public async Task PostUser_ReturnsConflictError_WhenEmailAlreadyExists()
        {
            // Arrange
            
            var user = new User
            {
                UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password"
            };
            var role = new Role
            {
                RoleName = "user"
            };
            _context.Roles.Add(role);
            _context.SaveChanges();
            user.Roles.Add(role);
            _context.Users.Add(user);
            _context.SaveChanges();

            // Act
            var result = await _controller.PostUser(new User
            {
                UserName = "janedoe", FullName = "Jane Doe", Email = "johndoe@mail.com", Password = "newpassword"
            });

            // Assert
            Assert.IsType<ConflictObjectResult>(result.Result);
            Dispose();  
        }
        [Fact]
        public async Task PostUser_ReturnsConflictError_WhenUsernameAlreadyExists()
        {
            // Arrange
            
            var user = new User
            {
                UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password"
            };
            var role = new Role
            {
                RoleName = "user"
            };
            _context.Roles.Add(role);
            _context.SaveChanges();
            user.Roles.Add(role);
            _context.Users.Add(user);
            _context.SaveChanges();

            // Act
            var result = await _controller.PostUser(new User
            {
                UserName = "johndoe", FullName = "Jane Doe", Email = "johndoe@mail.com", Password = "newpassword"
            });

            // Assert
            Assert.IsType<ConflictObjectResult>(result.Result);
            Dispose();
        }
        [Fact]
        public async Task PutUser_WithNonExistingId_ReturnsNotFound()
        {
            // Arrange

            var updatedUser = new User
            {
                UserId = 100,
                UserName = "janedoe",
                FullName = "Jane Doe",
                Email = "janedoe@mail.com",
                Password = "password"
            };

            // Act
            var result = await _controller.PutUser(updatedUser.UserId, updatedUser);

            // Assert
            var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
            Assert.Equal(StatusCodes.Status404NotFound, notFoundResult.StatusCode);
            Assert.Equal("User Not Found", notFoundResult.Value);
            Dispose();
        }
        [Fact]
        public async Task DeleteUser_ReturnsNoContentResult()
        {
            // Arrange
            var user = new User { UserName = "johndoe", FullName = "John Doe", Email = "johndoe@mail.com", Password = "password" };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Act
            var result = await _controller.DeleteUser(user.UserId);
            // Assert
            Assert.IsType<NoContentResult>(result);
            Dispose();
        }
    }

}
