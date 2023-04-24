using System;
using System.Collections.Generic;
using BookLabs.Models;

namespace BookLabs.Models;

public partial class Book
{
    public int BookId { get; set; }

    public string Title { get; set; } = null!;

    public int? TotalPages { get; set; }

    public DateTime? PublishedDate { get; set; }

    public virtual ICollection<Author> Authors { get; } = new List<Author>();
}
