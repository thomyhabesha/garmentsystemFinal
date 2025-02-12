import React, { useEffect, useState,useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import Sidebar from '../../../components/sidebar/Sidebar';
import DashHead from '../../../components/dashHead/DashHead';

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './Dashboard.css'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashboardProdction = () => {
  const [data, setData] = useState(null);
  const [finishedTaskPercent, setFinishedTaskPercent] = useState(0);
  const chartRef = useRef(null);
  // Fetch task counts from the Express API
  useEffect(() => {
    fetch('https://garmentsystemfinal.onrender.com/api/task-counts')
      .then((response) => response.json())
      .then((data) => {
        // Prepare the data for Chart.js
        const labels = data.map(item => item.Task_Status);
        const counts = data.map(item => item.count);

        // Calculate the percentage of Finished tasks
        const finishedCount = data.find(item => item.Task_Status === 'Completed')?.count || 0;
        const totalCount = data.reduce((total, item) => total + item.count, 0);
        const finishedPercentage = (finishedCount / totalCount) * 100;

        setData({
          labels,
          datasets: [{
            label: 'Task Count by Task_Status',
            data: counts,
            backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(255, 99, 132, 0.2)', 'rgba(255, 159, 64, 0.2)'],
            borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)', 'rgba(255, 159, 64, 1)'],
            borderWidth: 1
          }]
        });

        // Set finished task percentage
        setFinishedTaskPercent(finishedPercentage);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  // If data is not yet available, display loading
  if (!data) {
    return <div>Loading...</div>;
  }

  // Bar chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: false,
        text: 'Task Count by Task_Status'
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Task_Status'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Count'
        }
      }
    }
  };


  const downloadChartAsPDF = () => {
    const chartElement = chartRef.current.canvas;

    html2canvas(chartElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape');
      pdf.addImage(imgData, 'PNG', 15, 15, 260, 150);
      pdf.save('task_chart.pdf');
    });
  };

  
  return (
    <div className="dashboard-container bg-slate-300">
      <Sidebar user="productionmgr" />
      <main className="main-content">
        <DashHead heading="Dashboard" user="productionmgr" />
        <div className="formHead">
            <button onClick={downloadChartAsPDF} className="downloadButton">
        Download as PDF
      </button>
      </div>
         <div className="chartTop">
            <Bar ref={chartRef} data={data} options={options} />
         </div>
          
            
      </main>
    </div>
  );
};

export default DashboardProdction;
