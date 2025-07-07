const ToDo = require("../models/ToDo");

async function ToDoAgent(userId, info) {
  const { task, due } = info;
  console.log(info);
  console.log(info.time );
  
  

  await ToDo.create({ userId, task, due:info.time });
  return `📝 To-do added: "${task}" for ${time || "anytime"}`;
}

module.exports = { ToDoAgent };
