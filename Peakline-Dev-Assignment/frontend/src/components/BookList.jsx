function BookList({
  books,
  loading,
  onEdit,
  onDelete,
  onToggleAvailability,
  onToggleReadingList,
  readingListIds = [],
  onSelectBook,
}) {
  if (loading) {
    return (
      <div className="book-list">
        <h2>Books</h2>
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="book-list">
        <h2>Books</h2>
        <div className="no-books">
          No books found. Add your first book!
        </div>
      </div>
    );
  }

  return (
    <div className="book-list">
      <h2>Books ({books.length})</h2>
      <div className="books-container">
        {books.map((book, index) => {
          const isInReadingList = readingListIds.includes(book.id);

          const handleCardClick = () => {
            if (onSelectBook) {
              onSelectBook(book);
            }
          };

          const handleEditClick = (e) => {
            e.stopPropagation();
            onEdit(book);
          };

          const handleToggleAvailabilityClick = (e) => {
            e.stopPropagation();
            onToggleAvailability(book.id);
          };

          const handleDeleteClick = (e) => {
            e.stopPropagation();
            onDelete(book.id);
          };

          const handleReadingListClick = (e) => {
            e.stopPropagation();
            if (onToggleReadingList) {
              onToggleReadingList(book.id);
            }
          };

          return (
            <div
              key={index}
              className="book-card"
              onClick={handleCardClick}
            >
              <h3>{book.title}</h3>
            <p>by {book.author}</p>
            <p className="publisher">
              Publisher: {typeof book.publisher === 'object' && book.publisher !== null
                ? `${book.publisher.name}${book.publisher.location ? `, ${book.publisher.location}` : ''}`
                : book.publisher}
            </p>
            <div className="book-meta">
              <span className="genre">{book.genre}</span>
              <span className="year">{book.year}</span>
              <span className={`availability ${book.available ? 'available' : 'unavailable'}`}>
                {book.available ? 'Available' : 'Borrowed'}
              </span>
            </div>
            <div className="book-actions">
              <button 
                className="btn-edit"
                onClick={handleEditClick}
              >
                Edit
              </button>
              <button 
                className="btn-toggle"
                onClick={handleToggleAvailabilityClick}
              >
                Toggle Status
              </button>
              <button 
                className="btn-delete"
                onClick={handleDeleteClick}
              >
                Delete
              </button>
              {onToggleReadingList && (
                <button
                  className={`btn-reading-list ${isInReadingList ? 'in-list' : ''}`}
                  onClick={handleReadingListClick}
                >
                  {isInReadingList ? 'Remove from Reading List' : 'Add to Reading List'}
                </button>
              )}
            </div>
          </div>
        );
        })}
      </div>
    </div>
  );
}

export default BookList;

