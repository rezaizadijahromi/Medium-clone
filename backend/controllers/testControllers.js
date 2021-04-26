import Article from "../models/articleModel.js";
import User from "../models/usersModel.js";
import asyncHandler from "express-async-handler";

const testPost = asyncHandler(async (req, res) => {
  const { name, family } = req.body;
  const data = {
    name,
    family,
  };

  res.json(data);
  console.log(data);
  const socketio = req.app.get("socketio");
  socketio.on("connect", (socket) => {
    socket.emit("message", res.json(data));
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
