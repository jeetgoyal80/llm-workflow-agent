const Todo = require("../models/ToDo")
const fetchtodo = async (req, res) => {
  const todos = await Todo.find({ userId: req.user.id }).sort({ due: 1 });
  res.json({ todos });
}
const Posttodo = async (req, res) => {
  const { task, due } = req.body;
  if (!task) return res.status(400).json({ message: "Task is required." });

  const newTodo = await Todo.create({
    userId: req.user.id,
    task,
    due: due ? new Date(due) : null
  });

  res.status(201).json({ todo: newTodo });
}
const Edittodo = async (req, res) => {
  const todo = await Todo.findOne({ _id: req.params.id, userId: req.user.id });
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  todo.done = !todo.done;
  await todo.save();
  res.json({ message: "Toggled", todo });
}
const Deletetodo = async (req, res) => {
  const todo = await Todo.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!todo) return res.status(404).json({ message: "Todo not found" });

  res.json({ message: "Deleted" });
}
module.exports = {fetchtodo,Edittodo,Deletetodo,Posttodo}