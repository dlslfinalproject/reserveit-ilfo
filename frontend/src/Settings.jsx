import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import trashLogo from "../src/assets/trash-icon.png";

const Settings = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState([]);
  const [newVenue, setNewVenue] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState(null);

  const apiUrl = "http://localhost/reserveit-ilfo/backend/api/venues.php";

  // Debug-friendly fetch wrapper
  const fetchWithDebug = async (url, options = {}) => {
    try {
      const res = await fetch(url, options);
      const text = await res.text();
      try {
        const json = JSON.parse(text);
        return json;
      } catch (err) {
        console.error("❌ Failed to parse JSON. Raw response:", text);
        throw new Error("Invalid JSON response");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchWithDebug(apiUrl, { credentials: "include" })
      .then((data) => {
        if (data.status === "success") {
          setVenues(data.data);
        } else {
          console.error("❌ Failed to fetch venues:", data.message);
        }
      })
      .catch((err) => console.error("❌ Error loading venues:", err));
  }, []);

  const handleAddVenue = () => {
    if (newVenue.trim() === "") return;

    fetchWithDebug(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        venue_name: newVenue,
        min_capacity: 1,
        max_capacity: 10,
        description: "",
      }),
    }).then((data) => {
      if (data.status === "success") {
        setVenues([...venues, data.data]);
        setNewVenue("");
        setShowAddPopup(false);
      } else {
        alert("Failed to add venue: " + data.message);
      }
    });
  };

  const handleSaveChanges = async () => {
    try {
      for (const venue of venues) {
        await fetchWithDebug(apiUrl, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            venue_id: venue.venue_id,
            venue_name: venue.venue_name,
            min_capacity: venue.min_capacity,
            max_capacity: venue.max_capacity,
            description: venue.description || "",
          }),
        });
      }
      setShowSavePopup(false);
      alert("Changes saved!");
    } catch (err) {
      alert("Error saving changes.");
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
      } else {
        alert("Failed to delete venue: " + data.message);
      }
      setShowDeletePopup(false);
      setVenueToDelete(null);
    });
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-header">
          <h2 className="settings-title">VENUE</h2>
        </div>

        <h3 className="edit-venues-title">Edit Venue</h3>

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
              />
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
        </div>

        <div className="button-group">
          <button className="back-button" onClick={() => navigate("/dashboard")}>
            Back
          </button>
          <button className="add-button" onClick={() => setShowAddPopup(true)}>
            Add Venue
          </button>
          <button className="save-button" onClick={() => setShowSavePopup(true)}>
            Save Changes
          </button>
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
            <div className="popup-buttons">
              <button className="cancel-button" onClick={() => setShowAddPopup(false)}>
                Cancel
              </button>
              <button className="confirm-add-button" onClick={handleAddVenue}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Save Confirmation */}
      {showSavePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Do you want to save these changes?</h3>
            <div className="popup-buttons">
              <button className="cancel-button" onClick={() => setShowSavePopup(false)}>
                No
              </button>
              <button className="confirm-add-button" onClick={handleSaveChanges}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeletePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Are you sure you want to delete this venue?</h3>
            <div className="popup-buttons">
              <button
                className="cancel-button"
                onClick={() => {
                  setShowDeletePopup(false);
                  setVenueToDelete(null);
                }}
              >
                No
              </button>
              <button className="confirm-add-button" onClick={handleDeleteVenueConfirmed}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
