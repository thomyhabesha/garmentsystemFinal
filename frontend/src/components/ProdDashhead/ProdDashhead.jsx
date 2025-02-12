import React, { useEffect, useState } from "react";
import './ProdDashhead.css'
import AnalyticImage from '../../assets/garmentImg/Increase.png'
import axios from "axios";


const ProdDashhead=({heading, user})=>{
  const [stats, setStats] = useState({
    total_count: 0,
    low_stock_count: 0,
    out_of_stock_count: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("https://garmentsystemfinal.onrender.com/api/resources/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching resource stats:", error);
      }
    };
    fetchStats();
  }, []);

    return(
<div className="DashboardHead">
       

       {user ==='admin'?
        <div className="user-count-card-cont">

        <div className="user-count-card">
          <h3>24</h3>
          <p>User count</p>
        </div>
        <img src={AnalyticImage} alt='' /> 
        </div>
        :
       user ==='inventory'?
       <div className="prodHead">

{/*first heading */}
        <div className="user-count-card-cont user-count-card-cont1">

        <div className="user-count-card">
          <h3>{stats.total_count}</h3>
          <p>All resources</p>
        </div>
        <img src={AnalyticImage} alt='' /> 
        </div>


{/*second heading */}
        <div className="user-count-card-cont user-count-card-cont2">
        <div className="user-count-card">
          <h3>{stats.low_stock_count}</h3>
          <p>Low stock</p>
        </div>
        <img src={AnalyticImage} alt='' /> 
        </div>

{/*third heading */}
        <div className="user-count-card-cont user-count-card-cont3">

        <div className="user-count-card">
          <h3>{stats.out_of_stock_count}</h3>
          <p>Out of stock</p>
        </div>
        <img src={AnalyticImage} alt='' /> 
        </div>

        </div>
        :''
        }

        </div>

     )


}

export default ProdDashhead