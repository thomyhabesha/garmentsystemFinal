import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Dashboard.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashHead from "../../../components/dashHead/DashHead";

function DashboardAdmin() {
  const [searchTerm, setSearchTerm] = useState('');
  const [users, setUsers] = useState([]); 
  const [error, setError] = useState(null); 
  
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("https://garmentsystemfinal.onrender.com/api/getusers");
        setUsers(response.data); 
      } catch (err) {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users.");
      }
    };

    fetchUsers();
  }, []);

  const generatePDF = () => {
    const doc = new jsPDF();

   
    doc.text("Registered Users", 14, 15);

    
    const tableColumn = ["ID", "Name", "Email", "Role", "Contact"];
    
    
    const tableRows = users.map(user => [
      user.UserID,
      `${user.Fname} ${user.Lname}`,
      user.email,
      user.user_role,
      user.contact_no
    ]);

    
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20
    });

    
    doc.save("registered_users.pdf");
  };


  const filteredResources = users.filter((user) =>
    user.user_role.toLowerCase().includes(searchTerm.toLowerCase())
  );




  return (
    <div className="dashboard-container bg-slate-300">
      <Sidebar user="admin" />
      <main className="main-content">
        <DashHead heading="Dashboard" user="admin" />
        <section className="container-section">
          {error && <p style={{ color: "red" }}>{error}</p>}

          {/* Download PDF Button */}
          <div className="formHead">
            <input
                  type="text"
                  placeholder="Search by role"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="inputsearch"
                />
            <button onClick={generatePDF} className="downloadButton">
          Download as PDF
        </button>
              </div>

          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {filteredResources.length > 0 ? (
                  filteredResources.map((user) => (
                    <tr key={user.UserID}>
                      <td>{user.UserID}</td>
                      <td>{user.Fname} {user.Lname}</td>
                      <td>{user.email}</td>
                      <td>{user.user_role}</td>
                      <td>{user.contact_no}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: "center" }}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default DashboardAdmin;
