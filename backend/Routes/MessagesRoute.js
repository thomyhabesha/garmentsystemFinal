const express = require('express');
const router = express.Router();
const messageController = require('../Controllers/MessageController');

// Route to fetch messages between two users
router.get('/messages/:senderId/:receiverId', messageController.getMessages);

// Route to send a message
router.post('/send', messageController.sendMessage);

module.exports = router;
