const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
const PORT = 5000;

// connnecting mongodb
mongoose
  .connect("mongodb+srv://karthimad7707:333@cluster0.hfewo.mongodb.net/mern-app?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

// creating Schema
const todoSchema = new mongoose.Schema({
  title: String,
  description: String,
});

//creating model
const todoModel = mongoose.model("Todo", todoSchema);

app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Title and description are required." });
  }
  try {
    const newTodo = new todoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.log(err);
    req.status(500);
  }
});

app.get("/todos", async (req, res) => {
  try {
    const todos = await todoModel.find();
    res.json(todos);
  } catch (error) {
    console.log(error.message);
    req.status(500);
  }
});

app.put("/todos/:id", async (req,res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id
    const updatedTodo = await todoModel.findByIdAndUpdate(
      id,
      { title, description },
      {new: true}
    )
    if (!updatedTodo) {
      return res.status(400).json({message:"todo not found"})
    }
    res.json(updatedTodo)
    
  } catch (error) {
    console.log(error.message);
    req.status(500);
  }
})

app.delete("/todos/:id",async (req,res)=>{
  try {
    const id = req.params.id
    await todoModel.findByIdAndDelete(id)
    res.status(204).end()
  } catch (error) {
    console.log(error.message);
    req.status(500);
  }
})

app.listen(PORT, () => {
  console.log("Server is running on Port", PORT);
});
