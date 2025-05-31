import React from 'react';
import { useNavigate } from 'react-router-dom';
import fileIcon from './assets/file-icon.png';
import './Records1.css';

const Records1 = () => {
  const navigate = useNavigate();

  // Dummy reservation data
  const reservations = [
    {
      id: 1,
      requester: 'JPCS',
      date: 'March 3, 2025',
      time: 'Morning',
      status: 'Pending',
      organization: 'JPCS',
      eventName: 'Tech Talk',
      natureOfActivity: 'Seminar',
      participants: 50,
      venue: 'AVR Room',
    },
    {
      id: 2,
      requester: 'Zurinee Allyson K. Alonzo',
      date: 'March 10, 2025',
      time: 'Afternoon',
      status: 'Rejected',
      organization: 'COMSOC',
      eventName: 'Leadership Workshop',
      natureOfActivity: 'Training',
      participants: 30,
      venue: 'Hall B',
    },
  ];

  const getStatusClass = (status) => {
    switch (status) {
      case 'Approved':
        return 'status-pill approved';
      case 'Rejected':
        return 'status-pill rejected';
      case 'Pending':
        return 'status-pill pending';
      default:
        return 'status-pill';
    }
  };

  const generateReport = (reservation) => {
    const reportWindow = window.open('', '_blank');
    const reportContent = `
      <html>
        <head>
          <title>Reservation Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              background-color: #ffffff;
            }
            h2 {
              font-size: 22px;
              margin-bottom: 20px;
              color: #111827;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 16px;
              color: #333;
            }
            td {
              padding: 10px 0;
              border-bottom: 1px solid #ccc;
            }
            td:first-child {
              font-weight: bold;
              width: 220px;
              vertical-align: top;
            }
          </style>
        </head>
        <body>
          <h2>Institutional Lasallian Formation Office</h2>
          <table>
            <tr><td>Requestor:</td><td>${reservation.organization || 'N/A'}</td></tr>
            <tr><td>Event Name:</td><td>${reservation.eventName || 'N/A'}</td></tr>
            <tr><td>Nature of Activity:</td><td>${reservation.natureOfActivity || 'N/A'}</td></tr>
            <tr><td>Date:</td><td>${reservation.date || 'N/A'}</td></tr>
            <tr><td>Time:</td><td>${reservation.time || 'N/A'}</td></tr>
            <tr><td>Number of Participants:</td><td>${reservation.participants || 'N/A'}</td></tr>
            <tr><td>Facility:</td><td>${reservation.venue || 'N/A'}</td></tr>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    reportWindow.document.write(reportContent);
    reportWindow.document.close();
  };

  const generateSummaryReport = () => {
    const summaryWindow = window.open('', '_blank');
    const reportContent = `
      <html>
        <head>
          <title>Reservation Summary</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 40px;
              background-color: #ffffff;
              color: #111827;
            }
            h2 {
              font-size: 24px;
              margin-bottom: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 16px;
            }
            th, td {
              padding: 12px;
              text-align: left;
              border-bottom: 1px solid #ccc;
            }
            th {
              background-color: #E8F0E1;
            }
            .status-pill {
              display: inline-block;
              padding: 6px 14px;
              border-radius: 20px;
              font-weight: bold;
            }
            .Approved { background-color: #3A5B22; color: white; }
            .Rejected { background-color: #B7410E; color: white; }
            .Pending { background-color: #D69E5E; color: white; }
          </style>
        </head>
        <body>
          <h2>All Reservation Status Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Venue</th>
                <th>Date</th>
                <th>Activity</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reservations.map(r => `
                <tr>
                  <td>${r.organization || '—'}</td>
                  <td>${r.date}</td>
                  <td>${r.time || '—'}</td>
                  <td><span class="status-pill ${r.status}">${r.status}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>window.print();</script>
        </body>
      </html>
    `;
    summaryWindow.document.write(reportContent);
    summaryWindow.document.close();
  };

  return (
    <div className="records1-container">
      <h2 className="records1-title">All Reservation Status</h2>
      <div className="records1-table-wrapper">
        <table className="records1-table">
          <thead>
            <tr>
              <th>Requester</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td>{res.requester}</td>
                <td>{res.date}</td>
                <td>{res.time}</td>
                <td><span className={getStatusClass(res.status)}>{res.status}</span></td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() => navigate(`/reservation/${res.id}`)}
                  >
                    View Details
                  </button>
                </td>
                <td>
                  <img
                    src={fileIcon}
                    alt="Generate Report"
                    title="Generate Report"
                    className="file-icon"
                    onClick={() => generateReport(res)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="records1-actions">
        <button className="print-summary-btn" onClick={generateSummaryReport}>Print Summary</button>
        <button className="back-dashboard-btn" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </div>
    </div>
  );
};

export default Records1;
