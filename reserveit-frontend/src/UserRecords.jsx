// UserRecords.jsx
import React from 'react';
import './ReservationDetails.css';
import { useNavigate } from 'react-router-dom';
import { useReservation } from './ReservationContext';

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

  return (
    <div className="records-container" style={{ backgroundColor: '#FFFFFF' }}>
      <div className="records-box" style={{ backgroundColor: '#F8F8F8' }}>
        <h2 className="records-title">My Reservation</h2>
        <table className="records-table">
          <thead>
            <tr>
              <th>Venue</th>
              <th>Date</th>
              <th>Activity</th>
              <th>Status</th>
              <th>Actions</th>
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
                  >
                    View Details
                  </button>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      generateReport(reservation);
                    }}
                    style={{
                      backgroundColor: '#DDE7C7',
                      color: '#111827',
                      fontWeight: 'bold',
                      borderRadius: '9999px',
                      padding: '10px 20px',
                      textDecoration: 'none',
                      marginLeft: '8px',
                      display: 'inline-block',
                    }}
                  >
                    Generate Report
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="back-button-wrapper">
          <button
            className="back-btn"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserRecords;
