const { Server } = require("socket.io");
let io;

function initSocket(server) {
  io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", socket => {
    console.log("Socket connected:", socket.id);

    socket.on("register", userId => {
      socket.join(userId); // Create user-specific room
    });
  });
}

module.exports = { initSocket, io };
