import React, { useState } from "react";
import "./Register.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import DashHead from "../../../components/dashHead/DashHead";



function Register() {
  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    email: "",
    department: "",
    user_role: "",
    contact_no: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setMessage(""); 
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 
    setMessage(""); 
    setError("");
    setShowPopup(false); 

    try {
      const response = await fetch("https://garmentsystemfinal.onrender.com/api/CreateUserRoute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("User registered successfully!");
        
        setFormData({
          Fname: "",
          Lname: "",
          email: "",
          department: "",
          user_role: "",
          contact_no: "",
        }); 
      } else {
        setError(`Error: ${data.message || "Failed to register user"}`);
      }
    } catch (err) {
      console.error("Error registering user:", err);
      setError("An error occurred. Please try again later.");
      setShowPopup(true); 
      
    } finally {
      setLoading(false);
      setShowPopup(true);  
    }
  };

  const Closepop =()=> {
    setShowPopup(false);
    setMessage("");
  }




  return (
    <div className="dashboard-container">
      <Sidebar user="admin" />
      <main className="main-content">
        <DashHead heading="Register" />
        <section className="container-section">
          <div className="registerForm">

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="Fname"
                placeholder="First Name"
                className="input"
                value={formData.Fname}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="Lname"
                placeholder="Last Name"
                className="input"
                value={formData.Lname}
                onChange={handleChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="input"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="department"
                placeholder="Department"
                className="input"
                value={formData.department}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                name="contact_no"
                placeholder="Contact No"
                className="input"
                value={formData.contact_no}
                onChange={handleChange}
                required
              />
              <div className="role-select">
                <select
                  name="user_role"
                  className="input"
                  value={formData.user_role}
                  onChange={handleChange}
                  required
                >
                  <option value="admin">Admin</option>
                  <option value="productionmanager">Productio manager</option>
                  <option value="inventorymanager">Inventory manager</option>
                  <option value="employee">Employee</option>
                </select>
              </div>

              
            </form>
            {/* Submit Button */}
            <button type="submit" className="button" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </button>
          </div>
        </section>
      </main>

      {/* Popup for Success Message */}
      {showPopup && (
        <div className="popup-overlay">
        <div className="popup-box">
          <p >{error ? error : message}</p>
          <button className="close-btn" onClick={Closepop}>
            Close
          </button> 
        </div>
      </div>
      )}
    </div>
  );
}

export default Register;
