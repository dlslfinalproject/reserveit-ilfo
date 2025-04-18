// src/pages/ReservationForm.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// Removed react-time-picker
import './App.css';

// NEW: MUI TimePicker
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

// Improved Time Picker Component using MUI
const CustomTimePicker = ({ label, value, onChange }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TimePicker
          value={value}
          onChange={(newValue) => onChange(newValue)}
          renderInput={(params) => (
            <TextField
            {...params}
            fullWidth
            size="small"
            error={!value}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: value ? '#ccc' : '#d32f2f', // Use red only if value is empty
                },
              },
            }}
          />
          )}
          PopperProps={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 10],
                },
              },
            ],
            sx: {
              zIndex: 1300, // High enough to appear above modals
            },
          }}
        />
      </LocalizationProvider>
    </div>
  );
};


const ReservationForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    whoReserved: '',
    numberOfParticipants: '',
    nameOfProgram: '',
    date: null,
    startTime: '',
    endTime: '',
    natureOfActivity: '',
    customActivity: '',
    notes: '',
    poaLink: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');

  const isOtherSelected = formData.natureOfActivity === 'Others: Please specify';

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activity = isOtherSelected ? formData.customActivity : formData.natureOfActivity;

    const requiredFields = [
      'whoReserved',
      'numberOfParticipants',
      'nameOfProgram',
      'date',
      'startTime',
      'endTime',
    ];

    const hasEmpty = requiredFields.some((field) => !formData[field]) || !activity;
    if (hasEmpty) {
      alert('Please fill out all required fields.');
      return;
    }

    setFormData((prev) => ({ ...prev, natureOfActivity: activity }));
    setShowModal(true);
  };

  const confirmSubmit = () => {
    setShowModal(false);
    setPopupMessage('ReserveIT!');
    setTimeout(() => {
      setPopupMessage('');
      navigate('/dashboard');
    }, 1500);
  };

  return (
    <div className="reservation-form-container">
      <h2 className="form-header">Create New Reservation</h2>
      <form className="reservation-form" onSubmit={handleSubmit}>
        <div className="form-columns">
          <div className="form-left">
            <div className="form-group">
              <label>Who Reserved</label>
              <input
                type="text"
                value={formData.whoReserved}
                onChange={(e) => handleChange('whoReserved', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Name of Program</label>
              <input
                type="text"
                value={formData.nameOfProgram}
                onChange={(e) => handleChange('nameOfProgram', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Nature of Activity</label>
              <select
                value={formData.natureOfActivity}
                onChange={(e) => handleChange('natureOfActivity', e.target.value)}
              >
                <option value="">Select activity</option>
                <option>Assembly</option>
                <option>Lasallian Formation</option>
                <option>Master Class</option>
                <option>Meeting</option>
                <option>Outreach Program</option>
                <option>PE Class</option>
                <option>Recollection</option>
                <option>Seminar</option>
                <option>Spiritual Formation</option>
                <option>Team Building</option>
                <option>Training</option>
                <option>Others: Please specify</option>
              </select>
              {isOtherSelected && (
                <input
                  type="text"
                  placeholder="Please specify"
                  value={formData.customActivity}
                  onChange={(e) => handleChange('customActivity', e.target.value)}
                />
              )}
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Link of CSAO Approved POA (If Applicable)</label>
              <input
                type="text"
                value={formData.poaLink}
                onChange={(e) => handleChange('poaLink', e.target.value)}
              />
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label>Number of Participants</label>
              <input
                type="number"
                value={formData.numberOfParticipants}
                onChange={(e) => handleChange('numberOfParticipants', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <DatePicker
                selected={formData.date}
                onChange={(date) => handleChange('date', date)}
                dateFormat="MMMM d, yyyy"
                customInput={
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '8px 12px',
                      cursor: 'pointer',
                      backgroundColor: '#fff',
                    }}
                  >
                    <span>{formData.date ? formData.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : ''}</span>
                    <span role="button" aria-label="Pick date">📅</span>
                  </div>
                }
              />
            </div>

            <CustomTimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(val) => handleChange('startTime', val)}
            />

            <CustomTimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(val) => handleChange('endTime', val)}
            />
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            SUBMIT
          </button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Do you want to submit this form?</p>
            <div className="modal-buttons">
              <button style={{ backgroundColor: '#969696' }} onClick={() => setShowModal(false)}>
                No
              </button>
              <button style={{ backgroundColor: '#D1DFBB' }} onClick={confirmSubmit}>
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {popupMessage && <div className="popup-success">{popupMessage}</div>}
    </div>
  );
};

export default ReservationForm;
