import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RejectionForm.css';

const RejectionForm = () => {
  const navigate = useNavigate();
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');

  const handleRejectClick = () => {
    if (!selectedReason) {
      alert("Please select a reason for rejection.");
      return;
    }
    setShowRejectConfirm(true);
  };

  const confirmRejection = () => {
    // Placeholder: send data to backend
    console.log("Rejection reason:", selectedReason);
    console.log("Notes:", notes);

    alert("Reservation has been rejected.");
    setShowRejectConfirm(false);
    navigate('/admin/dashboard');
  };

  const cancelRejection = () => {
    setShowRejectConfirm(false);
  };

  return (
    <div className="approval-modal">
      <div className="approval-form-wrapper">
        <div className="approval-header">Reservation Request (Rejection)</div>

        <div className="approval-form">
          <div className="form-group">
            <label>Reason for Rejection</label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
            >
              <option value="">-- Select Reason --</option>
              {/* Options will be dynamically loaded */}
            </select>
          </div>

          <div className="form-group">
            <label>NOTES (optional)</label>
            <textarea
              className="notes-box"
              rows="5"
              placeholder="Enter notes here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="approval-actions">
            <button className="btn cancel" onClick={() => navigate('/admin/dashboard')}>Cancel</button>
            <button className="btn reject" onClick={handleRejectClick}>REJECT</button>
          </div>
        </div>
      </div>

      {showRejectConfirm && (
        <div className="modal-backdrop">
          <div className="modal-confirm">
            <p>Are you sure you want to reject this reservation?</p>
            <div className="modal-actions">
              <button className="btn cancel" onClick={cancelRejection}>No</button>
              <button className="btn reject" onClick={confirmRejection}>Yes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RejectionForm;
