import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/cruddb';

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Todo Schema and Model
const todoSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  // _id: { type: String, unique: true },
  title: { type: String, required: true },
  completed: { type: Boolean, default: false }
}, { timestamps: true });

const Todo = mongoose.model('Todo', todoSchema);

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// CREATE - Add new todo
app.post('/api/todos', async (req: Request, res: Response) => {
  try {
    const { userId, title, completed } = req.body;
    const todo = new Todo({ userId, title, completed });
    await todo.save();
    res.status(201).json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create todo', details: error });
  }
});

// READ - Get all todos
app.get('/api/todos', async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todos', details: error });
  }
});

// READ - Get single todo by id field
app.get('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    // Look up by custom numeric id field
    const todo = await Todo.findOne({ _id: req.params.id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch todo', details: error });
  }
});

// UPDATE - Update todo by id field
app.put('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const { userId, id, title, completed } = req.body;
    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id },
      { userId, title, completed },
      { new: true, runValidators: true }
    );
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json(todo);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update todo', details: error });
  }
});

// DELETE - Delete todo by id field
app.delete('/api/todos/:id', async (req: Request, res: Response) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id });
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    res.json({ message: 'Todo deleted successfully', todo });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete todo', details: error });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});