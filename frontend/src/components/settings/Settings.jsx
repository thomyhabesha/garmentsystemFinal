import React, { useState } from "react";
import "./Settings.css";
import axios from "axios";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

function Settings({ role }) {
  const [username, setUsername] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false); // Track loading state
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleUpdate = async (event) => {
    event.preventDefault();
    setLoading(true); // Start loading
    setMessage('');
    setMessageType('');

    try {
      const response = await axios.put('https://garmentsystemfinal.onrender.com/api/updateSettings', {
        username,
        newUsername,
        oldPassword,
        newPassword,
        role,
      });

      if (response.status === 200) {
        setMessage('Settings updated successfully');
        setMessageType('success');
        setOldPassword('');
        setNewPassword('');
        setUsername('');
        setNewUsername('');
      }
    } catch (error) {
      setMessage('Failed updating settings: ' + error.response?.data?.message || error.message);
      setMessageType('error');
    } finally {
      setLoading(false); 
    }
  };


  const handleClose = () => {
    setMessage('');
  };

  return (
    <section className="container-section">
      <h3>Modify Account</h3>
      <div className="registerForm">
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="User name"
            className="input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="New user name"
            className="input"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Old Password"
            className="input"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="New Password"
            className="input"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </form>
          <button type="submit" className="button" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : "Update"}
          </button>
        {/* Display the message */}
        {message && (
          <div className={`popup-overlay ${messageType}`}>
            <div className="popup-content">
            {message}
          <button onClick={handleClose} className="close-button">Close</button>
          </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default Settings;
