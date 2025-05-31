import React, { useState } from 'react';
import './RejectionForm.css';

const RejectionForm = ({ onCancel, onReject }) => {
  const [reason, setReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);

  const handleRejectClick = () => {
    if (!reason) {
      alert("Please select a reason for rejection.");
      return;
    }
    setShowRejectConfirm(true);
  };

  const confirmRejection = () => {
    onReject(reason, otherReason);
    setShowRejectConfirm(false);
  };

  const cancelRejection = () => {
    setShowRejectConfirm(false);
  };

  return (
    <div className="approval-modal">
      <div className="rejection-form-wrapper">
        <div className="rejection-header">
          <h3>Reservation Request (Rejected)</h3>
        </div>

        <div className="rejection-form">
          <div className="form-group">
            <label htmlFor="reason">Reason</label>
            <select
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              <option value="">-- Select a reason --</option>
              <option value="Not aligned with POA">Not aligned with POA</option>
              <option value="Conflict with time/date/venue">Conflict with time/date/venue</option>
              <option value="Invalid date/time">Invalid date/time</option>
              <option value="Incomplete documents">Incomplete documents</option>
              <option value="Unacceptable rationale">Unacceptable rationale</option>
              <option value="Other">Other – Please specify below</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="otherReason">Other Reasons (if any)</label>
            <textarea
              id="otherReason"
              rows="4"
              value={otherReason}
              onChange={(e) => setOtherReason(e.target.value)}
              className="notes-box"
              placeholder="Enter additional reason here..."
            />
          </div>

          <div className="rejection-actions">
            <button className="btn cancel" onClick={onCancel}>Cancel</button>
            <button className="btn reject" onClick={handleRejectClick}>Reject</button>
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
