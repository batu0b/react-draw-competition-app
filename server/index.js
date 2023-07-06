const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

//server things
const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["POST", "GET"],
  },
});

// rooms
const rooms = {};

//io listeners
io.on("connection", (socket) => {
  //room
  socket.on("create-room", async ({ room, userName }) => {
    if (!rooms[room]) {
      await socket.join(room);
      rooms[room] = {
        admin: socket.id,
        users: {
          [socket.id]: {
            ready: false,
            userName: userName,
          },
        },
        draws: [],
        topics: [],
        votes: [],
      };
      socket.emit("create-room", true);
    }
  });
  socket.on("join-room", async ({ room, userName }) => {
    if (rooms[room]) {
      await socket.join(room);
      socket.emit("join-room", true);
      rooms[room].users[socket.id] = {
        ready: false,
        userName: userName,
      };
    } else {
      socket.emit("join-room", false);
    }
  });
  socket.on("get-room", ({ room }) => {
    if (rooms[room]) {
      io.to(room).emit("get-room", { ...rooms[room] });
    } else {
      io.to(socket.id).emit("room-err", false);
    }
  });

  //actions
  socket.on("get-ready", ({ room, ready }) => {
    debugger;
    if (rooms[room]) {
      rooms[room].users[socket.id].ready = ready;

      io.to(room).emit("get-room", { ...rooms[room] });
    }
  });
  socket.on("send-draws", ({ room, draw }) => {
    rooms[room].draws.push({ src: draw, whoIs: socket.id });
    io.to(room).emit("get-draw", [...rooms[room].draws]);
  });
  socket.on("send-topic", ({ topic, room }) => {
    rooms[room].topics.push({ topic: topic });
    let randomIndex = Math.floor(Math.random() * rooms[room].topics.length);
    io.to(room).emit("get-random-topic", rooms[room].topics[randomIndex]);
  });
  socket.on("rate-draws", async ({ room, draw }) => {
    if (rooms[room]) {
      rooms[room].votes.push(draw);
      if (rooms[room].votes.length === Object.keys(rooms[room].users).length) {
        const sumByKeys = {};
        rooms[room].votes.forEach((obj) => {
          Object.keys(obj).forEach((key) => {
            if (!sumByKeys[key]) {
              sumByKeys[key] = 0;
            }

            sumByKeys[key] += obj[key];
          });
        });

        let winner;
        let maxSum = -Infinity;
        let isEqual = true;
        Object.keys(sumByKeys).forEach((key) => {
          const sum = sumByKeys[key];

          if (sum > maxSum) {
            maxSum = sum;
            winner = key;
            isEqual = false;
          } else if (sum === maxSum) {
            isEqual = true;
          }
        });
        if (isEqual) {
          const keys = Object.keys(sumByKeys);
          const randomIndex = Math.floor(Math.random() * keys.length);
          winner = keys[randomIndex];
        }
        io.to(room).emit("get-winner", rooms[room].users[winner].userName);
        io.to(room).emit("close-page", true);
        rooms[room].votes = [];
        rooms[room].draws = [];
        rooms[room].topics = [];
      }
    }
  });

  socket.on("disconnect-room", (room) => {
    if (rooms[room]) {
      delete rooms[room].users[socket.id];
      socket.leave(room);
      io.to(room).emit("get-room", { ...rooms[room] });
      if (Object.keys(rooms[room].users).length === 0) {
        delete rooms[room];
      }
    }
  });
  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

server.listen(3000, () => {
  console.log(`Server started on 3000 port`);
});
