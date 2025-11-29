const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();
const dataPath = path.join(__dirname, '../data/books.json');

// Helper function to read books from JSON file
const readBooks = () => {
  const data = fs.readFileSync(dataPath, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write books to JSON file
const writeBooks = (books) => {
  fs.writeFileSync(dataPath, JSON.stringify(books, null, 2));
};

// GET all books with optional search and pagination
router.get('/', (req, res) => {
  try {
    let books = readBooks();
    const { search, page = 1, limit = 10 } = req.query;

    // Filter by search term (searches in title and author)
    if (search) {
      const searchLower = search.toLowerCase();
      books = books.filter(book => 
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower)
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedBooks = books.slice(startIndex, endIndex);

    res.json({
      books: paginatedBooks,
      total: books.length,
      page: parseInt(page),
      totalPages: Math.ceil(books.length / limit)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch books' });
  }
});

// GET single book by ID
router.get('/:id', (req, res) => {
  try {
    const books = readBooks();
    const book = books.find(b => b.id === req.params.id);
    
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch book' });
  }
});

// POST create new book
router.post('/', (req, res) => {
  try {
    const books = readBooks();
    const { title, author, year, genre, available } = req.body;

    // Validation
    if (!title || !author) {
      return res.status(400).json({ error: 'Title and author are required' });
    }

    // Generate new ID
    const newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;

    const newBook = {
      id: newId,
      title,
      author,
      year: year || new Date().getFullYear(),
      genre: genre || 'Uncategorized',
      available: available !== undefined ? available : true
    };

    books.push(newBook);
    writeBooks(books);

    res.status(201).json(newBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create book' });
  }
});

// PUT update book
router.put('/:id', (req, res) => {
  try {
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const { title, author, year, genre, available } = req.body;

    // Update only provided fields
    if (title) books[bookIndex].title = title;
    if (author) books[bookIndex].author = author;
    if (year) books[bookIndex].year = year;
    if (genre) books[bookIndex].genre = genre;
    if (available !== undefined) books[bookIndex].available = available;

    writeBooks(books);
    res.json(books[bookIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update book' });
  }
});

// DELETE book
router.delete('/:id', (req, res) => {
  try {
    const books = readBooks();
    const bookIndex = books.findIndex(b => b.id === parseInt(req.params.id));

    if (bookIndex === -1) {
      return res.status(404).json({ error: 'Book not found' });
    }

    books.splice(bookIndex, 1);
    writeBooks(books);

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete book' });
  }
});

// PATCH toggle availability
router.patch('/:id/toggle-availability', (req, res) => {
  try {
    const books = readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    console.log('Toggling availability for id', req.params.id, 'before:', book.available);
    // Toggle availability boolean
    book.available = !book.available;
    console.log('After toggle, available =', book.available);
    writeBooks(books);

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle availability' });
  }
});

module.exports = router;

