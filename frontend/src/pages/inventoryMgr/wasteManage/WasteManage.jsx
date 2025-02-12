import React, { useState, useEffect } from "react";
import "./WasteManage.css";
import Sidebar from "../../../components/sidebar/Sidebar";
import axios from "axios";
import jsPDF from 'jspdf';


function WasteManage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [defects, setDefects] = useState([]);
  const [resources, setResources] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [formVisible, setFormVisible] = useState(false);
  const [formVisible2, setFormVisible2] = useState(false);
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    ResourcesID: "",
    defect_type: "",
    resStatus: "",
    supplier_id: "",
    return_status: "",
    notes: "",
    defectdquantity: "",
    replacement_received: false,
  });
  const [summary, setSummary] = useState(0); // To store summary cost

  useEffect(() => {
    axios.get("https://garmentsystemfinal.onrender.com/api/resources")
      .then((response) => setResources(response.data))
      .catch((error) => console.error("Error fetching resources: ", error));

    axios.get("https://garmentsystemfinal.onrender.com/api/suppliers")
      .then((response) => setSuppliers(response.data))
      .catch((error) => console.error("Error fetching suppliers: ", error));
  }, []);

  useEffect(() => {
    fetchDefects();
  }, []);

  const fetchDefects = () => {
    axios
      .get("https://garmentsystemfinal.onrender.com/api/getdefects")
      .then((response) => setDefects(response.data))
      .catch((error) => console.error("Error fetching defects:", error));
  };

  const fetchSummary = () => {
    axios
      .get("https://garmentsystemfinal.onrender.com/api/Defectsummary")
      .then((response) => setSummary(response.data.totalCost))
      .catch((error) => console.error("Error fetching summary:", error));
  };

  const handleFormToggle = () => {
    setFormVisible(!formVisible);
  };
  const handleFormToggle2 = () => {
    setFormVisible2(!formVisible2);
    if (!formVisible2) {
      fetchSummary(); // Fetch summary data when toggled
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    axios
      .post("https://garmentsystemfinal.onrender.com/api/garment_defects", formData)
      .then(() => {
        setSending(false);
        fetchDefects();
        setFormVisible(false);
        setFormData({
          ResourcesID: "",
          defect_type: "",
          resStatus: "",
          supplier_id: "",
          return_status: "",
          replacement_received: false,
          notes: "",
          defectdquantity: 0,
        });
      })
      .catch((error) => console.error("Error submitting defect:", error));
    setSending(false);
  };

  const generatePDF = () => {
  const doc = new jsPDF();

  doc.text('Resource Inventory Report', 14, 10);
 
  const tableColumn = [ 'defect type', 'notes', 'replacement received','reported date','Resources name','defectd quantity','Status','return status',];
  const tableRows = defects.map((defect) => [
   
    defect.defect_type,
    defect.notes,
    defect.replacement_received===0?'Not received':'Received',
    defect.reported_date,
    defect.ResourcesName,
    defect.defectdquantity,
    defect.resStatus,
    defect.return_status,
  ]);


  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 20,
  });

 
  doc.save('inventory_report.pdf');
};

const filteredResources = defects.filter((defect) =>
  defect.defect_type.toLowerCase().includes(searchTerm.toLowerCase())
);

  return (
    <div className="dashboard-container bg-slate-300">
      <Sidebar user="inventory" />
      <main className="main-content">
        <header>
          <h1 className="mainH2">Garment Defects</h1>
        </header>

        <div className="defects-table-cont">
          {/* Table */}
            <div className="formHead">
            <input
                  type="text"
                  placeholder="Search by type"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="inputsearch"
                />
            <button onClick={generatePDF} className="downloadButton">
          Download as PDF
        </button>
              </div>
          <table className="defects-table">
            <thead>
              <tr>
                <th>Defect Type</th>
                <th>Notes</th>
                <th>Replacement Received</th>
                <th>Reported Date</th>
                <th>Resource Name</th>
                <th>Defected Quantity</th>
                <th>Status</th>
                <th>Return Status</th>
                <th>Supplier Name</th>
              </tr>
            </thead>
            <tbody>
              {filteredResources.map((defect) => (
                <tr key={defect.defect_id}>
                  <td>{defect.defect_type}</td>
                  <td>{defect.notes}</td>
                  <td>{defect.replacement_received ? "Received" : "Not received"}</td>
                  <td>{defect.reported_date}</td>
                  <td>{defect.ResourcesName}</td>
                  <td>{defect.defectdquantity}</td>
                  <td>{defect.resStatus}</td>
                  <td>{defect.return_status}</td>
                  <td>{defect.suppliername}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Form */}
          {formVisible && (
            <form onSubmit={handleSubmit} className="defect-form">
              <div>
                <label>Resource Name</label>
                <select
                  name="ResourcesID"
                  onChange={handleChange}
                  value={formData.ResourcesID}
                >
                  {resources.map((resource) => (
                    <option
                      key={resource.ResourcesID}
                      value={resource.ResourcesID}
                    >
                      {resource.ResourcesName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Defect Type</label>
                <select
                  name="defect_type"
                  value={formData.defect_type}
                  onChange={handleChange}
                >
                  <option value="repairable">Repairable</option>
                  <option value="unrepairable">Unrepairable</option>
                  <option value="returnable">Returnable</option>
                  <option value="scrapped">Scrapped</option>
                </select>
              </div>
              <div>
                <label>Status</label>
                <select
                  name="resStatus"
                  onChange={handleChange}
                  value={formData.resStatus}
                >
                  <option value="faulty stitching">Faulty Stitching</option>
                  <option value="damaged fabric">Damaged Fabric</option>
                </select>
              </div>
              <div>
                <label>Supplier Name</label>
                <select
                  name="supplier_id"
                  onChange={handleChange}
                  value={formData.supplier_id}
                >
                  {suppliers.map((supplier) => (
                    <option
                      key={supplier.supplierID}
                      value={supplier.supplierID}
                    >
                      {supplier.suppliername}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label>Return Status</label>
                <select
                  name="return_status"
                  onChange={handleChange}
                  value={formData.return_status}
                >
                  <option value="approved">Approved</option>
                  <option value="in review">In Review</option>
                  <option value="declined">Declined</option>
                </select>
              </div>
              <div>
                <label>Defected Quantity</label>
                <input
                  type="number"
                  onChange={handleChange}
                  name="defectdquantity"
                  value={formData.defectdquantity}
                />
              </div>
              <div>
                <label>Replacement Received</label>
                <input
                  type="checkbox"
                  name="replacement_received"
                  onChange={(e) =>
                    handleChange({
                      target: {
                        name: e.target.name,
                        value: e.target.checked,
                      },
                    })
                  }
                  checked={!!formData.replacement_received}
                />
              </div>
              <div className="descText">
                <label>Description</label>
                <textarea
                  name="notes"
                  onChange={handleChange}
                  value={formData.notes}
                ></textarea>
              </div>
              <button type="submit" disabled={sending}>
                {sending ? "Submitting..." : "Submit"}
              </button>
            </form>
          )}

          {/* Summary */}
          {formVisible2 && (
            <div className="summary-container">

              <h2>Summary for the current month</h2>
              <h3>Total Unrepairable Defect Cost: ${summary}</h3>
              <div>
              <button onClick={handleFormToggle2} className="create-defect-btn summary-defect-btn">
            Cancel 
          </button>
            </div>
            </div>
          )}
        </div>
        <div className="DefectButton">
          <button onClick={handleFormToggle} className="create-defect-btn">
            {formVisible ? "Cancel" : "Create Defect"}
          </button>

          <button
            onClick={handleFormToggle2}
            className="summary-defect-btn create-defect-btn"
          >
            Summary
          </button>
        </div>
      </main>
    </div>
  );
}

export default WasteManage;
