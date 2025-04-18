// ReservationDetails.jsx
import React, { useState } from 'react';
import './App.css';
import { useNavigate } from 'react-router-dom';

const ReservationDetails = () => {
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate();

  // Placeholder structure only for fields, no default values
  const placeholder = {
    whoReserved: '',
    programName: '',
    activityNature: '',
    participants: '',
    date: '',
    time: '',
    poaLink: '',
    notes: ''
  };

  return (
    <div className="reservation-card">
      <div className="reservation-header-row">
        <h2>Reservation Details</h2>
        <div className="reservation-header-right">
          <span className="reservation-badge reservation-pending">Pending Application</span>
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
            <div className="reservation-field-value">{placeholder.whoReserved}</div>

            <div className="reservation-field-label">Name of Program:</div>
            <div className="reservation-field-value">{placeholder.programName}</div>

            <div className="reservation-field-label">Nature of Activity:</div>
            <div className="reservation-field-value">{placeholder.activityNature}</div>

            <div className="reservation-field-label">Number of Participants:</div>
            <div className="reservation-field-value">{placeholder.participants}</div>

            <div className="reservation-field-label">Date:</div>
            <div className="reservation-field-value">{placeholder.date}</div>

            <div className="reservation-field-label">Time:</div>
            <div className="reservation-field-value">{placeholder.time}</div>
          </div>
        ) : (
          <div className="reservation-poa-section">
            <div className="reservation-field-label">Program of Activities (Link):</div>
            <div className="reservation-link-box">{placeholder.poaLink}</div>

            <div className="reservation-field-label" style={{ marginTop: '1rem' }}>Notes:</div>
            <div className="reservation-note-box">{placeholder.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDetails;
