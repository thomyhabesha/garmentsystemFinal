import React, { useEffect, useState } from "react";
import "./ActivityLogs.css";
import Sidebar from '../../../components/sidebar/Sidebar';
import DashHead from '../../../components/dashHead/DashHead';
import SystemMetrics from '../../../components/systemMetrics/SystemMetrics';
import axios from "axios";

function ActivityLogs() {
  const [activitylog, setactivitylog] = useState([]); // State to hold user data
  const [error, setError] = useState(null); // Error state

  // Fetch users from the backend
  useEffect(() => {
    const fetchActivitylog = async () => {
      try {
        const response = await axios.get("https://garmentsystemfinal.onrender.com/api/getActivitylogs");
        setactivitylog(response.data); 
      } catch (err) {
        console.error("Error fetching Activity logs:", err);
        setError("Failed to fetch Activity logs.");
      }
    };

    fetchActivitylog();
  }, []);
 
  

  return (
    <div className="dashboard-container">
      <Sidebar user="admin" />
      
      <main className="main-content">
        <DashHead heading="Activity logs" />
        <section className="container-section">
            <SystemMetrics/>
          <div className="table-container">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>action type</th>
                  <th>UserID</th>
                  <th>description</th>
                  <th>action date</th>
                </tr>
              </thead>
              <tbody>
                {activitylog.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.log_id}</td>
                    <td>{activity.action_type}</td>
                    <td>{activity.UserID} </td>
                    <td>{activity.description}</td>
                    <td>{activity.action_timestamp}</td>
                    
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          

         
        </section>
      </main>
    </div>
  );
}

export default ActivityLogs;
