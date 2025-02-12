import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Communication.css'; // Ensure to import the CSS file

function Communication({ receiverId }) {
  const sessionData = JSON.parse(sessionStorage.getItem('user'));
  const senderId = sessionData.UserID;
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get(`https://garmentsystemfinal.onrender.com/api/messages/${senderId}/${receiverId}`)
      .then(response => {
        if (response.data.success) {
          setMessages(response.data.messages);
        }
      })
      .catch(error => console.error('Error fetching messages', error));
  }, [senderId, receiverId]);

  const sendMessage = () => {
    if (message.trim() === '') return;

    axios.post('https://garmentsystemfinal.onrender.com/api/send', { senderId, receiverId, message })
      .then(response => {
        if (response.data.success) {
          setMessages([...messages, { sender_id: senderId, message }]);
          setMessage('');
        }
      })
      .catch(error => console.error('Error sending message', error));
  };

  return (
    <div className="communication-container">
      <h3 className="messages-heading">Messages</h3>
      <div className="messages-area">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender_id === senderId ? 'sent-message' : 'received-message'}>
            <p>{msg.message}</p>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>

      <div className="message-input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default Communication;
