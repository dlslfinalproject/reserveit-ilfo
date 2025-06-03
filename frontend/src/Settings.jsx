import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import trashLogo from "../src/assets/trash-icon.png";

const Settings = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [deletedVenues, setDeletedVenues] = useState([]);
  const [newVenue, setNewVenue] = useState("");
  const [minCapacity, setMinCapacity] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showDeletedVenues, setShowDeletedVenues] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [venueToDelete, setVenueToDelete] = useState(null);

  const apiUrl = "http://localhost/reserveit-ilfo/backend/api/venues.php";

  const fetchWithDebug = async (url, options = {}) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        return json;
      } catch (err) {
        console.error("Failed to parse JSON. Raw response:", text);
        throw new Error("Invalid JSON response");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      throw err;
    }
  };

  const showError = (message) => {
    setModalMessage(message);
    setShowErrorModal(true);
  };

  const showSuccess = (message) => {
    setModalMessage(message);
    setShowSuccessModal(true);
  };

  const fetchActiveVenues = () => {
    fetchWithDebug(apiUrl, { credentials: "include" })
      .then((data) => {
        if (data.status === "success") {
          setVenues(data.data);
        } else {
          console.error(" Failed to fetch venues:", data.message);
        }
      })
      .catch((err) => console.error("Error loading venues:", err));
  };

  // Fetch deleted venues
  const fetchDeletedVenues = () => {
    fetchWithDebug(apiUrl + "?show_deleted=1", { credentials: "include" })
      .then((data) => {
        if (data.status === "success") {
          setDeletedVenues(data.data);
        } else {
          console.error("Failed to fetch deleted venues:", data.message);
        }
      })
      .catch((err) => console.error("Error loading deleted venues:", err));
  };

  useEffect(() => {
    fetchActiveVenues();
    fetchDeletedVenues();
  }, []);

  const handleAddVenue = () => {
    const min = parseInt(minCapacity);
    const max = parseInt(maxCapacity);

    if (newVenue.trim() === "" || isNaN(min) || isNaN(max)) {
      showError("Please fill out all fields correctly.");
      return;
    }

    if (min < 1) {
      showError("Minimum capacity must be at least 1.");
      return;
    }

    if (max < min) {
      showError("Maximum capacity must be equal to or greater than minimum capacity.");
      return;
    }

    fetchWithDebug(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        venue_name: newVenue,
        min_capacity: parseInt(minCapacity),
        max_capacity: parseInt(maxCapacity),
      }),
    }).then((data) => {
      if (data.status === "success") {
        setVenues([...venues, data.data]);
        setNewVenue("");
        setMinCapacity("");
        setMaxCapacity("");
        setShowAddPopup(false);
        showSuccess("Venue added successfully!");
      } else {
        showError("Failed to add venue: " + data.message);
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      for (const venue of venues) {
        const min = parseInt(venue.min_capacity);
        const max = parseInt(venue.max_capacity);

        if (venue.venue_name.trim() === "" || isNaN(min) || isNaN(max)) {
          showError(`Please ensure all fields are filled for venue ID ${venue.venue_id}`);
          return;
        }

        if (min < 1) {
          showError(`Minimum capacity must be at least 1 for venue ID ${venue.venue_id}`);
          return;
        }

        if (max < min) {
          showError(`Maximum capacity must be equal to or greater than minimum for venue ID ${venue.venue_id}`);
          return;
        }

        await fetchWithDebug(apiUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            venue_id: venue.venue_id,
            venue_name: venue.venue_name,
            min_capacity: min,
            max_capacity: max,
          }),
        });
      }
      setShowSavePopup(false);
      showSuccess("Changes saved successfully!");
    } catch (err) {
      showError("Error saving changes.");
    }
  };

  const handleDeleteVenueConfirmed = () => {
    if (!venueToDelete) return;

    fetchWithDebug(apiUrl, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ venue_id: venueToDelete.venue_id }),
    }).then((data) => {
      if (data.status === "success") {
        setVenues(venues.filter((v) => v.venue_id !== venueToDelete.venue_id));
        // Add to deleted venues list
        setDeletedVenues([...deletedVenues, venueToDelete]);
        showSuccess("Venue removed successfully!");
      } else {
        showError("Failed to remove venue: " + data.message);
      }
      setShowDeletePopup(false);
      setVenueToDelete(null);
    });
  };

  const handleReactivateVenue = (venue) => {
    fetchWithDebug(apiUrl, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ venue_id: venue.venue_id }),
    }).then((data) => {
      if (data.status === "success") {
        // Remove from deleted venues and add to active venues
        setDeletedVenues(deletedVenues.filter((v) => v.venue_id !== venue.venue_id));
        setVenues([...venues, data.data]);
        showSuccess("Venue reactivated successfully!");
      } else {
        showError("Failed to reactivate venue: " + data.message);
      }
    });
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-header">
          <h2 className="settings-title">VENUE MANAGEMENT</h2>
        </div>

        <div className="settings-content">
          <h3 className="edit-venues-title">Edit Venues</h3>

          <div className="venue-list">
            {venues.map((venue, index) => (
              <div key={venue.venue_id || index} className="venue-item">
                <input
                  type="text"
                  className="venue-input"
                  value={venue.venue_name}
                  onChange={(e) => {
                    const updatedVenues = [...venues];
                    updatedVenues[index].venue_name = e.target.value;
                    setVenues(updatedVenues);
                  }}
                  placeholder="Enter venue name"
                />
                
                <div className="capacity-group">
                  <input
                    type="number"
                    className="venue-capacity-input"
                    value={venue.min_capacity}
                    onChange={(e) => {
                      const updatedVenues = [...venues];
                      updatedVenues[index].min_capacity = e.target.value;
                      setVenues(updatedVenues);
                    }}
                    placeholder="Min"
                    min={1}
                    title="Minimum Capacity"
                  />
                  <span className="capacity-separator">to</span>
                  <input
                    type="number"
                    className="venue-capacity-input"
                    value={venue.max_capacity}
                    onChange={(e) => {
                      const updatedVenues = [...venues];
                      updatedVenues[index].max_capacity = e.target.value;
                      setVenues(updatedVenues);
                    }}
                    placeholder="Max"
                    min={1}
                    title="Maximum Capacity"
                  />
                </div>

                <button
                  className="delete-venue-button"
                  onClick={() => {
                    setVenueToDelete(venue);
                    setShowDeletePopup(true);
                  }}
                  title="Delete Venue"
                >
                  <img src={trashLogo} alt="Delete" className="trash-icon" />
                </button>
              </div>
            ))}
            
            {venues.length === 0 && (
              <div className="no-venues-message">
                No venues found. Add your first venue below.
              </div>
            )}
          </div>

          {/* Deleted Venues Section */}
          {deletedVenues.length > 0 && (
            <div className="deleted-venues-section">
              <button
                className="toggle-deleted-button"
                onClick={() => setShowDeletedVenues(!showDeletedVenues)}
              >
                <span className="toggle-icon">{showDeletedVenues ? '▼' : '▶'}</span>
                {showDeletedVenues ? 'Hide' : 'Show'} Deleted Venues ({deletedVenues.length})
              </button>
              
              {showDeletedVenues && (
                <div className="deleted-venues-list">
                  <div className="deleted-venues-header">
                    <h4>Deleted Venues</h4>
                    <p>Click on any venue below to reactivate it</p>
                  </div>
                  {deletedVenues.map((venue) => (
                    <div 
                      key={venue.venue_id} 
                      className="deleted-venue-item"
                      onClick={() => handleReactivateVenue(venue)}
                      title="Click to reactivate this venue"
                    >
                      <div className="deleted-venue-info">
                        <span className="venue-name">{venue.venue_name}</span>
                        <span className="venue-capacity">({venue.min_capacity}-{venue.max_capacity} people)</span>
                      </div>
                      <button
                        className="reactivate-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReactivateVenue(venue);
                        }}
                      >
                        Reactivate
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="button-group">
            <button className="back-button" onClick={() => navigate("/dashboard")}>
              Back
            </button>
            <button className="add-button" onClick={() => setShowAddPopup(true)}>
              ADD VENUE
            </button>
            <button className="save-button" onClick={() => setShowSavePopup(true)}>
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>

      {/* Add Venue Popup */}
      {showAddPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Add New Venue</h3>
            <input
              type="text"
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              placeholder="Enter venue name"
              className="popup-input"
              autoFocus
            />
            <input
              type="number"
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              placeholder="Minimum capacity"
              className="popup-input"
              min={1}
            />
            <input
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              placeholder="Maximum capacity"
              className="popup-input"
              min={1}
            />
            <div className="add-venue-popup-buttons">
              <button
                className="cancel-button"
                onClick={() => {
                  setShowAddPopup(false);
                  setNewVenue("");
                  setMinCapacity("");
                  setMaxCapacity("");
                }}
              >
                Cancel
              </button>
              <button className="confirm-add-button" onClick={handleAddVenue}>
                ADD
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation */}
      {showSavePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Save Changes</h3>
            <p className="popup-message">
              Do you want to save all venue changes?
            </p>
            <div className="popup-buttons">
              <button className="cancel-button" onClick={() => setShowSavePopup(false)}>
                Cancel
              </button>
              <button className="confirm-add-button" onClick={handleSaveChanges}>
                SAVE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Delete Venue</h3>
            <p className="popup-message">
              Are you sure you want to delete <strong>{venueToDelete?.venue_name}</strong>?
            </p>
            <div className="popup-buttons">
              <button
                className="cancel-button"
                onClick={() => {
                  setShowDeletePopup(false);
                  setVenueToDelete(null);
                }}
              >
                Cancel
              </button>
              <button className="delete-confirm-button" onClick={handleDeleteVenueConfirmed}>
                DELETE
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="popup-overlay">
          <div className="popup-content error-modal">
            <div className="modal-icon error-icon">⚠️</div>
            <h3>Error</h3>
            <p className="popup-message">{modalMessage}</p>
            <div className="popup-buttons">
              <button className="confirm-add-button" onClick={() => setShowErrorModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
      {showSuccessModal && (
        <div className="popup-overlay">
          <div className="popup-content success-modal">
            <div className="modal-icon success-icon"></div>
            <h3>Success</h3>
            <p className="popup-message">{modalMessage}</p>
            <div className="popup-buttons">
              <button className="confirm-add-button" onClick={() => setShowSuccessModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;