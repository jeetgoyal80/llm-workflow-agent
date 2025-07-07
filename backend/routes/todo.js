const express = require("express");
const router = express.Router();
const auth = require("../middlewares/authmiddleware");
const { fetchtodo, Posttodo, Edittodo, Deletetodo } = require("../controllers/todo");

// 📌 GET all todos for the logged-in user
router.get("/", auth, fetchtodo);

// 📌 POST create new todo
router.post("/", auth,Posttodo );

// 📌 PUT toggle done status
router.put("/:id/toggle", auth, Edittodo);

// 📌 DELETE todo
router.delete("/:id", auth,Deletetodo );

module.exports = router;
