using System;
using System.Collections.Generic;

namespace BookLabs.Models;

public partial class Author
{
    public int AuthorId { get; set; }

    public string? AuthorName { get; set; }

    public DateTime? BirthDate{ get; set; }

    public virtual ICollection<Book> Books { get; } = new List<Book>();
}
