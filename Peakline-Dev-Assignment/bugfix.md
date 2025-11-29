# Bug Fixes and Improvements

## Frontend Bug Fixes

### 1) React error: “Objects are not valid as a React child” (UI sometimes not visible)

**Issue:** Some books had `publisher` as an object (e.g. `{ name, location }`), but the component rendered `book.publisher` directly, causing React to throw "Objects are not valid as a React child" and sometimes break the UI.

**Fix (in `frontend/src/components/BookList.jsx`):**
- Safely render `publisher` as a formatted string when it is an object, and as-is when it is a string.

```jsx path=null start=null
// OLD
<p className="publisher">Publisher: {book.publisher}</p>

// NEW
<p className="publisher">
  Publisher: {typeof book.publisher === 'object' && book.publisher !== null
    ? `${book.publisher.name}${book.publisher.location ? `, ${book.publisher.location}` : ''}`
    : book.publisher}
</p>
```

**Result:**
- UI always renders without React child errors.
- Publisher is shown as `Name, Location` when stored as an object, or as the raw string otherwise.

---

### 2) Edit button not working (form not entering “Edit” mode)

**Issue:** `handleEdit` in `App.jsx` was asynchronous and re-fetched the book from the backend. If the fetch failed or types didn’t line up, `editingBook` was never set, so the form stayed in "Add New Book" mode.

**Fix (in `frontend/src/App.jsx`):**
- Simplified `handleEdit` to just use the existing `book` object and set `editingBook` directly.

```js path=null start=null
// OLD
const handleEdit = async (book) => {
  try {
    const response = await fetch(`/api/books/${book.id}`);
    if (response.ok) {
      const freshBook = await response.json();
      setEditingBook(freshBook);
    } else {
      setError('Failed to load book for editing');
    }
  } catch (err) {
    setError('Failed to load book for editing');
  }
};

// NEW
const handleEdit = (book) => {
  setEditingBook(book);
};
```

**Result:**
- Clicking **Edit** switches the form into **“Edit Book”** mode.
- Fields are pre-filled with the book’s data and the button shows **“Update Book”**.

---

## Backend Bug Fixes

### 3) Toggle availability route did not actually toggle

**Issue:** The `/api/books/:id/toggle-availability` route assigned `book.available = book.available`, so the value never changed even though the endpoint responded `200`.

**Fix (in `backend/routes/books.js`):**
- Actually toggle the boolean value and persist it.

```js path=null start=null
// OLD
router.patch('/:id/toggle-availability', (req, res) => {
  try {
    const books = readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // BUG: no-op
    book.available = book.available;
    writeBooks(books);

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle availability' });
  }
});

// NEW
router.patch('/:id/toggle-availability', (req, res) => {
  try {
    const books = readBooks();
    const book = books.find(b => b.id === parseInt(req.params.id));

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Proper toggle
    book.available = !book.available;
    writeBooks(books);

    res.json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle availability' });
  }
});
```

**Result:**
- Each click on **Toggle Status** flips `available` between `true` and `false`.
- Updated status is saved to `books.json` and reflected in the UI and header stats.

---

### 4) Search not working as expected (too strict AND filter)

**Issue:** The search used an **AND** condition on title and author, so a book was only returned if the term existed in both fields, which usually resulted in empty results.

**Fix (in `backend/routes/books.js`):**
- Relaxed the filter to match when the term is present in **either** title **or** author (case-insensitive).

```js path=null start=null
// OLD
if (search) {
  const searchLower = search.toLowerCase();
  books = books.filter(book => 
    book.title.toLowerCase().includes(searchLower) &&
    book.author.toLowerCase().includes(searchLower)
  );
}

// NEW
if (search) {
  const searchLower = search.toLowerCase();
  books = books.filter(book => 
    book.title.toLowerCase().includes(searchLower) ||
    book.author.toLowerCase().includes(searchLower)
  );
}
```

**Result:**
- Search now returns books where the term matches either the title or the author, e.g. `gatsby` → “The Great Gatsby”, `harper` → “To Kill a Mockingbird” (author Harper Lee).

---

## Planned Improvements

The following are proposed improvements to enhance usability and discoverability in the Book Library UI:

1. **Genre Filter Dropdown**  
   - Add a dropdown to filter books by genre (e.g. Fiction, Non-fiction, Mystery, Sci-Fi).  
   - Allow combining with text search so users can search within a specific genre.

2. **Sort Functionality**  
   - Provide sort controls (e.g. by Title A–Z/Z–A, Author A–Z/Z–A, Availability, Added Date).  
   - Default sort by title, with clear indication of current sort state.

3. **Reading List / Favorites**  
   - Allow users to mark books as "Favorite" or "Add to Reading List" with a toggle/star icon.  
   - Provide a dedicated view or filter to show only favorites/reading list items.

4. **Book Details Modal**  
   - When a book card/row is clicked, open a modal with full details (description, publisher, year, genre, availability, etc.).  
   - Include actions inside the modal, such as **Edit**, **Toggle Availability**, and **Add to Reading List**.
