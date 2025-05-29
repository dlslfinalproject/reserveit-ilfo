import React, { useState } from 'react';
import './RequestForm.css';
import ApprovalForm from './ApprovalForm';
import RejectionForm from './RejectionForm';

const RequestForm = () => {
  const [activeTab, setActiveTab] = useState('details');
  const [showApprovalForm, setShowApprovalForm] = useState(false);
  const [showRejectionForm, setShowRejectionForm] = useState(false);
  const [showRejectConfirmation, setShowRejectConfirmation] = useState(false);

  const handleRejectionSubmit = (reason, other) => {
    console.log('Rejected with reason:', reason, 'Other:', other);
    setShowRejectionForm(false);
    setShowRejectConfirmation(true);
  };

  const confirmRejection = () => {
    setShowRejectConfirmation(false);
    alert('Reservation has been rejected.');
    // Add backend logic here if needed
  };

  return (
    <div className="request-container">
      <div className="request-card">
        {/* Header */}
        <div className="request-header">
          <div>
            <h3>Taize Prayer</h3>
            <p>JPCS • jpcs@dlsl.edu.ph</p>
          </div>
          <div className="status-badge">Pending Application</div>
        </div>

        {/* Tabs */}
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

        {/* Details Tab */}
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

        {/* POA Tab */}
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

            <div className="ilfo-label" style={{ marginTop: '20px' }}>
              Notes
            </div>
            <div className="ilfo-note-box">
              Good Day po! Need po namin ng mic and speaker for our activity. Thank You!
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="request-actions">
          <button className="btn cancel">Cancel</button>
          <button className="btn reject" onClick={() => setShowRejectionForm(true)}>
            Reject
          </button>
          <button className="btn confirm" onClick={() => setShowApprovalForm(true)}>
            Confirm
          </button>
        </div>
      </div>

      {/* Modal: Approval Form */}
      {showApprovalForm && (
        <div className="modal-backdrop">
          <ApprovalForm onClose={() => setShowApprovalForm(false)} />
        </div>
      )}

      {/* Modal: Rejection Form */}
      {showRejectionForm && (
        <div className="modal-backdrop">
          <RejectionForm
            onCancel={() => setShowRejectionForm(false)}
            onReject={handleRejectionSubmit}
          />
        </div>
      )}

      {/* Modal: Reject Confirmation */}
      {showRejectConfirmation && (
        <div className="modal-backdrop">
          <div className="modal-confirm">
            <p>Do you want to reject this reservation?</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={() => setShowRejectConfirmation(false)}>
                No
              </button>
              <button className="btn confirm" onClick={confirmRejection}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestForm;
