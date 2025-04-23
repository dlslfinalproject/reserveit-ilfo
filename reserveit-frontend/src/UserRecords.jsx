// UserRecords.jsx
import React from 'react';
import './App.css';
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

  return (
    <div className="records-container">
      <div className="records-box">
        <h2 className="records-title">My Reservation</h2>
        <table className="records-table">
          <thead>
            <tr>
              <th>Venue</th>
              <th>Date</th>
              <th>Activity</th>
              <th>Status</th>
              <th></th>
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
                    onClick={() => navigate(`/reservation/${reservation.id}`, { state: { reservation } })}
                  >
                    View Details
                  </button>
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
