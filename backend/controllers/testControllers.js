import Article from "../models/articleModel.js";
import User from "../models/usersModel.js";
import asyncHandler from "express-async-handler";

import { addUser, removeUser, getUser, getUsersInRoom } from "../users.js";

const testPost = asyncHandler(async (req, res) => {
  const socketio = req.app.get("socketio");

  socketio.on("connection", (socket) => {
    socket.on("join", ({ name, room }, callback) => {
      const { error, user } = addUser({ id: socket.id, name, room });

      if (error) return callback(error);

      socket.join(user.room);

      socket.emit("message", {
        user: "admin",
        text: `${user.name}, welcome to room ${user.room}.`,
      });
      socket.broadcast
        .to(user.room)
        .emit("message", { user: "admin", text: `${user.name} has joined!` });

      socketio.to(user.room).emit("roomData", {
        room: user.room,
        users: getUsersInRoom(user.room),
      });

      callback();
    });

    socket.on("sendMessage", (message, callback) => {
      const user = getUser(socket.id);

      socketio
        .to(user.room)
        .emit("message", { user: user.name, text: message });

      callback();
    });

    socket.on("disconnect", () => {
      const user = removeUser(socket.id);

      if (user) {
        socketio.to(user.room).emit("message", {
          user: "Admin",
          text: `${user.name} has left.`,
        });
        socketio.to(user.room).emit("roomData", {
          room: user.room,
          users: getUsersInRoom(user.room),
        });
      }
    });
  });
});

const testSocket = asyncHandler(async (req, res) => {
  const socket = req.app.get("socketio");
  const test = req.body.test;
  socket.sockets.emit("join", console.log("reza"));
  res.json(test);
});

export { testPost, testSocket };

//   socketio.on("connect", (socket) => {
//     res.json(data);
//     socket.emit("message", res.json(data));
//   });
