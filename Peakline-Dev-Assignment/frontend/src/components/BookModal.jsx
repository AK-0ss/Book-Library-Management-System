function BookModal({ book, onClose, onEdit, onDelete, onToggleAvailability }) {
  if (!book) return null;

  const publisherText =
    typeof book.publisher === 'object' && book.publisher !== null
      ? `${book.publisher.name}${book.publisher.location ? `, ${book.publisher.location}` : ''}`
      : book.publisher || 'Unknown';

  const handleEditClick = () => {
    onEdit(book);
    onClose();
  };

  const handleToggleClick = () => {
    onToggleAvailability(book.id);
    onClose();
  };

  const handleDeleteClick = () => {
    onDelete(book.id);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          &times;
        </button>
        <h2>{book.title}</h2>
        <p className="modal-author">by {book.author}</p>

        <div className="modal-meta">
          <span className="genre">{book.genre}</span>
          <span className="year">{book.year}</span>
          <span className={`availability ${book.available ? 'available' : 'unavailable'}`}>
            {book.available ? 'Available' : 'Borrowed'}
          </span>
        </div>

        <p className="modal-publisher">
          <strong>Publisher:</strong> {publisherText}
        </p>

        {book.description && (
          <p className="modal-description">{book.description}</p>
        )}

        <div className="modal-actions">
          <button className="btn-edit" onClick={handleEditClick}>
            Edit
          </button>
          <button className="btn-toggle" onClick={handleToggleClick}>
            Toggle Status
          </button>
          <button className="btn-delete" onClick={handleDeleteClick}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default BookModal;
