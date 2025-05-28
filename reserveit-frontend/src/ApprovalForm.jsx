// ApprovalForm.jsx
import React from 'react';
import './ApprovalForm.css';

const ApprovalForm = ({ onClose }) => {
  return (
    <div className="approval-modal">
  <div className="approval-card">
    <div className="approval-header">
      <h3>Reservation Request (Approval)</h3>
    </div>

    <div className="approval-content">
      <div className="field">
        <label>Facility</label>
        <select>
          <option>Cabana 1</option>
          <option>Cabana 2</option>
          <option>Cabana 3</option>
          <option>Cabana 4</option>
          <option>Mess Hall</option>
        </select>
      </div>

      <div className="field">
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

      <div className="modal-actions">
        <button onClick={onClose} className="btn cancel">Cancel</button>
        <button className="btn reject">Reject</button>
        <button className="btn approve">Approve</button>
      </div>
    </div>
  </div>
</div>

  );
};

export default ApprovalForm;
