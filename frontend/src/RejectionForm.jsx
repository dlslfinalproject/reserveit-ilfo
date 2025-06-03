import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RejectionForm.css';

const RejectionForm = () => {
  const navigate = useNavigate();
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});

  const handleRejectClick = () => {
    if (!selectedReason) {
      setErrors({ reason: "Please select a reason for rejection." });
      return;
    }
    setErrors({}); // Clear any previous errors
    setShowRejectConfirm(true);
  };

  const confirmRejection = () => {
    // Clear previous errors
    setErrors({});
    
    // Placeholder: send data to backend
    console.log("Rejection reason:", selectedReason);
    console.log("Notes:", notes);

    // You can replace this with actual API call and error handling
    try {
      // Example: Replace with actual API call
      // const response = await fetch('/api/reject-reservation', { ... });
      // if (!response.ok) throw new Error('Failed to reject reservation');
      
      alert("Reservation has been rejected.");
      setShowRejectConfirm(false);
      navigate('/admin/dashboard');
    } catch (error) {
      setErrors({ rejection: 'An error occurred while rejecting the reservation.' });
      setShowRejectConfirm(false);
    }
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
            {errors.reason && <small className="error-message">{errors.reason}</small>}
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

          {errors.rejection && (
            <div className="form-group">
              <small className="error-message">{errors.rejection}</small>
            </div>
          )}

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