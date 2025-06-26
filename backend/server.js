import express, { json } from 'express';
import { connect, Schema, model } from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(json());

// MongoDB connection
connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Book Schema
const bookSchema = new Schema({
  title: String,
  author: String,
});
const Book = model('Book', bookSchema);

// Routes
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

app.post('/books', async (req, res) => {
  const { title, author } = req.body;
  const book = new Book({ title, author });
  await book.save();
  res.status(201).json(book);
});

app.delete('/books/:id', async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.put('/books/:id', async (req, res) => {
  const { title, author } = req.body; 
  const book = await Book.findByIdAndUpdate(req.params.id, { title, author }, { new: true });
  res.json(book);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
