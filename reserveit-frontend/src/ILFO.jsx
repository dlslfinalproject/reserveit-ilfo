import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← import this
import './ILFO.css';

const ILFO = () => {
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate(); // ← initialize navigate

  return (
    <div className="ilfo-container">
      <div className="ilfo-header">
        <div>
          <h3>Taize Prayer</h3>
          <p className="ilfo-subtext">JPCS - jpcs@dlsl.edu.ph</p>
        </div>
        <span className="ilfo-status approved">Approved</span>
      </div>

      {/* Tabs */}
      <div className="ilfo-tabs">
        <button
          className={`ilfo-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`ilfo-tab ${activeTab === 'poa' ? 'active' : ''}`}
          onClick={() => setActiveTab('poa')}
        >
          Confirmed POA
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="ilfo-details">
          <div>
            <p className="ilfo-label">Who Reserved</p>
            <p className="ilfo-value">Junior Philippine Computer Society (JPCS)</p>
          </div>
          <div>
            <p className="ilfo-label">Number of Participants</p>
            <p className="ilfo-value">45</p>
          </div>
          <div>
            <p className="ilfo-label">Event Name</p>
            <p className="ilfo-value">Taize Prayer</p>
          </div>
          <div>
            <p className="ilfo-label">Date</p>
            <p className="ilfo-value">04/30/2025</p>
          </div>
          <div>
            <p className="ilfo-label">Nature of Activity</p>
            <p className="ilfo-value">Spiritual Formation</p>
          </div>
          <div>
            <p className="ilfo-label">Time</p>
            <p className="ilfo-value">1:00 PM – 3:00 PM</p>
          </div>
          <div>
            <p className="ilfo-label">Facility</p>
            <p className="ilfo-value">Cabana 1</p>
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

      {/* Back Button */}
      <div className="ilfo-back-button">
        <button className="btn back" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ILFO;
