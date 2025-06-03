import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ApprovalSuccess.css';

const ApprovalSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const reservation_id = location.state?.reservation?.reservation_id;

  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [notes, setNotes] = useState('');
  const [venues, setVenues] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost/reserveit-ilfo/backend/api/venues.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setVenues(data.data);
        } else {
          console.error('Failed to fetch venues:', data.message);
        }
      })
      .catch((err) => {
        console.error('Error fetching venues:', err);
      });
  }, []);

  const handleApproveClick = () => {
    if (!selectedVenue) {
      setErrors({ venue: 'Please select a venue before approving.' });
      return;
    }
    setErrors({});
    setShowApproveConfirm(true);
  };

  const confirmApproval = () => {
    setErrors({});

    fetch('http://localhost/reserveit-ilfo/backend/api/approve_reservation.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        reservation_id: reservation_id,
        venue_id: selectedVenue,
        notes: notes
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          setShowApproveConfirm(false);
          setShowSuccessModal(true);
        } else {
          setErrors({ approval: data.message || 'Failed to approve reservation' });
          setShowApproveConfirm(false);
        }
      })
      .catch((err) => {
        console.error('Error approving reservation:', err);
        setErrors({ approval: 'An error occurred while approving the reservation.' });
        setShowApproveConfirm(false);
      });
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
            <label>Venue</label>
            <select
              value={selectedVenue}
              onChange={(e) => setSelectedVenue(e.target.value)}
            >
              <option value="">-- Select Venue --</option>
              {venues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>
                  {venue.venue_name}
                </option>
              ))}
            </select>
            {errors.venue && <small className="error-message">{errors.venue}</small>}
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

          {errors.approval && (
            <div className="form-group">
              <small className="error-message">{errors.approval}</small>
            </div>
          )}

          <div className="approval-actions">
            <button className="btn cancel" onClick={() => navigate('/admin/dashboard')}>Cancel</button>
            <button className="btn approve" onClick={handleApproveClick}>CONFIRM</button>
          </div>
        </div>
      </div>

      {showApproveConfirm && (
  <div className="modal-backdrop">
    <div className="modal-confirm">
      <p>Are you sure you want to approve this reservation?</p>
      <div className="modal-actions">
        <button className="btn cancel" onClick={cancelApproval}>Cancel</button>
        <button className="btn approve" onClick={confirmApproval}>APPROVE</button>
      </div>
    </div>
  </div>
)}


      {showSuccessModal && (
        <div className="modal-backdrop">
          <div className="modal-confirm">
            <h3 className="modal-title">Success</h3>
            <p>Reservation successfully approved!</p>
            <div className="modal-actions">
              <button
                className="btn approve"
                onClick={() => navigate('/admin/dashboard', { state: { refresh: true } })}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApprovalSuccess;
