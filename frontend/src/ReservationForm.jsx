"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import TextField from "@mui/material/TextField"
import "./ReservationForm.css"

const activityMap = {
  Assembly: 1,
  "Lasallian Formation": 2,
  "Master Class": 3,
  Meeting: 4,
  "Outreach Program": 5,
  "PE Class": 6,
  Recollection: 7,
  Seminar: 8,
  "Spiritual Formation": 9,
  "Team Building": 10,
  Training: 11,
}

const ReservationForm = () => {
  const navigate = useNavigate()

  const storedUser = JSON.parse(localStorage.getItem("user_data"))

  const [formData, setFormData] = useState({
    eventName: "",
    natureOfActivity: "",
    customActivity: "",
    numberOfParticipants: "",
    startDate: null,
    endDate: null,
    startTime: null,
    endTime: null,
    notes: "",
    poaLink: "",
  })

  const [errors, setErrors] = useState({})
  // Remove the message state and add modal states
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

const validate = () => {
  const newErrors = {}

  if (!formData.eventName.trim()) newErrors.eventName = "Required"

  if (!formData.natureOfActivity) {
    newErrors.natureOfActivity = "Select an activity"
  } else if (formData.natureOfActivity === "Others: Please specify" && !formData.customActivity.trim()) {
    newErrors.customActivity = "Specify the activity"
  }

  const num = Number.parseInt(formData.numberOfParticipants, 10)
  if (!num || num < 15) newErrors.numberOfParticipants = "Enter a valid number equal to or greater than 15"

  if (!formData.startDate) newErrors.startDate = "Start date required"
  if (!formData.endDate) newErrors.endDate = "End date required"

  if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
    newErrors.startDate = "Start date cannot be after end date"
    newErrors.endDate = "End date cannot be before start date"
  }

  if (!formData.startTime) newErrors.startTime = "Start time required"
  if (!formData.endTime) newErrors.endTime = "End time required"

  const minHour = 7
  const maxHour = 17

  if (formData.startTime) {
    const hour = formData.startTime.getHours()
    if (hour < minHour || hour >= maxHour) {
      newErrors.startTime = "Start time must be between 7:00 AM and 5:00 PM"
    }
  }

  if (formData.endTime) {
    const hour = formData.endTime.getHours()
    if (hour <= minHour || hour > maxHour) {
      newErrors.endTime = "End time must be between 7:00 AM and 5:00 PM"
    }
  }

  // Start time must be before end time (only if same day)
  if (
    formData.startDate &&
    formData.endDate &&
    formData.startTime &&
    formData.endTime &&
    formData.startDate.toDateString() === formData.endDate.toDateString()
  ) {
    const start = new Date(formData.startDate)
    start.setHours(formData.startTime.getHours(), formData.startTime.getMinutes())

    const end = new Date(formData.endDate)
    end.setHours(formData.endTime.getHours(), formData.endTime.getMinutes())

    if (start >= end) {
      newErrors.startTime = "Start time must be before end time"
      newErrors.endTime = "End time must be after start time"
    }
  }

  return newErrors
}

  // Modal close handlers
  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    setModalMessage("")
    navigate("/dashboard")
  }

  const handleErrorModalClose = () => {
    setShowErrorModal(false)
    setModalMessage("")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!storedUser) {
      setModalMessage("You must be logged in to submit a reservation.")
      setShowErrorModal(true)
      return
    }

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    const payload = {
      user_id: storedUser.id,
      event_name: formData.eventName.trim(),
      activity_id:
        formData.natureOfActivity === "Others: Please specify"
          ? null
          : activityMap[formData.natureOfActivity] || null,
      custom_activity_name:
        formData.natureOfActivity === "Others: Please specify"
          ? formData.customActivity.trim()
          : null,
      reservation_startdate: formData.startDate.toLocaleDateString("en-CA"),
reservation_enddate: formData.endDate.toLocaleDateString("en-CA"),
      number_of_participants: Number(formData.numberOfParticipants),
      start_time: formData.startTime.toTimeString().split(" ")[0],
      end_time: formData.endTime.toTimeString().split(" ")[0],
      notes: formData.notes.trim(),
      link_to_csao_approved_poa: formData.poaLink.trim(),
      venue_id: null, 
    }

    try {
      const response = await fetch(
        "http://localhost/reserveit-ilfo/backend/api/add_reservation.php",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()

      if (response.ok && data.success) {
        setModalMessage("Reservation submitted successfully!")
        setShowSuccessModal(true)
      } else {
        setModalMessage("Failed to submit reservation: " + (data.error || data.message || "Unknown error"))
        setShowErrorModal(true)
      }
    } catch (err) {
      setModalMessage("Error submitting reservation: " + err.message)
      setShowErrorModal(true)
    }
  }

  return (
    <div className="reservation-form-container">
      <h2 className="form-header">Create New Reservation</h2>

      <form onSubmit={handleSubmit} className="reservation-form">

        <div className="form-group">
          <label>Event Name:</label>
          <input
            type="text"
            value={formData.eventName}
            onChange={(e) => handleChange("eventName", e.target.value)}
            className={errors.eventName ? "error" : ""}
            placeholder="Name of the Event (ex: Taize Prayer)"
          />
          {errors.eventName && <small className="error-message">{errors.eventName}</small>}
        </div>

        <div className="form-group">
          <label>Nature of Activity:</label>
          <select
            value={formData.natureOfActivity}
            onChange={(e) => handleChange("natureOfActivity", e.target.value)}
            className={errors.natureOfActivity ? "error" : ""}
          >
            <option value="">Select activity</option>
            {Object.keys(activityMap).map((act) => (
              <option key={act}>{act}</option>
            ))}
            <option>Others: Please specify</option>
          </select>
          {errors.natureOfActivity && <small className="error-message">{errors.natureOfActivity}</small>}

          {formData.natureOfActivity === "Others: Please specify" && (
            <input
              type="text"
              placeholder="Specify activity"
              value={formData.customActivity}
              onChange={(e) => handleChange("customActivity", e.target.value)}
              className={errors.customActivity ? "error" : ""}
            />
          )}
          {errors.customActivity && <small className="error-message">{errors.customActivity}</small>}
        </div>

        <div className="form-group">
          <label>Number of Participants:</label>
          <input
            type="number"
            min="1"
            max="200"
            value={formData.numberOfParticipants}
            onChange={(e) => handleChange("numberOfParticipants", e.target.value)}
            className={errors.numberOfParticipants ? "error" : ""}
            placeholder="Enter Number of Participants (15-200)"
          />
          {errors.numberOfParticipants && <small className="error-message">{errors.numberOfParticipants}</small>}
        </div>

        <div className="form-group">
          <label>Start Date:</label>
          <DatePicker
            selected={formData.startDate}
            onChange={(date) => handleChange("startDate", date)}
            dateFormat="MMMM d, yyyy"
            minDate={new Date(new Date().setDate(new Date().getDate() + 3))}
            maxDate={new Date(new Date().setMonth(new Date().getMonth() + 1))}
            placeholderText="Select start date"
            className={`custom-datepicker ${errors.startDate ? "error" : ""}`}
          />
          {errors.startDate && <small className="error-message">{errors.startDate}</small>}
        </div>

        <div className="form-group">
          <label>End Date:</label>
          <DatePicker
            selected={formData.endDate}
            onChange={(date) => handleChange("endDate", date)}
            dateFormat="MMMM d, yyyy"
            minDate={formData.startDate || new Date()}
            placeholderText="Select end date"
            className={`custom-datepicker ${errors.endDate ? "error" : ""}`}
          />
          {errors.endDate && <small className="error-message">{errors.endDate}</small>}
        </div>

  
        <div className="form-group">
          <label>Start Time:</label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              value={formData.startTime}
              onChange={(time) => handleChange("startTime", time)}
              renderInput={(params) => <TextField {...params} error={!!errors.startTime} fullWidth />}
            />
          </LocalizationProvider>
          {errors.startTime && <small className="error-message">{errors.startTime}</small>}
        </div>

        <div className="form-group">
          <label>End Time:</label>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <TimePicker
              value={formData.endTime}
              onChange={(time) => handleChange("endTime", time)}
              renderInput={(params) => <TextField {...params} error={!!errors.endTime} fullWidth />}
            />
          </LocalizationProvider>
          {errors.endTime && <small className="error-message">{errors.endTime}</small>}
        </div>

        <div className="form-group">
          <label>Notes (Optional):</label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            placeholder="Additional notes or requests"
          />
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Submit Reservation
          </button>
        </div>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="popup-overlay">
          <div className="popup-content success-modal">
            <div className="modal-icon success-icon"></div>
            <p className="popup-message">{modalMessage}</p>
            <div className="popup-buttons">
              <button className="confirm-add-button" onClick={handleSuccessModalClose}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="popup-overlay">
          <div className="popup-content error-modal">
            <div className="modal-icon error-icon"></div>
            <h3>Error</h3>
            <p className="popup-message">{modalMessage}</p>
            <div className="popup-buttons">
              <button className="confirm-add-button" onClick={handleErrorModalClose}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReservationForm