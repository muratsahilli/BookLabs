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
    public class BooksController : ControllerBase
    {
        private readonly BookBaseContext _context;

        public BooksController(BookBaseContext context)
        {
            _context = context;
        }

        // GET: api/Books
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
        {
          if (_context.Books == null)
          {
              return NotFound();
          }
            return await _context.Books.Include(a=>a.Authors).ToListAsync();
        }
        
        [HttpGet]
        [Route("counter")]
        public int GetBooksCount()
        {
            return _context.Books.Count(); 
        }

        // GET: api/Books/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
          if (_context.Books == null)
          {
              return NotFound();
          }
            var book = await _context.Books.Include(r => r.Authors).FirstOrDefaultAsync(u => u.BookId== id);

            if (book == null)
            {
                return NotFound();
            }

            return book;
        }

        // PUT: api/Books/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutBook(int id, [FromBody] Book book, [FromQuery(Name = "mylist")] int[] mylist)
        {
            if (id != book.BookId)
            {
                return BadRequest();
            }
            if (book == null)
            {
                return NotFound();
            }

            var bookFromDb = await _context.Books.Include(x => x.Authors).FirstOrDefaultAsync(i => i.BookId == id);
            if (bookFromDb == null)
            {
                return NotFound();
            }
            bookFromDb.Authors.Clear(); // remove all authors from the book
            foreach (var authorId in mylist)
            {
                var author = await _context.Authors.FindAsync(authorId);
                bookFromDb.Authors.Add(author); // add new authors to the book
            }
            _context.Entry(bookFromDb).CurrentValues.SetValues(book);

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!BookExists(id))
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

        // POST: api/Books
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Book>> PostBook(Book book, [FromQuery(Name = "mylist")] int[] mylist)
        {
          if (_context.Books == null)
          {
              return Problem("Entity set 'BookBaseContext.Books'  is null.");
          }
        if (book == null)
          {
              return BadRequest("Book object cannot be null");
          }
            foreach (var item in mylist)
            {
                Author? author = _context.Authors.FirstOrDefault(i => i.AuthorId == item);
                book.Authors.Add(author);
            }
            _context.Books.Add(book);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetBook", new { id = book.BookId }, book);
        }

        // DELETE: api/Books/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            if (_context.Books == null)
            {
                return NotFound();
            }
            var book = await _context.Books.FindAsync(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool BookExists(int id)
        {
            return (_context.Books?.Any(e => e.BookId == id)).GetValueOrDefault();
        }
    }
}
