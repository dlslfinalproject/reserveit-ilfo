import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './ApprovalForm.css';

const ApprovalSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { reservationId } = location.state || {};

  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState('');
  const [notes, setNotes] = useState('');
  const [venues, setVenues] = useState([]);

  // Fetch active venues on component mount
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
      alert('Please select a venue before approving.');
      return;
    }
    setShowApproveConfirm(true);
  };

  const confirmApproval = () => {
    fetch('http://localhost/reserveit-ilfo/backend/api/get_approval_status.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        reservation_id: reservationId,
        venue_id: selectedVenue,
        admin_notes: notes,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status === 'success') {
          alert('Reservation has been approved.');
          navigate('/admin/dashboard', { state: { refresh: true } });
        } else {
          alert('Failed to approve reservation: ' + data.message);
        }
      })
      .catch((err) => {
        console.error('Error approving reservation:', err);
        alert('An error occurred while approving the reservation.');
      });

    setShowApproveConfirm(false);
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
              {venues.map((venue) => (
                <option key={venue.venue_id} value={venue.venue_id}>
                  {venue.venue_name}
                </option>
              ))}
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
            <button className="btn approve" onClick={handleApproveClick}>CONFIRM</button>
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
