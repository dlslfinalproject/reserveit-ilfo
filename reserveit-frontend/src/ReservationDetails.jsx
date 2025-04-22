// ReservationDetails.jsx
import React, { useState } from 'react';
import './App.css';
import { useNavigate, useLocation } from 'react-router-dom';

const ReservationDetails = () => {
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();
  const location = useLocation();
  const reservation = location.state?.reservation || {};

  console.log('Loaded reservation:', reservation);

  if (!Object.keys(reservation).length) {
    return (
      <div className="reservation-card">
        <p>No reservation data found.</p>
        <button className="back-btn" onClick={() => navigate('/user-records')}>Back</button>
      </div>
    );
  }

  return (
    <div className="reservation-card">
      <div className="reservation-header-row">
        <h2>Reservation Details</h2>
        <div className="reservation-header-right">
          <span className={`reservation-badge reservation-${reservation.status?.toLowerCase()}`}>
            {reservation.status || 'Pending'}
          </span>
          <button className="reservation-close-button" onClick={() => navigate('/user-records')}>
            ×
          </button>
        </div>
      </div>

      <div className="reservation-tab-bar">
        <button
          className={`reservation-tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`reservation-tab-button ${activeTab === 'poa' ? 'active' : ''}`}
          onClick={() => setActiveTab('poa')}
        >
          Confirmed POA
        </button>
      </div>

      <div className="reservation-tab-body">
        {activeTab === 'details' ? (
          <div className="reservation-details-grid">
            <div className="reservation-field-label">Who Reserved:</div>
            <div className="reservation-field-value">{reservation.whoReserved}</div>

            <div className="reservation-field-label">Name of Program:</div>
            <div className="reservation-field-value">{reservation.nameOfProgram}</div>

            <div className="reservation-field-label">Nature of Activity:</div>
            <div className="reservation-field-value">{reservation.natureOfActivity}</div>

            <div className="reservation-field-label">Number of Participants:</div>
            <div className="reservation-field-value">{reservation.numberOfParticipants}</div>

            <div className="reservation-field-label">Date:</div>
            <div className="reservation-field-value">{reservation.date}</div>

            <div className="reservation-field-label">Time:</div>
            <div className="reservation-field-value">
              {reservation.time?.start} – {reservation.time?.end}
            </div>
          </div>
        ) : (
          <div className="reservation-poa-section">
            <div className="reservation-field-label">Program of Activities (Link):</div>
            <div className="reservation-link-box">{reservation.poaLink}</div>

            <div className="reservation-field-label" style={{ marginTop: '1rem' }}>Notes:</div>
            <div className="reservation-note-box">{reservation.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDetails;
