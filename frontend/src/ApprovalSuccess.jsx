import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ApprovalForm.css';

const ApprovalSuccess = () => {
  const navigate = useNavigate();
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [notes, setNotes] = useState('');

  const handleApproveClick = () => {
    setShowApproveConfirm(true);
  };

  const confirmApproval = () => {
    // Placeholder for submitting to backend
    console.log('Venue:', selectedVenue);
    console.log('Admin Notes:', notes);

    alert('Reservation has been approved.');
    setShowApproveConfirm(false);
    navigate('/admin/dashboard');
  };

  const cancelApproval = () => {
    setShowApproveConfirm(false);
  };

  return (
    <div className="approval-modal">
      <div className="approval-form-wrapper">
        <div className="approval-header">Reservation Request (Approval)</div>

        <div className="approval-form">
          <div className="form-group">
            <label>Facility</label>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
            >
              <option value="">-- Select Venue --</option>
              {/* Options will be added dynamically via backend fetch in future */}
            </select>
          </div>

          <div className="form-group">
            <label>NOTES (optional)</label>
            <textarea
              className="notes-input"
              rows="5"
              placeholder="Enter notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="approval-actions">
            <button className="btn cancel" onClick={() => navigate('/admin/dashboard')}>Cancel</button>
            <button className="btn approve" onClick={handleApproveClick}>Approve</button>
          </div>
        </div>
      </div>

      {showApproveConfirm && (
        <div className="modal-backdrop">
          <div className="modal-confirm">
            <p>Are you sure you want to approve this reservation?</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={cancelApproval}>No</button>
              <button className="btn approve" onClick={confirmApproval}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalSuccess;
