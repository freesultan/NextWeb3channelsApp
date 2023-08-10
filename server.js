const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
server.listen(3030, () => {
  console.log("listening on *:3030");
});

const messages = [];

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("get messages", () => {
    console.log("messages broadcasted");
    io.emit("get messages", messages);
  });

  socket.on("new message", (msg) => {
    messages.push(msg);
    console.log("a message was sent");

    io.emit("new message", messages);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
  });
});
