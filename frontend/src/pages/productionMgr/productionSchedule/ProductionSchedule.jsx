import React, { useState, useEffect } from 'react';
import './ProductionSchedule.css';
import Sidebar from '../../../components/sidebar/Sidebar';
import DashHead from '../../../components/dashHead/DashHead';
import axios from 'axios';
import Settings from '../../../components/settings/Settings';
import jsPDF from 'jspdf';



function ProductionSchedule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [popup, setPopup] = useState(false);
  const [popup2, setPopup2] = useState(false);
  const [createStatusPopup, setcreateStatusPopup] = useState(false);
  const [editStatusPopup, setEditStatusPopup] = useState(false);
  const [loading, setloading] = useState(false);
  const [editStatusMessage, setEditStatusMessage] = useState('');
  const [createStatusMessage, setcreateStatusMessage] = useState('');
  const [data, setData] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [teams, setTeams] = useState([]);
  const [formDataCreate, setformDataCreate] = useState({
    Task_name: '',
    Priorty: '',
    Task_Status: '',
    TeamID: '',
    StartDate: '',
    EndDate: '',
    Task_Description: '',
  });
  const [formData, setFormData] = useState({
    Task: '',
    Priorty: '',
    Team: '',
    Task_Status: '',
    startingTime: '',
    EndingTime: '',
  });


useEffect(() => {
  axios.get('https://garmentsystemfinal.onrender.com/api/production-schedule')
    .then((response) => {
      setData(response.data); // Set state with fetched data
    })
    .catch((error) => console.error('Error fetching production schedule:', error));
}, []);


  const handleEditClick = (task) => {
    setSelectedTask(task);
    setFormData({
      Task: task.Task,
      Priorty: task.Priorty,
      Team: task.Team,
      Task_Status: task.Task_Status,
      startingTime: task.startingTime,
      EndingTime: task.EndingTime,
    });
    setPopup(true);
  };


const handleSubmit = () => {
  setloading(true);

  axios.put(`https://garmentsystemfinal.onrender.com/api/production-scheduleUpdate/${selectedTask.Task}`, formData)
    .then(() => {
      setloading(false);
      setPopup2(false);
      setEditStatusMessage('Task updated successfully!');
      setEditStatusPopup(true);

      // Refresh the data
      return axios.get('https://garmentsystemfinal.onrender.com/api/production-schedule');
    })
    .then((response) => {
      setData(response.data);
    })
    .catch(() => {
      setloading(false);
      setPopup2(false);
      setEditStatusMessage('Failed to update task. Please try again.');
      setEditStatusPopup(true);
    });
};






useEffect(() => {
  axios.get('https://garmentsystemfinal.onrender.com/api/teams')
    .then((response) => {
      setTeams(response.data); // Set the state with fetched data
      console.log(response.data); // Log data
    })
    .catch((error) => console.error('Error fetching teams:', error));
}, []);

  


const handleSubmitCreateTask = () => {
  setloading(true);

  axios.post('https://garmentsystemfinal.onrender.com/api/create-task-schedule', formDataCreate)
    .then((response) => {
      setloading(false);
      setPopup2(false);
      setcreateStatusMessage('Task created successfully!');
      setcreateStatusPopup(true);
    })
    .catch((error) => {
      setloading(false);
      console.error('Error:', error);
      setPopup2(false);
      setcreateStatusMessage('Failed to create task!');
      setcreateStatusPopup(true);
    });
};


  const generatePDF = () => {
    const doc = new jsPDF();
  
    doc.text('Resource Inventory Report', 14, 10);
   
    const tableColumn = [ 'Task_name', 'Priorty', 'Team', 'Task_Status','startingTime','EndingTime'];
    const tableRows = data.map((datas) => [
     
      datas.Task_name,
      datas.Priorty,
      datas.Team,
      datas.Task_Status,
      datas.startingTime,
      datas.EndingTime,
    ]);
  
  
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
  
   
    doc.save('inventory_report.pdf');
  };

  const filteredResources = data.filter((datas) =>
    datas.Task_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  

  return (
    <div className="dashboard-container bg-slate-300">
      <Sidebar user="productionmgr" />
      <main className="main-content">
        <DashHead heading="Production Schedule" user="productionmgr" />
        <div className="prodwrap">
          <section className="container-section prodcntainer-section">
            <div className="table-wrapper">
            <div className="formHead">
            <input
                  type="text"
                  placeholder="Search by Task name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="inputsearch"
                />
            <button onClick={generatePDF} className="downloadButton">
          Download as PDF
        </button>
              </div>
              <table className="productionDash">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Task</th>
                    <th>Priority</th>
                    <th>Team</th>
                    <th>Status</th>
                    <th>Start date</th>
                    <th>End date</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((item, index) => (
                    <tr key={index}>
                      <td>{item.Task}</td>
                      <td>{item.Task_name}</td>
                      <td>{item.Priorty}</td>
                      <td>{item.Team}</td>
                      <td>{item.Task_Status}</td>
                      <td>{item.startingTime}</td>
                      <td>{item.EndingTime}</td>
                      <td>
                        <button onClick={() => handleEditClick(item)}>Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            

          <div  className='createBtn'>

              <button onClick={() => setPopup2(true)}>Create Task</button>
          </div>
          </section>

          {popup && (
              <form className="popup">
                <label>
                  Task:
                  <input type="text" value={formData.Task} readOnly />
                </label>
                <label>
                  Priority:
                  <select
                    value={formData.Priorty}
                    onChange={(e) => setFormData({ ...formData, Priorty: e.target.value })}
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </label>
                <label>
                  Status:
                  <select
                    value={formData.Task_Status}
                    onChange={(e) => setFormData({ ...formData, Task_Status: e.target.value })}
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Blocked">Blocked</option>
                    <option value="Completed">Completed</option>
                  </select>
                </label>
                <label>
                  Start Date:
                  <input
                    type="datetime-local"
                    value={formData.startingTime}
                    onChange={(e) => setFormData({ ...formData, startingTime: e.target.value })}
                  />
                </label>
                <label>
                  End Date:
                  <input
                    type="datetime-local"
                    value={formData.EndingTime}
                    onChange={(e) => setFormData({ ...formData, EndingTime: e.target.value })}
                  />
                </label>
                <button type="button" onClick={handleSubmit}>
                  {loading ? 'saving...': 'save'}
                </button>
                <button type="button" onClick={() => setPopup(false)}>
                  Cancel
                </button>
              </form>
          )}


{popup2 && (
    <form className="popup">
      
      <label>
        Task name:
        <select
          value={formDataCreate.Task_name}
          onChange={(e) => setformDataCreate({ ...formDataCreate, Task_name: e.target.value })}
        >
          <option value="Fabric Inspection">Fabric Inspection</option>
          <option value="Stitching Assembly">Stitching Assembly</option>
          <option value="Quality Check">Quality Check</option>
          <option value="Packaging">Packaging</option>
          <option value="Button Attachment">Button Attachment</option>
          <option value="Fabric Dyeing">Fabric Dyeing</option>
          <option value="Pattern Making">Pattern Making</option>
          <option value="Needling">Needling</option>
          <option value="Thread Rolls">Thread Rolls</option>
          <option value="Cutting Machine">Cutting Machine</option>
          <option value="Stitching Machine">Stitching Machine</option>
        </select>
      </label>


      <label>
        Priority:
        <select
          value={formDataCreate.Priorty}
          onChange={(e) => setformDataCreate({ ...formDataCreate, Priorty: e.target.value })}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </label>
      <label>
        Status:
        <select
          value={formDataCreate.Task_Status}
          onChange={(e) => setformDataCreate({ ...formDataCreate, Task_Status: e.target.value })}
        >
          <option value="Not Started">Not Started</option>
          <option value="In Progress">In Progress</option>
          <option value="Blocked">Blocked</option>
          <option value="Completed">Completed</option>
        </select>
      </label>
      <label>
        Team:
        <select
          value={formDataCreate.TeamID}
          onChange={(e) => setformDataCreate({ ...formDataCreate, TeamID: e.target.value })}
        >
          {teams.map((team) => (
            <option key={team.TeamID} value={team.TeamID}>
              {team.Team_name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Start Date:
        <input
          type="datetime-local"
          value={formDataCreate.StartDate}
          onChange={(e) => setformDataCreate({ ...formDataCreate, StartDate: e.target.value })}
        />
      </label>
      <label>
        End Date:
        <input
          type="datetime-local"
          value={formDataCreate.EndDate}
          onChange={(e) => setformDataCreate({ ...formDataCreate, EndDate: e.target.value })}
        />
      </label>
      <label>
                Task_Description:
                <textarea
                  value={formData.Task_Description}
                  onChange={(e) => setFormData({ ...formData, Task_Description: e.target.value })}
                  placeholder="Enter a detailed Task_Description of the task..."
                />
              </label>
      <button type="button" onClick={handleSubmitCreateTask}>
        {loading ? 'saving...': 'save'}
      </button>
      <button type="button" onClick={() => setPopup2(false)}>
        Cancel
      </button>
    </form>
)}
          {editStatusPopup && (
            <div className="status-popup">
              <p>{editStatusMessage}</p>
              <button onClick={() => setEditStatusPopup(false)}>Close</button>
            </div>
          )}
          {createStatusPopup && (
            <div className="status-popup">

              <p>{createStatusMessage}</p>
              <button onClick={() => setcreateStatusPopup(false)}>Close</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default ProductionSchedule;






