import React,{useState, useEffect} from "react";
import './DashHead.css'
import axios from "axios";
import AnalyticImage from '../../assets/garmentImg/Increase.png'
const DashHead=({heading, user})=>{


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

  

    return(
<div className="DashboardHead">
<div className="DashboardHead1">
        <header>
          <h2>{heading}</h2>
        </header>

       {user ==='admin'?
        <div className="user-count-card-cont">

        <div className="user-count-card">
          <h3>{users.length}</h3>
          <p>User count</p>
        </div>
        <img src={AnalyticImage} alt='' /> 
        </div>
        :''
        }

        </div>
        </div>

     )


}

export default DashHead