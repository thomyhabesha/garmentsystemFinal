import React, { useEffect, useState } from 'react';
import AnalyticImage from '../../assets/garmentImg/Increase.png'
import axios from 'axios';

const SystemMetrics = () => {
  const [uptime, setUptime] = useState(null);

  useEffect(() => {
    axios.get('https://garmentsystemfinal.onrender.com/api/uptime')
      .then(response => {
        setUptime(response.data.uptime);
      })
      .catch(error => {
        console.error('Error fetching uptime:', error);
      });
  }, []);

  return (

    <div className="DashboardHead activlog">
<div className="DashboardHead1">
        <div className="user-count-card-cont">

        <div className="user-count-card">
          <h3>{uptime ? `${uptime} sec` : 'Loading...'}</h3>
          <p>System Uptime</p>
         
        </div>
        <img src={AnalyticImage} alt='' /> 
        </div>
        </div>
        </div>
       

  );
};

export default SystemMetrics;
