import React, { useState } from 'react';
import './RequestForm.css';

const RequestForm = () => {
  const [activeTab, setActiveTab] = useState('details');

  return (
    <div className="request-container">
      <div className="request-card">
        <div className="request-header">
          <div>
            <h3>Taize Prayer</h3>
            <p>JPCS • jpcs@dlsl.edu.ph</p>
          </div>
          <div className="status-badge">Pending Application</div>
        </div>

        <div className="request-tabs">
          <button
            className={`tab ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`tab ${activeTab === 'poa' ? 'active' : ''}`}
            onClick={() => setActiveTab('poa')}
          >
            Confirmed POA
          </button>
        </div>

        {activeTab === 'details' && (
          <div className="request-details">
            <div className="request-row">
              <div className="label">Who Reserved</div>
              <div className="value">Junior Philippine Computer Society (JPCS)</div>
            </div>
            <div className="request-row">
              <div className="label">Number of Participants</div>
              <div className="value">45</div>
            </div>
            <div className="request-row">
              <div className="label">Event Name</div>
              <div className="value">Taize Prayer</div>
            </div>
            <div className="request-row">
              <div className="label">Date</div>
              <div className="value">04/30/2025</div>
            </div>
            <div className="request-row">
              <div className="label">Nature of Activity</div>
              <div className="value">Spiritual Formation</div>
            </div>
            <div className="request-row">
              <div className="label">Time</div>
              <div className="value">1:00 PM – 3:00 PM</div>
            </div>
          </div>
        )}

        {activeTab === 'poa' && (
          <div className="ilfo-poa">
            <div className="ilfo-label">Program Of Activities</div>
            <a
              className="ilfo-link"
              href="https://mail.google.com/mail/u/0/#sent/ktbxLvhkTVhmZfNvp5JPKcujpFvnIZTWWg"
              target="_blank"
              rel="noopener noreferrer"
            >
              📎 https://mail.google.com/mail/u/0/#sent/ktbxLvhkTVhmZfNvp5JPKcujpFvnIZTWWg
            </a>

            <div className="ilfo-label" style={{ marginTop: '20px' }}>Notes</div>
            <div className="ilfo-note-box">
              Good Day po! Need po namin ng mic and speaker for our activity. Thank You!
            </div>
          </div>
        )}

        {/* ACTION BUTTONS BELOW THE CARD CONTENT */}
        <div className="request-actions">
          <button className="btn cancel">Cancel</button>
          <button className="btn reject">Reject</button>
          <button className="btn confirm">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default RequestForm;
