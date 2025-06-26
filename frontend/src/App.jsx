import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ title: '', author: '' });

  const fetchBooks = async () => {
    const res = await axios.get('/books');
    setBooks(res.data);
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAdd = async () => {
    if (!form.title || !form.author) return;
    await axios.post('/books', form);
    setForm({ title: '', author: '' });
    fetchBooks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/books/${id}`);
    fetchBooks();
  };

  const handleUpdate = async (id, updatedBook) => {
    await axios.put(`/books/${id}`, updatedBook);
    fetchBooks();
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Book Tracker</h1>
      <div style={{ marginBottom: '1rem' }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={e => setForm({ ...form, author: e.target.value })}
        />
        <button onClick={handleAdd}>Add Book</button>
      </div>
      <ul>
        {books.map(book => (
          <li key={book._id}>
            <strong>{book.title}</strong> by {book.author}
            <button onClick={() => handleDelete(book._id)} style={{ marginLeft: '1rem' }}>Delete</button>
            <button onClick={() => {
              const newTitle = prompt('Update title:', book.title);
              const newAuthor = prompt('Update author:', book.author);
              if (newTitle && newAuthor) {
                handleUpdate(book._id, { title: newTitle, author: newAuthor });
              }
            }} style={{ marginLeft: '0.5rem' }}>Update</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
