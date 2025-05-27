import React from 'react';
import './ReservationDetails.css';
import { useNavigate } from 'react-router-dom';
import { useReservation } from './ReservationContext';
import fileIcon from './assets/file-icon.png'; // Adjust path if needed

const UserRecords = () => {
  const navigate = useNavigate();
  const { reservations } = useReservation();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return { backgroundColor: '#3A5B22', color: 'white' };
      case 'Rejected':
        return { backgroundColor: '#B7410E', color: 'white' };
      case 'Pending':
        return { backgroundColor: '#D69E5E', color: 'white' };
      default:
        return {};
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
            .Approved {
              background-color: #3A5B22;
              color: white;
            }
            .Rejected {
              background-color: #B7410E;
              color: white;
            }
            .Pending {
              background-color: #D69E5E;
              color: white;
            }
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
    <div 
    className="records-container" style={{ backgroundColor: '#FFFFFF', border: '2px solid #4d4d4d', }}>
      <div className="records-box" style={{ backgroundColor: '#F8F8F8', borderRadius: '1rem', overflow: 'hidden',  }}>
        <h2
          className="records-title"
          style={{
            backgroundColor: '#D1DFBB',
            fontSize: '24px',
            fontWeight: 'bold',
            color: 'black',
            padding: '20px',
            margin: '0',
            borderBottom: '1px solid #4d4d4d'
          }}
        >
          My Reservation
        </h2>
        <table className="records-table" style={{ width: '100%', borderCollapse: 'collapse',  }}>
          <thead>
            <tr>
              <th style={{ width: '16.66%' }}>Venue</th>
              <th style={{ width: '16.66%' }}>Date</th>
              <th style={{ width: '16.66%' }}>Activity</th>
              <th style={{ width: '16.66%' }}>Status</th>
              <th style={{ width: '16.66%' }}>View</th>
              <th style={{ width: '16.66%' }}></th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((reservation) => (
              <tr key={reservation.id}>
                <td>{reservation.venue || '—'}</td>
                <td>{reservation.date}</td>
                <td>{reservation.natureOfActivity || '—'}</td>
                <td>
                  <span
                    className="status-pill"
                    style={getStatusStyle(reservation.status)}
                  >
                    {reservation.status}
                  </span>
                </td>
                <td>
                  <button
                    className="view-details-btn"
                    onClick={() =>
                      navigate(`/reservation/${reservation.id}`, {
                        state: { reservation },
                      })
                    }
                    style={{
                      padding: '6px 12px',
                      borderRadius: '12px',
                      border: '1px solid #ccc',
                      backgroundColor: '#fff',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    View Details
                  </button>
                </td>
                <td>
                  <img
                    src={fileIcon}
                    alt="Generate Report"
                    title="Generate Report"
                    onClick={(e) => {
                      e.preventDefault();
                      generateReport(reservation);
                    }}
                    style={{
                      width: '22px',
                      height: '22px',
                      cursor: 'pointer'
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Bottom Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '30px',
          gap: '12px'
        }}>
          <button
            onClick={generateSummaryReport}
            style={{
              backgroundColor: '#D1DFBB',
              color: '#111827',
              fontWeight: 'bold',
              borderRadius: '9999px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            Print Summary
          </button>

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              backgroundColor: '#E5E5E5',
              color: '#111827',
              fontWeight: 'bold',
              borderRadius: '9999px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer',
              border: 'none'
            }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRecords;
