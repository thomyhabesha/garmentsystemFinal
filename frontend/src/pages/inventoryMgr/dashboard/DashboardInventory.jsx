import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./Dashboard.css";
import Sidebar from '../../../components/sidebar/Sidebar';
import ProdDashhead from '../../../components/ProdDashhead/ProdDashhead';

function DashboardInventory() {
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [updateStock, setupdateStock] = useState(false);
  const [submiting, setsubmiting] = useState(false);
  const [submitmessage, setsubmitmessage] = useState('');
  const [selectedResource, setSelectedResource] = useState(null);
  const [formData, setFormData] = useState({
    arrivalDate: '',
    quantity: '',
    arrivalStatus: '',
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await axios.get('https://garmentsystemfinal.onrender.com/api/resources');
        setResources(response.data);
      } catch (error) {
        console.error('Error fetching resources:', error);
      }
    };

    fetchResources();
  }, []);

  const handleRequestClick = (resource) => {
    setSelectedResource(resource);
    setShowPopup(true);
    setupdateStock(false);
  };

  const handleUpdateClick = (resource) => {
    setSelectedResource(resource);
    setShowPopup(true);
    setupdateStock(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedResource(null);
    setFormData({
      arrivalDate: '',
      quantity: '',
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setsubmiting(true)
    try {
      const payload = {
        arrivalDate: formData.arrivalDate,
        quantity: formData.quantity,
        ResourcesID: selectedResource.ResourcesID, // Send ResourcesID, not the name
      };

      await axios.post('https://garmentsystemfinal.onrender.com/api/requestResource', payload);
      setsubmitmessage('Date submitted successfully!');
      setsubmiting(false)
      
    } catch (error) {
      console.error('Error submitting request:', error);
      setsubmitmessage('Error submitting request!')
      setsubmiting(false)
    }
  };


  const handleUpdate = async (e) => {
    e.preventDefault();
    setsubmiting(true);
    try {
      const payload = {
        ResourcesID: selectedResource.ResourcesID,
        arrivalStatus: formData.arrivalStatus,
        quantity: formData.quantity,
      };

      await axios.post('https://garmentsystemfinal.onrender.com/api/updateResourcestock', payload);
      setsubmitmessage('Date submitted successfully!');
      setsubmiting(false);
    } catch (error) {
      console.error('Error submitting request:', error);
      setsubmitmessage('Error updating resource!');
      setsubmiting(false);
    }
  };


  const filteredResources = resources.filter((resource) =>
    resource.ResourcesName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-container bg-slate-300">
      <Sidebar user="inventory" />
      <main className="main-content">
        <header>
          <h1 className="mainH2">Dashboard</h1>
        </header>
        <section className="container-section prodcntainer-section">
          <div className="InveDashTop">
            <div className="productionChart">
              <ProdDashhead heading="Dashboard" user="inventory" />
            </div>

            <div className="inventory">
            <div className="inventoryhead">
              <h2>Resource tracking</h2>
              <div>
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="inputsearch"
                />
              </div>
              </div>
              <table className="productionDash">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.length > 0 ? (
                    filteredResources.map((resource) => (
                      <tr
                        key={resource.ResourcesID}
                        style={{
                          color: resource.quantity < 10 ? 'white' : 'black',
                        }}
                      >
                        <td style={{ padding: '8px' }}>{resource.ResourcesName}</td>
                        <td style={{ padding: '8px', backgroundColor: resource.quantity < 10 ? '#eb3030' : 'white' }}>
                          {resource.quantity === 0 ? (
                            <span style={{ fontWeight: 'bold' }}>Out of Stock</span>
                          ) : (
                            resource.quantity
                          )}
                        </td>
                        <td >
                          
                          <div className='tableActions'>
                          <button
                          style={{ backgroundColor: resource.quantity < 10 ? 'green' : 'grey',
                            cursor: resource.quantity < 10 ? 'pointer' : 'not-allowed', }}
                          
                          className="requestButton"
                          onClick={() => handleRequestClick(resource)}
                          disabled={resource.quantity > 10}
                        >
                          Order
                        </button>

                          <button
                            className="updateButton"
                            style={{ 
                              cursor: 'pointer' }}
                              onClick={() => handleUpdateClick(resource)}
                          >
                            Update
                          </button>
                          </div>
                        
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '16px' }}>
                        No resources found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {showPopup && (
        <div className="popup">
          <div className="popup-inner">
            <h2>{updateStock ? 'Update Resource':'Request Resource'}</h2>
            <form>
              <div className="form-group">
                <label>Resource Name:</label>
                <input type="text" value={selectedResource.ResourcesName} readOnly />
              </div>

              { 
              !updateStock && 
                <div className="form-group">
                <label>Supplier:</label>
                <input type="text" value={selectedResource.suppliername} readOnly />
              </div>
              }
            {updateStock ? 
            
            <div className="form-group">
                <label>Arrival Status:</label>
                <select
                  name="arrivalStatus"
                  value={formData.arrivalStatus}
                  onChange={handleFormChange}
                  required
                >
                  <option value="">Select Status</option>
                  <option value="Waiting">Waiting</option>
                  <option value="Received">Arrived</option>
                  <option value="Rejected">Didnt arrive</option>
                </select>
              </div>
            : 
              <div className="form-group">
                <label>Arrival Date:</label>
                <input
                  type="date"
                  name="arrivalDate"
                  value={formData.arrivalDate}
                  onChange={handleFormChange}
                  required
                />
              </div>
}

              <div className="form-group">
                <label>Quantity:</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-actions">
                {
                  updateStock ?
                  <button type="submit" onClick={handleUpdate} className="submitButton">{submiting?'Proceeding...':'Proceed'}</button>
                  :
                  <button type="submit" onClick={handleSubmit}  className="submitButton">{submiting?'Submitting...':'Submit'}</button>
                }
                <button type="button" className="closeButton" onClick={handleClosePopup}>
                  Close
                </button>
              </div>

             {selectedResource && <p>Total cost: {selectedResource.CostPerQuantity * formData.quantity  }</p>}
             {setsubmitmessage && <p style={{color:submitmessage ==='Date submitted successfully!'? 'green':'red'}}>{submitmessage}</p>}
            </form>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardInventory;
