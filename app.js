const { Socket } = require("socket.io");
const cors = require("cors");
const app = require("express")();
require("dotenv").config();
const port = process.env.PORT || 8001;
app.use(cors());
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});
app.get("/", (req, res) => {
  res.json({ data: "ferf" });
});
io.on("connection", (socket) => {
  socket.on("joinRoom", (data) => {
    socket.join(data.room);
    socket.broadcast.emit("informOFJoin", data);
  });
  socket.on("sendMessage", (data) => {
    console.log(data);
    io.to(data.room).emit("recieveMsg", data);
  });

  socket.on("disconnect", () => {
    console.log("some one left");
  });
});
server.listen(port, () => {
  console.log(`running at ${port}`);
});
