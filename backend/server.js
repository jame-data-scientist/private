const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' },
  maxHttpBufferSize: 5e6 // 5 MB max for images
});

// Serve frontend build files explicitly
const frontendPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendPath));
// In-memory data store
// groups: { [groupId: string]: { members: Set<string>, messages: Array<any> } }
const groups = {};

// We need a way to track which user is on which socket
// socket.id -> { username, groupId }
const users = {};

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join-group', ({ groupId, username }) => {
    // Validate 32-char group code
    if (!groupId || typeof groupId !== 'string' || groupId.length !== 32) {
      socket.emit('error', 'Invalid group code format. Must be 32 characters.');
      return;
    }

    if (!groups[groupId]) {
      groups[groupId] = {
        members: new Set(),
        messages: []
      };
    }

    // Join room
    socket.join(groupId);
    groups[groupId].members.add(username);
    
    // Store user session info
    users[socket.id] = { username, groupId };

    // Broadcast updated member list
    io.to(groupId).emit('update-members', Array.from(groups[groupId].members));

    // Send chat history to the newly joined user
    socket.emit('chat-history', groups[groupId].messages);

    // System message
    socket.to(groupId).emit('system-message', `${username} joined the chat.`);
    console.log(`${username} joined group ${groupId}`);
  });

  socket.on('send-message', (messageData) => {
    const user = users[socket.id];
    if (!user) return; // Not joined

    const { groupId } = user;
    if (groups[groupId]) {
      // messageData should contain { id, sender, timestamp, encryptedText, isImage, ... }
      const newMsg = {
        ...messageData,
        id: messageData.id || Date.now().toString(),
        timestamp: messageData.timestamp || Date.now(),
        edited: false
      };

      groups[groupId].messages.push(newMsg);
      // Broadcast to room
      io.to(groupId).emit('new-message', newMsg);
    }
  });

  socket.on('edit-message', ({ messageId, newEncryptedText }) => {
    const user = users[socket.id];
    if (!user) return;

    const { groupId, username } = user;
    if (groups[groupId]) {
      const msgIndex = groups[groupId].messages.findIndex(m => m.id === messageId);
      if (msgIndex !== -1 && groups[groupId].messages[msgIndex].sender === username) {
        groups[groupId].messages[msgIndex].encryptedText = newEncryptedText;
        groups[groupId].messages[msgIndex].edited = true;
        
        io.to(groupId).emit('message-edited', {
          messageId,
          newEncryptedText,
          edited: true
        });
      }
    }
  });

  socket.on('disconnect', () => {
    const user = users[socket.id];
    if (user) {
      const { groupId, username } = user;
      if (groups[groupId]) {
        groups[groupId].members.delete(username);
        io.to(groupId).emit('update-members', Array.from(groups[groupId].members));
        socket.to(groupId).emit('system-message', `${username} left the chat.`);
      }
      delete users[socket.id];
    }
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Any unmatched route serves the React app
app.get('/:all*', (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
