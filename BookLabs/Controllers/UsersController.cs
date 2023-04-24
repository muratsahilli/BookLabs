using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using BookLabs.Models;

namespace BookLabs.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly BookBaseContext _context;

        public UsersController(BookBaseContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetUsers()
        {
            if (_context.Users == null)
            {
                return NotFound();
            }

            return await _context.Users.Include(r => r.Roles).ToListAsync();
        }

        [HttpGet]
        [Route("counter")]
        public int GetUsersCount()
        {
            return _context.Users.Count();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var user = await _context.Users.Include(r => r.Roles).FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            return user;
        }


        [HttpPost]
        [Route("register")]
        public async Task<ActionResult<User>> PostUser(User user)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'BookBaseContext.Users'  is null.");
            }
            if (await _context.Users.AnyAsync(u => u.UserName == user.UserName))
            {
                return Conflict($"Username '{user.UserName}' already exists.");
            }

            if (await _context.Users.AnyAsync(u => u.Email == user.Email))
            {
                return Conflict($"Email '{user.Email}' already exists.");
            }
            var role = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName == "user");
            user.Roles.Add(role);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetUser", new { id = user.UserId }, user);
        }

        [HttpPost]
        [Route("login")]
        public async Task<ActionResult<User>> Login(User user)
        {
            if (_context.Users == null)
            {
                return Problem("Entity set 'BookBaseContext.Users'  is null.");
            }
            var currentUser = await _context.Users.Include(r => r.Roles).FirstOrDefaultAsync(u => u.UserName == user.UserName && u.Password == user.Password);
            if (currentUser == null)
            {
                return BadRequest("Wrong email or password");
            }
            return currentUser;
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id,User user)
        {
            if (id != user.UserId)
            {
                return BadRequest("Unmatched Id");
            }
            var userToUpdate = await _context.Users.FindAsync(id);

            if (userToUpdate == null)
            {
                return NotFound("User Not Found");
            }

            if (user.UserName != null)
            {
                userToUpdate.UserName = user.UserName;
            }

            if (user.FullName != null)
            {
                userToUpdate.FullName = user.FullName;
            }

            if (user.Email != null)
            {
                userToUpdate.Email = user.Email;
            }
            _context.Entry(userToUpdate).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        
        [HttpPut("role/{id}")]
        public async Task<ActionResult<User>> PutUser(int id)
        {
            User? user = await _context.Users
            .Include(r => r.Roles)
            .FirstOrDefaultAsync(u => u.UserId == id);

            if (user == null)
            {
                return NotFound();
            }

            //await _context.Entry(user).Collection(u => u.Roles).LoadAsync();

            if (user.Roles != null && user.Roles.Any())
            {
                var currentRole = user.Roles.FirstOrDefault();
                if (currentRole != null)
                {
                    user.Roles.Remove(currentRole);

                    Role? newRole = await _context.Roles.FirstOrDefaultAsync(r => r.RoleName != currentRole.RoleName);
                    if (newRole != null)
                    {
                        user.Roles.Add(newRole);
                    }
                }
            }
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            if (_context.Users == null)
            {
                return NotFound();
            }
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return (_context.Users?.Any(e => e.UserId == id)).GetValueOrDefault();
        }
    }
}
