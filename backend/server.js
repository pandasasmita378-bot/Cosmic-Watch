require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http'); 
const { Server } = require('socket.io'); 

const Message = require('./models/Message'); 

const authRoutes = require('./routes/authRoutes');
const asteroidRoutes = require('./routes/asteroidRoutes');
const chatRoutes = require('./routes/chatRoutes'); 

const app = express();
const server = http.createServer(app); 

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const io = new Server(server, {
  cors: {
    origin: CLIENT_ORIGIN, 
    methods: ["GET", "POST"]
  }
});

app.use(cors({ origin: CLIENT_ORIGIN, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/asteroids', asteroidRoutes);
app.use('/api/chat', chatRoutes); 

io.on('connection', (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (room) => {
    socket.join(room); 
    console.log(`User ${socket.id} joined room: ${room}`);
  });

  socket.on("send_message", async (data) => {
    try {
        const newMessage = new Message({
            room: data.room,
            author: data.author,
            message: data.message,
            time: data.time
        });
        await newMessage.save();
        console.log(`Message saved to ${data.room}`);
    } catch (err) {
        console.error("Error saving message:", err);
    }

    socket.to(data.room).emit("receive_message", data);
  });

  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id);
  });
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB Connected Successfully 🚀'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT} 🛸`));