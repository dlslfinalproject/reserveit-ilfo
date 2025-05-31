import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useReservation } from './ReservationContext';
import './UserRecords.css'; // Make sure your CSS reflects the new layout

const UserRecords = () => {
  const navigate = useNavigate();
  const { reservations } = useReservation();

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Approved':
        return 'Approved';
      case 'Rejected':
        return 'Rejected';
      case 'Pending':
        return 'Pending';
      default:
        return '';
    }
  };

  return (
    <div className="records-wrapper">
      <h2 className="records-title">My Reservation</h2>

      <div className="table-container">
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
                  <span className={`status-pill ${getStatusStyle(reservation.status)}`}>
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="bottom-buttons">
        <button className="back-dashboard-btn" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default UserRecords;
