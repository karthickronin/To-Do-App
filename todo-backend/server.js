const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

const PORT = 5000;

// Connecting to MongoDB
mongoose
  .connect("mongodb+srv://karthick:777@cluster0.hfewo.mongodb.net/to-do-app?retryWrites=true&w=majority", {
    serverApi: {
      version: '1',  // Stable API version
      strict: true,
      deprecationErrors: true,
    },
  })
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log("Connection error: ", err.message);
  });

// Creating Schema
const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// Creating Model
const Todo = mongoose.model("Todo", todoSchema);

// Create a new Todo
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }
  try {
    const newTodo = new Todo({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Retrieve all Todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Update a Todo by ID
app.put("/todos/:id", async (req, res) => {
  const { title, description } = req.body;
  const id = req.params.id;
  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required." });
  }

  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { title, description },
      { new: true, runValidators: true }  // new:true to return updated document
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete a Todo by ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(204).end();  // Successful deletion, no content to return
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Hello to my World");
});

// Starting the server
app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
