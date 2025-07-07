import { useEffect, useState } from "react";
import axios from "../axios";
import { FaPlusCircle, FaCheckCircle, FaTrash } from "react-icons/fa";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [due, setDue] = useState("");

  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/todo");
      const sorted = res.data.todos.sort((a, b) =>
        new Date(a.due) - new Date(b.due)
      );
      setTodos(sorted);
    } catch (err) {
      console.error("❌ Failed to fetch todos", err);
    }
  };

  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post("/api/todo", {
        task: input,
        due: due || null,
      });
      setTodos((prev) => [...prev, res.data.todo]);
      setInput("");
      setDue("");
    } catch (err) {
      console.error("❌ Failed to add todo", err);
    }
  };

  const toggleDone = async (id) => {
    try {
      await axios.put(`/api/todo/${id}/toggle`);
      setTodos((prev) =>
        prev.map((t) =>
          t._id === id ? { ...t, done: !t.done } : t
        )
      );
    } catch (err) {
      console.error("❌ Toggle error", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todo/${id}`);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Delete error", err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white px-4 py-10 flex flex-col items-center">

      <h1 className="mt-12 text-3xl font-bold text-purple-400 mb-6">📋 Smart Todo Manager</h1>
 
      {/* Input + Date */}
      <div className="w-full max-w-xl flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter a task..."
          className="flex-1 px-4 py-2 bg-gray-800 rounded-full text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
        />
        <input
          type="datetime-local"
          className="px-4 py-2 bg-gray-800 rounded-full text-white focus:outline-none"
          value={due}
          onChange={(e) => setDue(e.target.value)}
        />
        <button
          onClick={addTodo}
          className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-full text-white shadow-lg transition hover:scale-105"
        >
          <FaPlusCircle />
        </button>
      </div>

      {/* Todos */}
      <div className="w-full max-w-xl bg-white/5 border border-white/10 rounded-lg shadow-lg divide-y divide-white/10">
        {todos.length === 0 ? (
          <p className="text-center py-6 text-gray-400">No todos yet</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/10 transition"
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => toggleDone(todo._id)}
                  className={`text-lg ${
                    todo.done ? "text-green-400" : "text-gray-500"
                  } hover:text-green-500`}
                >
                  <FaCheckCircle />
                </button>
                <div>
                  <p
                    className={`${
                      todo.done
                        ? "line-through text-gray-400"
                        : "text-white"
                    }`}
                  >
                    {todo.task}
                  </p>
                  {todo.due && (
                    <p className="text-sm text-gray-400">
                      Due: {new Date(todo.due).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="text-red-500 hover:text-red-600 text-sm"
              >
                <FaTrash />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Todos;
