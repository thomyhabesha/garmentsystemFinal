import React, { useState, useEffect } from 'react';
import './Login.css';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); 
  const [error, setError] = useState(''); 
  const navigate = useNavigate();

  useEffect(() => {
    const user = sessionStorage.getItem("user");
  
    if (user) {
      const parsedUser = JSON.parse(user); 
  
      if (parsedUser.user_role === 'Admin') {
        navigate('/DashboardAdmin', { replace: true });
      } else if (parsedUser.user_role === 'Production manager') {
        navigate('/DashboardProdction', { replace: true });
      } else if (parsedUser.user_role === 'Inventory manager') {
        navigate('/DashboardInventory', { replace: true });
      }
    }
  }, []);
  
  const handleLogin = async (e) => {
    e.preventDefault();
    console.log('Logging in with:', username, password, role);  
    
    const loginData = { username, password, role };
  
    try {
      const response = await axios.post('https://garmentsystemfinal.onrender.com/api/login', loginData);
      if (response.data.message) {
        const { UserID, Fname, Lname, email, user_role  } = response.data.user;
        const userData = { UserID, Fname, Lname, email, user_role , loginTime: Date.now() }; // Store login time
       
        sessionStorage.setItem('user', JSON.stringify(userData)); 
         console.log("userData.UserID: "+userData.UserID)
        if (response.data.user.user_role === 'Admin') {
          navigate('/DashboardAdmin', { replace: true }); 
        } else if (response.data.user.user_role === 'Production manager') {
          navigate('/DashboardProdction', { replace: true }); 
        } else if (response.data.user.user_role === 'Inventory manager') {
          navigate('/DashboardInventory', { replace: true }); 
        }
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Invalid credentials'); 
    }
  };
  
  return (
    <div className="container">
      <div className="overlay">
        <div className="loginBox">
          <div className="loginBoxTop">
            <h2 className="title">Login</h2>
            <p className="subtitle">Authorized Access Only</p>
          </div>
          <form className="form" onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Username"
              className="input"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="admin">Admin</option>
              <option value="productionmanager">Production Manager</option>
              <option value="inventorymanager">Inventory Manager</option>
            </select>
            <button type="submit" className="button">
              Login
            </button>
          </form>
          {error && <p className="error-message">{error}</p>}
          <Link to="/forgotPassword" className="forgotPassword">Forgot password?</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
