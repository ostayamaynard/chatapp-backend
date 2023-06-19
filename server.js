const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

// Enable CORS
app.use(cors());

app.get('/', (req, res) => res.send('hello!'));

const chatHistory = []; // Store chat history

io.on('connection', (socket) => {
  console.log('a user connected');

  // Send chat history to the newly connected socket
  socket.emit('chat-history', chatHistory);

  socket.on('message', (message) => {
    console.log(message);
    const sender = 'Sender'; // Replace with the actual sender's name or unique identifier
  
    // Broadcast the message to all connected sockets except the sender
    socket.broadcast.emit('message-broadcast', `${sender}: ${message}`);
  
    // Update chat history
    chatHistory.push(`${sender}: ${message}`);
  });
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});