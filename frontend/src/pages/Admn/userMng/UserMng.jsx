import React, { useEffect, useState } from "react";
import "./UserMng.css";
import Sidebar from '../../../components/sidebar/Sidebar';
import DashHead from '../../../components/dashHead/DashHead';
import axios from "axios";

function UserMng() {
  const [users, setUsers] = useState([]); // State to hold user data
  const [error, setError] = useState(null); // Error state

  // Fetch users from the backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://garmentsystemfinal.onrender.com/api/getusers");
        setUsers(response.data); // Set fetched user data
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);
 
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Handle edit modal opening
  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Handle remove modal opening
  const handleRemove = (user) => {
    setSelectedUser(user);
  };

  // Handle closing modals
  const handleModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };

  // Handle input change in the edit form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setSelectedUser({ ...selectedUser, [name]: value });
  };

  // Update user
  const handleUpdate = async () => {
    try {
      await axios.put(`https://garmentsystemfinal.onrender.com/api/updateuser/${selectedUser.UserID}`, selectedUser);
      setUsers(users.map(user => user.UserID === selectedUser.UserID ? selectedUser : user)); // Update the user in the UI
      handleModalClose();
      alert("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };


  return (
    <div className="dashboard-container">
      <Sidebar user="admin" />
      
      <main className="main-content">
        <DashHead heading="User Management" />
        <section className="container-section">
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.UserID}>
                    <td>{user.UserID}</td>
                    <td>{user.Fname} {user.Lname}</td>
                    <td>{user.user_role}</td>
                    <td>{user.status}</td>
                    <td>
                      <button onClick={() => handleEdit(user)} className="edit-button">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Editing User */}
          {isEditModalOpen && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h4>Edit User</h4>
                <label>ID:</label>
                <input type="text" value={selectedUser.UserID} readOnly />
                <label>Name:</label>
                <input 
                  type="text" 
                  name="Fname" 
                  value={selectedUser.Fname} 
                  onChange={handleInputChange} 
                />
                <input 
                  type="text" 
                  name="Lname" 
                  value={selectedUser.Lname} 
                  onChange={handleInputChange} 
                />
                <label>Role:</label>
                <select 
                  name="user_role" 
                  value={selectedUser.user_role} 
                  onChange={handleInputChange} 
                >
                  <option value="Production Manager">Production Manager</option>
                  <option value="Inventory Manager">Inventory Manager</option>
                  <option value="Employee">Employee</option>
                  {/* Add other roles as needed */}
                </select>
                <label>Status:</label>
                <input 
                  type="text" 
                  name="status" 
                  value={selectedUser.status} 
                  onChange={handleInputChange} 
                />
                <button onClick={handleUpdate} className="update-button">Update</button>
                <button onClick={handleModalClose} className="close-button">Close</button>
              </div>
            </div>
          )}

         
        </section>
      </main>
    </div>
  );
}

export default UserMng;
