import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './RejectionForm.css';

const SuccessModal = ({ message, onClose }) => {
  return (
    <div className="success-modal-backdrop">
      <div className="success-modal">
        <p>{message}</p>
        <button className="success-button" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

const RejectionForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const reservation_id = location.state?.reservation?.reservation_id;

  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState({});
  const [rejectionReasons, setRejectionReasons] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!reservation_id) {
      navigate('/admin/reservation-records');
    }
  }, [reservation_id, navigate]);

  useEffect(() => {
    fetch('http://localhost/reserveit-ilfo/backend/api/get_rejection_reasons.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch rejection reasons');
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setRejectionReasons(data.reasons);
        } else {
          setErrors({ fetch: 'Failed to load rejection reasons.' });
        }
      })
      .catch((error) => {
        console.error('Error fetching rejection reasons:', error);
        setErrors({ fetch: 'Failed to load rejection reasons.' });
      });
  }, []);

  const handleRejectClick = () => {
    if (!selectedReason) {
      setErrors({ reason: "Please select a reason for rejection." });
      return;
    }
    setErrors({});
    setShowRejectConfirm(true);
  };

  const confirmRejection = async () => {
    setErrors({});
    try {
      const response = await fetch('http://localhost/reserveit-ilfo/backend/api/reject_reservation.php', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reservation_id,
          rejection_reason_id: selectedReason,
          rejection_other_notes: notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setShowRejectConfirm(false);
        setShowSuccess(true);
      } else {
        setErrors({ rejection: data.message || 'Failed to reject reservation.' });
        setShowRejectConfirm(false);
      }
    } catch (error) {
      setErrors({ rejection: 'An error occurred while rejecting the reservation.' });
      setShowRejectConfirm(false);
    }
  };

  const cancelRejection = () => {
    setShowRejectConfirm(false);
  };

  if (!reservation_id) return null;

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
              {rejectionReasons.map((reason) => (
                <option key={reason.reason_id} value={reason.reason_id}>
                  {reason.reason_description}
                </option>
              ))}
            </select>
            {errors.reason && <small className="error-message">{errors.reason}</small>}
            {errors.fetch && <small className="error-message">{errors.fetch}</small>}
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
            <button className="btn cancel" onClick={() => navigate('/admin')}>Cancel</button>
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

      {showSuccess && (
        <SuccessModal
          message="Reservation has been rejected."
          onClose={() => {
            setShowSuccess(false);
            navigate('/admin');
          }}
        />
      )}
    </div>
  );
};

export default RejectionForm;