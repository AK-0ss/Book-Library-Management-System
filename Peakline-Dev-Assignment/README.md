# Book Library Management System - Intern Assignment

## Overview
This is a simple Book Library Management System built with React (Vite) for the frontend and Express.js for the backend. The application allows users to manage a collection of books.

## Features
- View all books in the library
- Search books by title or author
- Add new books
- Edit existing books
- Delete books
- Toggle book availability status

## Tech Stack
- **Frontend**: React 18 with Vite
- **Backend**: Node.js with Express
- **Data Storage**: JSON file (no database required)

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone/Download this repository

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the backend server (runs on port 5000):
```bash
cd backend
npm start
```

2. In a new terminal, start the frontend (runs on port 3000):
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/books | Get all books (with optional search & pagination) |
| GET | /api/books/:id | Get a single book by ID |
| POST | /api/books | Create a new book |
| PUT | /api/books/:id | Update a book |
| DELETE | /api/books/:id | Delete a book |
| PATCH | /api/books/:id/toggle-availability | Toggle book availability |

## Assignment Tasks

### Your Task
This application has several bugs that need to be identified and fixed. Your goal is to:

1. **Run the application** and test all features
2. **Identify the bugs** - there are multiple bugs across both frontend and backend
3. **Fix the bugs** - make the necessary code changes
4. **Document your findings** - for each bug:
   - Describe what the bug is
   - Explain what the expected behavior should be
   - Show the code change you made to fix it

### Testing Guidelines
- Try adding new books
- Try searching for books
- Try toggling availability
- Check if the statistics display correctly
- Test the edit functionality
- Look at both the UI behavior and network requests

### Submission
Please submit:
1. The fixed code (as a zip or git repository)
2. A document explaining each bug you found and how you fixed it

### Time Limit
You have **2 days** to complete this assignment.

### Evaluation Criteria
- Bug identification skills
- Problem-solving approach
- Code quality of fixes
- Clear documentation of findings

---

## Bonus Challenge (Optional)

If you complete the bug fixes early and want to showcase additional skills, consider implementing **one** of the following features:

### Option A: Genre Filter Dropdown
Add a dropdown filter that allows users to filter books by genre. The filter should:
- Show all unique genres from the book list
- Include an "All Genres" option
- Work alongside the existing search functionality

### Option B: Sort Functionality  
Add the ability to sort books by different criteria:
- Sort by title (A-Z, Z-A)
- Sort by year (newest first, oldest first)
- Sort by availability status

### Option C: Reading List / Favorites
Add a "Add to Reading List" feature:
- Users can mark books they want to read
- Show a separate section or tab for the reading list
- Persist the reading list in localStorage

### Option D: Book Details Modal
Create a modal popup when clicking on a book card that shows:
- Full book details
- Larger view with better formatting
- Edit/Delete actions within the modal

### Bonus Evaluation Criteria
- Clean, maintainable code
- Consistent styling with existing UI
- Good UX (loading states, error handling)
- No new bugs introduced!

---

Good luck! 🚀

