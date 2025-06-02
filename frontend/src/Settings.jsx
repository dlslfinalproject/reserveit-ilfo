"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Settings.css";
import trashLogo from "../src/assets/trash-icon.png"; // ✅ Make sure this path is correct

const Settings = () => {
  const navigate = useNavigate();
  const [venues, setVenues] = useState(["Cabana 1", "Cabana 2", "Cabana 3", "Cabana 4", "Mess Hall"]);
  const [newVenue, setNewVenue] = useState("");
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [venueToDeleteIndex, setVenueToDeleteIndex] = useState(null);

  const handleAddVenue = () => {
    if (newVenue.trim() !== "") {
      setVenues([...venues, newVenue]);
      setNewVenue("");
      setShowAddPopup(false);
    }
  };

  const handleSaveChanges = () => {
    setShowSavePopup(false);
    alert("Changes saved!");
  };

  const handleDeleteVenueConfirmed = () => {
    if (venueToDeleteIndex !== null) {
      const updatedVenues = venues.filter((_, index) => index !== venueToDeleteIndex);
      setVenues(updatedVenues);
      setVenueToDeleteIndex(null);
    }
    setShowDeletePopup(false);
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
            <div key={index} className="venue-item">
              <input
                type="text"
                className="venue-input"
                value={venue}
                onChange={(e) => {
                  const updatedVenues = [...venues];
                  updatedVenues[index] = e.target.value;
                  setVenues(updatedVenues);
                }}
              />
              <button
                className="delete-venue-button"
                onClick={() => {
                  setVenueToDeleteIndex(index);
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
                  setVenueToDeleteIndex(null);
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
