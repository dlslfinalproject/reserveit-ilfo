import React, { useState } from 'react';
import './ApprovalForm.css';

const ApprovalForm = ({ onClose }) => {
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const handleApproveClick = () => {
    setShowApproveConfirm(true); 
  };

  const confirmApproval = () => {
    setShowApproveConfirm(false);
    setShowSuccessPopup(true); // show "ReserveIT!" popup
    setTimeout(() => {
      setShowSuccessPopup(false);
      onClose(); // close modal after a short delay
    }, 1500); // adjust delay as needed
  };

  const cancelApproval = () => {
    setShowApproveConfirm(false); 
  };

  return (
    <div className="approval-modal">
      <div className="approval-form-wrapper">
        <div className="approval-header">
          Reservation Request (Approval)
        </div>

        <div className="approval-form">
          <div className="form-group">
            <label>Facility</label>
            <select>
              <option>Cabana 1</option>
              <option>Cabana 2</option>
              <option>Cabana 3</option>
              <option>Cabana 4</option>
              <option>Mess Hall</option>
            </select>
          </div>

          <div className="form-group">
            <label>NOTES (optional)</label>
            <div className="notes-box">
              <ol>
                <li>Practice CLAYGO.</li>
                <li>Be mindful of other participants in the Retreat Complex using the facilities.</li>
                <li>Do not leave things unattended. We are not liable for any loss or damage to your things.</li>
                <li>Do not damage the facility.</li>
                <li>Complete your activities within your reserved time.</li>
              </ol>
            </div>
          </div>

          <div className="approval-actions">
            <button onClick={onClose} className="btn cancel">Cancel</button>
            <button className="btn reject">Reject</button>
            <button className="btn approve" onClick={handleApproveClick}>Approve</button>
          </div>
        </div>
      </div>

      {/* Approve Confirmation Prompt */}
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

      {/* ✅ ReserveIT Popup */}
      {showSuccessPopup && (
        <div className="reserveit-popup">
          <p><strong>ReserveIT!</strong></p>
        </div>
      )}
    </div>
  );
};

export default ApprovalForm;
