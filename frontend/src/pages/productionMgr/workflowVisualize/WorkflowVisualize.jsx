import React, { useEffect, useState } from 'react';
import './WorkflowVisualize.css';
import Sidebar from '../../../components/sidebar/Sidebar';
import DashHead from '../../../components/dashHead/DashHead';

const WorkflowVisualize = () => {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('https://garmentsystemfinal.onrender.com/api/Workflowtasks');
        const data = await response.json();
        console.log(data);
        setTasks(data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    fetchTasks();
  }, []);

  const handleDetailsClick = (task) => {
    setSelectedTask(task);
  };

  const handleClose = () => {
    setSelectedTask(null);
  };

  // Helper function to format date to "YYYY-MM-DD"
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // Formats as "DD/MM/YYYY"
  };

  // Calculate remaining days and determine background color
  const getBackgroundColor = (endingTime) => {
    const today = new Date();
    const endDate = new Date(endingTime);
    const diffInDays = Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

    if (diffInDays <= 10) return 'red-bg'; // Red for <= 10 days
    if (diffInDays <= 20) return 'yellow-bg'; // Yellow for <= 20 days
    return 'blue-bg'; // Blue for > 20 days
  };

  return (
    <div className="dashboard-container bg-slate-300">
      <Sidebar user="productionmgr" />
      <main className="main-content">
        <DashHead heading="Workflow" user="productionmgr" />
        <div className="prodwrap">
          <section className="container-section prodcntainer-section">
            <div className="app-container">
              <div className="entity-section">
                <div className="entities-container">
                  {tasks.map((task) => (
                    <div
                      className={`entity-card ${getBackgroundColor(task.EndingTime)}`}
                      key={task.id}
                    >
                      <h3>{task.task_name}</h3>
                      <p>
                        <strong>Time Interval:</strong> {formatDate(task.startingTime)} - {formatDate(task.EndingTime)}
                      </p>
                      <button onClick={() => handleDetailsClick(task)} className="details-button">
                        Details
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {selectedTask && (
                <div className="popup-overlay" onClick={handleClose}>
                  <div className="popup-content" onClick={(e) => e.stopPropagation()}>
                    <h2>Details for {selectedTask.task_name}</h2>
                    <p>
                      <strong>Time Interval:</strong> {formatDate(selectedTask.startingTime)} -{' '}
                      {formatDate(selectedTask.EndingTime)}
                    </p>
                    <p><strong>Description:</strong> {selectedTask.Task_Description}</p>
                    <p><strong>Team Name:</strong> {selectedTask.team_name}</p>
                    <p><strong>Resources:</strong></p>
                    <ul>
                      {selectedTask.resources.map((resource, index) => (
                        <li key={index}>{resource}</li>
                      ))}
                    </ul>
                    <button onClick={handleClose} className="close-button">Close</button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default WorkflowVisualize;
