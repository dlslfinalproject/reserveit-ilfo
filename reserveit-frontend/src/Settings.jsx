import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Settings.css'; // <-- We will style it separately for matching colors

const Settings = () => {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState(['Cabana 1', 'Cabana 2', 'Cabana 3', 'Cabana 4', 'Mess Hall']);
  const [newFacility, setNewFacility] = useState('');
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);

  const handleAddFacility = () => {
    if (newFacility.trim() !== '') {
      setFacilities([...facilities, newFacility]);
      setNewFacility('');
      setShowAddPopup(false);
    }
  };

  const handleSaveChanges = () => {
    setShowSavePopup(false);
    // Save logic (e.g., API call) can be added here
    alert('Changes saved!');
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">SETTINGS</h2>
        <h3 className="edit-facilities-title">EDIT FACILITIES</h3>

        <div className="facility-list">
          {facilities.map((facility, index) => (
            <input
              key={index}
              type="text"
              className="facility-input"
              value={facility}
              onChange={(e) => {
                const updatedFacilities = [...facilities];
                updatedFacilities[index] = e.target.value;
                setFacilities(updatedFacilities);
              }}
            />
          ))}
        </div>

        <div className="button-group">
          <button className="back-button" onClick={() => navigate('/dashboard')}>BACK</button>
          <button className="add-button" onClick={() => setShowAddPopup(true)}>ADD FACILITY</button>
          <button className="save-button" onClick={() => setShowSavePopup(true)}>SAVE CHANGES</button>
        </div>
      </div>

      {/* Add Facility Popup */}
      {showAddPopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Facility</h3>
            <input
              type="text"
              value={newFacility}
              onChange={(e) => setNewFacility(e.target.value)}
              placeholder="Enter new facility"
              className="popup-input"
            />
            <div className="popup-buttons">
              <button className="cancel-button" onClick={() => setShowAddPopup(false)}>CANCEL</button>
              <button className="confirm-add-button" onClick={handleAddFacility}>ADD</button>
            </div>
          </div>
        </div>
      )}

      {/* Save Changes Confirmation */}
      {showSavePopup && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Do you want to save these changes?</h3>
            <div className="popup-buttons">
              <button className="cancel-button" onClick={() => setShowSavePopup(false)}>NO</button>
              <button className="confirm-add-button" onClick={handleSaveChanges}>YES</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
