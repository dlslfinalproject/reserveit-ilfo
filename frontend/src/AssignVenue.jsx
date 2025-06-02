import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← import this
import './AssignVenue.css';

const AssignVenue = () => {
  const [activeTab, setActiveTab] = useState('details');
  const navigate = useNavigate(); // ← initialize navigate

  return (
    <div className="assign-container">
      <div className="assign-header">
        <div>
          <h3>Taize Prayer</h3>
          <p className="assign-subtext">JPCS - jpcs@dlsl.edu.ph</p>
        </div>
        <span className="assign-status approved">Approved</span>
      </div>

      {/* Tabs */}
      <div className="assign-tabs">
        <button
          className={`assign-tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Details
        </button>
        <button
          className={`assign-tab ${activeTab === 'poa' ? 'active' : ''}`}
          onClick={() => setActiveTab('poa')}
        >
          Confirmed POA
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="assign-details">
          <div>
            <p className="assign-label">Who Reserved</p>
            <p className="assign-value">Junior Philippine Computer Society (JPCS)</p>
          </div>
          <div>
            <p className="assign-label">Number of Participants</p>
            <p className="assign-value">45</p>
          </div>
          <div>
            <p className="assign-label">Event Name</p>
            <p className="assign-value">Taize Prayer</p>
          </div>
          <div>
            <p className="assign-label">Date</p>
            <p className="assign-value">04/30/2025</p>
          </div>
          <div>
            <p className="assign-label">Nature of Activity</p>
            <p className="assign-value">Spiritual Formation</p>
          </div>
          <div>
            <p className="assign-label">Time</p>
            <p className="assign-value">1:00 PM – 3:00 PM</p>
          </div>
          <div>
            <p className="assign-label">Facility</p>
            <p className="assign-value">Cabana 1</p>
          </div>
        </div>
      )}

      {activeTab === 'poa' && (
        <div className="assign-poa">
          <div className="assign-label">Program Of Activities</div>
          <a
            className="assign-link"
            href="https://mail.google.com/mail/u/0/#sent/ktbxLvhkTVhmZfNvp5JPKcujpFvnIZTWWg"
            target="_blank"
            rel="noopener noreferrer"
          >
            📎 https://mail.google.com/mail/u/0/#sent/ktbxLvhkTVhmZfNvp5JPKcujpFvnIZTWWg
          </a>

          <div className="assign-label" style={{ marginTop: '20px' }}>Notes</div>
          <div className="assign-note-box">
            Good Day po! Need po namin ng mic and speaker for our activity. Thank You!
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="assign-back-button">
        <button className="btn back" onClick={() => navigate('/dashboard')}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AssignVenue;
