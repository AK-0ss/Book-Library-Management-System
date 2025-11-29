import { useState, useEffect } from 'react';
import BookList from './components/BookList';
import BookForm from './components/BookForm';
import SearchBar from './components/SearchBar';
import BookModal from './components/BookModal';

function App() {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, available: 0 });
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [sortOption, setSortOption] = useState('title-asc');
  const [readingListIds, setReadingListIds] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'reading'
  const [selectedBook, setSelectedBook] = useState(null);

  const fetchBooks = async (search = '') => {
    try {
      setLoading(true);
      const url = search 
        ? `/api/books?search=${encodeURIComponent(search)}`
        : '/api/books';
      
      const response = await fetch(url);
      const data = await response.json();

      const booksArray = Array.isArray(data?.books) ? data.books : [];

      if (!search) {
        setAllBooks(booksArray);
      }

      setBooks(booksArray);
      updateStats(booksArray);
      setError(null);
    } catch (err) {
      setError('Failed to load books. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const updateStats = (booksList = []) => {
    const available = booksList.filter(book => book.available === true);
    setStats({
      total: booksList.length,
      available: available.length
    });
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('readingList');
      if (stored) {
        setReadingListIds(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load reading list from localStorage', e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('readingList', JSON.stringify(readingListIds));
    } catch (e) {
      console.error('Failed to save reading list to localStorage', e);
    }
  }, [readingListIds]);

  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchBooks(term);
  };

  const handleGenreChange = (genre) => {
    setSelectedGenre(genre);
  };

  const handleSortChange = (option) => {
    setSortOption(option);
  };

  const handleAddBook = async (bookData) => {
    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.status === 201) {
        fetchBooks(searchTerm);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to add book');
      return false;
    }
  };

  const handleUpdateBook = async (id, bookData) => {
    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookData),
      });

      if (response.ok) {
        setEditingBook(null);
        fetchBooks(searchTerm);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update book');
      return false;
    }
  };

  const handleDeleteBook = async (id) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchBooks(searchTerm);
      }
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const response = await fetch(`/api/books/${id}/toggle-availability`, {
        method: 'PATCH',
      });

      if (response.ok) {
        fetchBooks(searchTerm);
      }
    } catch (err) {
      setError('Failed to toggle availability');
    }
  };

  const handleEdit = (book) => {
    setEditingBook(book);
  };
  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  const handleToggleReadingList = (id) => {
    setReadingListIds((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  const handleSelectBook = (book) => {
    setSelectedBook(book);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
  };

  const genreSource = allBooks.length > 0 ? allBooks : books;
  const genres = ['All Genres', ...Array.from(new Set(
    genreSource
      .map((book) => book.genre || 'Uncategorized')
      .filter(Boolean)
  ))];

  let visibleBooks = books;

  if (selectedGenre && selectedGenre !== 'All Genres') {
    visibleBooks = visibleBooks.filter((book) => (book.genre || 'Uncategorized') === selectedGenre);
  }

  if (activeTab === 'reading') {
    visibleBooks = visibleBooks.filter((book) => readingListIds.includes(book.id));
  }

  const sortedBooks = [...visibleBooks].sort((a, b) => {
    switch (sortOption) {
      case 'title-asc':
        return a.title.localeCompare(b.title);
      case 'title-desc':
        return b.title.localeCompare(a.title);
      case 'year-desc':
        return (b.year || 0) - (a.year || 0);
      case 'year-asc':
        return (a.year || 0) - (b.year || 0);
      case 'availability':
        if (a.available === b.available) return a.title.localeCompare(b.title);
        return a.available ? -1 : 1;
      default:
        return 0;
    }
  });

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Book Library</h1>
        <p>Manage your book collection with ease</p>
        <div className="stats">
          <div className="stat-item">
            <div className="stat-number">{stats.total}</div>
            <div className="stat-label">Total Books</div>
          </div>
          <div className="stat-item">
            <div className="stat-number">{stats.available}</div>
            <div className="stat-label">Available</div>
          </div>
        </div>
      </header>

      {error && <div className="error">{error}</div>}

      <div className="main-content">
        <div className="left-section">
          <SearchBar
            onSearch={handleSearch}
            genres={genres}
            selectedGenre={selectedGenre}
            onGenreChange={handleGenreChange}
            sortOption={sortOption}
            onSortChange={handleSortChange}
          />

          <div className="tabs">
            <button
              className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              All Books
            </button>
            <button
              className={`tab-button ${activeTab === 'reading' ? 'active' : ''}`}
              onClick={() => setActiveTab('reading')}
            >
              Reading List ({readingListIds.length})
            </button>
          </div>

          <BookList
            books={sortedBooks}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDeleteBook}
            onToggleAvailability={handleToggleAvailability}
            onToggleReadingList={handleToggleReadingList}
            readingListIds={readingListIds}
            onSelectBook={handleSelectBook}
          />
        </div>

        <div className="right-section">
          <BookForm
            book={editingBook}
            onSubmit={editingBook ? handleUpdateBook : handleAddBook}
            onCancel={handleCancelEdit}
          />
        </div>
      </div>

      <BookModal
        book={selectedBook}
        onClose={handleCloseModal}
        onEdit={handleEdit}
        onDelete={handleDeleteBook}
        onToggleAvailability={handleToggleAvailability}
      />
    </div>
  );
}

export default App;

