import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import TextField from '@mui/material/TextField';
import { useReservation } from './ReservationContext';
import './ReservationForm.css';

// Improved Time Picker Component using MUI
const CustomTimePicker = ({ label, value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <TimePicker
        label={label}
        value={value}
        onChange={onChange}
        ampm={true} // Use 24-hour format
        minutesStep={1}
        allowKeyboardControl
        openTo="hours"
        views={['hours', 'minutes']}
        slotProps={{
          textField: {
            fullWidth: true,
            size: 'small',
            error: !value,
            sx: {
              backgroundColor: '#fff',
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: value ? '#ccc' : '#d32f2f',
                },
              },
            },
          },
        }}
      />
    </LocalizationProvider>
  );
};


const ReservationForm = () => {
  const navigate = useNavigate();
  const { addReservation } = useReservation();

  const [formData, setFormData] = useState({
    whoReserved: '',
    numberOfParticipants: '',
    eventName: '',
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    natureOfActivity: '',
    customActivity: '',
    notes: '',
    poaLink: '',
  });

  const [errors, setErrors] = useState({});

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
  const newErrors = {};

  const requiredFields = [
    'whoReserved',
    'numberOfParticipants',
    'eventName',
    'startDate',
    'endDate',
    'startTime',
    'endTime',
  ];

  // Required fields check
  requiredFields.forEach((field) => {
    if (!formData[field]) {
      newErrors[field] = 'This field is required';
    }
  });

  const today = new Date();
const minStartDate = new Date();
const maxStartDate = new Date();

minStartDate.setDate(today.getDate() + 3);       // Minimum: 3 days from today
maxStartDate.setMonth(today.getMonth() + 1);     // Maximum: 1 month from today

if (
  formData.startDate < minStartDate ||
  formData.startDate > maxStartDate
) {
  alert('Reservation start date must be at least 3 days from today and no more than 1 month ahead.');
  return;
}


  // Activity field check
  if (!activity) {
    newErrors.natureOfActivity = 'Please specify nature of activity';
  }

  // Number of participants must be > 0
  const numParticipants = parseInt(formData.numberOfParticipants);
  if (isNaN(numParticipants) || numParticipants <= 0) {
    newErrors.numberOfParticipants = 'Invalid number of participants';
  }

  // Date logic
  if (formData.startDate && formData.endDate) {
    if (formData.startDate > formData.endDate) {
      newErrors.startDate = 'Start date must not be after end date';
      newErrors.endDate = 'End date must not be before start date';
    }
  }

  // Time logic (on the same date)
  if (
    formData.startDate &&
    formData.endDate &&
    formData.startTime &&
    formData.endTime &&
    formData.startDate.toDateString() === formData.endDate.toDateString()
  ) {
    const start = new Date(formData.startDate);
    start.setHours(formData.startTime.getHours(), formData.startTime.getMinutes());

    const end = new Date(formData.endDate);
    end.setHours(formData.endTime.getHours(), formData.endTime.getMinutes());

    if (start >= end) {
      newErrors.startTime = 'Start time must be before end time';
      newErrors.endTime = 'End time must be after start time';
    }
  }

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    return; // Block submission if errors exist
  }

  setFormData((prev) => ({ ...prev, natureOfActivity: activity }));
  setShowModal(true);
};


  const confirmSubmit = () => {
    const activity = isOtherSelected ? formData.customActivity : formData.natureOfActivity;

    const newReservation = {
      whoReserved: formData.whoReserved,
      eventName: formData.eventName,
      natureOfActivity: activity,
      numberOfParticipants: formData.numberOfParticipants,
      date: formData.date?.toLocaleDateString(),
     time: {
  start: formData.startTime?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // ✅ this makes it 12-hour format with AM/PM
  }),
  end: formData.endTime?.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true, // ✅
  }),
},

      notes: formData.notes,
      poaLink: formData.poaLink,
      venue: '', // if you’re adding venue later
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
              <input
                type="text"
                value={formData.whoReserved}
                onChange={(e) => handleChange('whoReserved', e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Event Name</label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => handleChange('eventName', e.target.value)}
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

<         div className="form-right">
            <div className="form-group">
              <label>Number of Participants</label>
              <input
                type="number"
                min="1"
                max="200"
                value={formData.numberOfParticipants}
                onChange={(e) => handleChange('numberOfParticipants', e.target.value)}
                className={errors.numberOfParticipants ? 'error' : ''} 
              />
              {errors.numberOfParticipants && <p className="error-message">{errors.numberOfParticipants}</p>}
            </div>

          <div className="form-right">
          <div className="form-group">
  <label>Start Date</label>
  <DatePicker
    selected={formData.startDate}
    onChange={(date) => handleChange('startDate', date)}
    dateFormat="MMMM d, yyyy"
     minDate={new Date(new Date().setDate(new Date().getDate() + 3))} // 3 days ahead
  maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))} // 1 month ahead
    placeholderText="Select start date"
    className="custom-datepicker"
  />
</div>

<div className="form-group">
  <label>End Date</label>
  <DatePicker
    selected={formData.endDate}
    onChange={(date) => handleChange('endDate', date)}
    dateFormat="MMMM d, yyyy"
    minDate={formData.startDate || new Date()}
    placeholderText="Select end date"
    className="custom-datepicker"
  />
</div>

<div className="form-group grid grid-cols-2 gap-4">
  <div>
    <label>Start Time</label>
    <CustomTimePicker
      value={formData.startTime}
      onChange={(time) => handleChange('startTime', time)}
    />
  </div>
  <div>
    <label>End Time</label>
    <CustomTimePicker
      value={formData.endTime}
      onChange={(time) => handleChange('endTime', time)}
    />
  </div>
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
        </div>
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
