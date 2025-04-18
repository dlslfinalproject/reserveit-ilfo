// src/pages/ReservationForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './App.css';
import { useReservation } from './ReservationContext';

const ReservationForm = () => {
  const navigate = useNavigate();
  const { addReservation } = useReservation();

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
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const activity = isOtherSelected ? formData.customActivity : formData.natureOfActivity;
    const requiredFields = [
      'whoReserved', 'numberOfParticipants', 'nameOfProgram', 'date', 'startTime', 'endTime'
    ];

    const hasEmpty = requiredFields.some(field => !formData[field]) || !activity;
    if (hasEmpty) {
      alert('Please fill out all required fields.');
      return;
    }

    setFormData(prev => ({ ...prev, natureOfActivity: activity })); // replace with custom if needed
    setShowModal(true);
  };

  const confirmSubmit = () => {
    const activity = isOtherSelected ? formData.customActivity : formData.natureOfActivity;

    const newReservation = {
      activity,
      date: formData.date?.toLocaleDateString(),
      venue: '',
      status: 'Pending'
    };

    addReservation(newReservation); // ✅ save to context

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
              <input type="text" value={formData.whoReserved} onChange={e => handleChange('whoReserved', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Name of Program</label>
              <input type="text" value={formData.nameOfProgram} onChange={e => handleChange('nameOfProgram', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Nature of Activity</label>
              <select value={formData.natureOfActivity} onChange={e => handleChange('natureOfActivity', e.target.value)}>
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
                  onChange={e => handleChange('customActivity', e.target.value)}
                />
              )}
            </div>

            <div className="form-group">
              <label>Notes (Optional)</label>
              <textarea value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Link of CSAO Approved POA (If Applicable)</label>
              <input type="text" value={formData.poaLink} onChange={e => handleChange('poaLink', e.target.value)} />
            </div>
          </div>

          <div className="form-right">
            <div className="form-group">
              <label>Number of Participants</label>
              <input type="number" value={formData.numberOfParticipants} onChange={e => handleChange('numberOfParticipants', e.target.value)} />
            </div>

            <div className="form-group">
              <label>Date</label>
              <DatePicker
                selected={formData.date}
                onChange={(date) => handleChange('date', date)}
                dateFormat="MMMM d, yyyy"
                placeholderText="Select date"
              />
            </div>

            <div className="form-group">
              <label>Start Time</label>
              <TimePicker
                value={formData.startTime}
                onChange={(value) => handleChange('startTime', value)}
                disableClock
              />
            </div>

            <div className="form-group">
              <label>End Time</label>
              <TimePicker
                value={formData.endTime}
                onChange={(value) => handleChange('endTime', value)}
                disableClock
              />
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="submit-button">SUBMIT</button>
        </div>
      </form>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>Do you want to submit this form?</p>
            <div className="modal-buttons">
              <button style={{ backgroundColor: '#969696' }} onClick={() => setShowModal(false)}>No</button>
              <button style={{ backgroundColor: '#D1DFBB' }} onClick={confirmSubmit}>Yes</button>
            </div>
          </div>
        </div>
      )}

      {popupMessage && (
        <div className="popup-success">
          {popupMessage}
        </div>
      )}
    </div>
  );
};

export default ReservationForm;
