import React, { useState } from 'react';
import './ReservationDetails.css';

const ReservationDetails = () => {
  const [activeTab, setActiveTab] = useState('details');

  // Placeholder data – to be replaced with real backend values later
  const placeholder = {
    whoReserved: '...',
    programName: '...',
    activityNature: '...',
    activityClassification: '...',
    participants: '...',
    date: '...',
    time: '...',
    poaLink: 'https://example.com',
    notes: '...'
  };

  return (
    <div className="reservation-card">
      <div className="header-row">
        <h2>Reservation Details</h2>
        <span className="badge pending">Pending Application</span>
      </div>

      <div className="tab-bar">
        <button
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`tab-button ${activeTab === 'poa' ? 'active' : ''}`}
          onClick={() => setActiveTab('poa')}
        >
          Confirmed POA
        </button>
      </div>

      <div className="tab-body">
        {activeTab === 'details' ? (
          <div className="details-grid">
            <div className="field-label">Who Reserved:</div>
            <div className="field-value">{placeholder.whoReserved}</div>

            <div className="field-label">Name of Program:</div>
            <div className="field-value">{placeholder.programName}</div>

            <div className="field-label">Nature of Activity:</div>
            <div className="field-value">{placeholder.activityNature}</div>

            <div className="field-label">Classification of Activity:</div>
            <div className="field-value">{placeholder.activityClassification}</div>

            <div className="field-label">Number of Participants:</div>
            <div className="field-value">{placeholder.participants}</div>

            <div className="field-label">Date:</div>
            <div className="field-value">{placeholder.date}</div>

            <div className="field-label">Time:</div>
            <div className="field-value">{placeholder.time}</div>
          </div>
        ) : (
          <div className="poa-section">
            <div className="field-label">Program of Activities:</div>
            <div className="link-box">{placeholder.poaLink}</div>

            <div className="field-label" style={{ marginTop: '1rem' }}>Notes:</div>
            <div className="note-box">{placeholder.notes}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservationDetails;
