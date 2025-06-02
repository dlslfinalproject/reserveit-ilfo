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
    whoReserved: "",
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
  const [message, setMessage] = useState("")

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

const validate = () => {
  const newErrors = {}

  if (!formData.whoReserved.trim()) newErrors.whoReserved = "Required"
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

  // Time range limits: 7:00 AM to 5:00 PM
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

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!storedUser) {
      setMessage("You must be logged in to submit a reservation.")
      return
    }

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    // Prepare payload exactly matching PHP expected keys
    const payload = {
      user_id: storedUser.id,
      who_reserved: formData.whoReserved.trim(),
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
      venue_id: null, // Adjust or remove if needed
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
        setMessage("Reservation submitted successfully!")
        setTimeout(() => {
          setMessage("")
          navigate("/dashboard")
        }, 2000)
      } else {
        setMessage("Failed to submit reservation: " + (data.error || data.message || "Unknown error"))
      }
    } catch (err) {
      setMessage("Error submitting reservation: " + err.message)
    }
  }

  return (
    <div className="reservation-form-container">
      <h2 className="form-header">Create New Reservation</h2>

      <form onSubmit={handleSubmit} className="reservation-form">
        {/* ... The rest of your form inputs remain the same ... */}

        {/* Who Reserved */}
        <div className="form-group">
          <label>Who Reserved:</label>
          <input
            type="text"
            value={formData.whoReserved}
            onChange={(e) => handleChange("whoReserved", e.target.value)}
            className={errors.whoReserved ? "error" : ""}
            placeholder="First Name MI. Last Name (ex: Juan D. Cruz)"
          />
          {errors.whoReserved && <small className="error-message">{errors.whoReserved}</small>}
        </div>

        {/* Event Name */}
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

        {/* Nature of Activity */}
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

        {/* Number of Participants */}
        <div className="form-group">
          <label>Number of Participants:</label>
          <input
            type="number"
            min="1"
            max="200"
            value={formData.numberOfParticipants}
            onChange={(e) => handleChange("numberOfParticipants", e.target.value)}
            className={errors.numberOfParticipants ? "error" : ""}
            placeholder="Enter Number of Participants (1-200)"
          />
          {errors.numberOfParticipants && <small className="error-message">{errors.numberOfParticipants}</small>}
        </div>

        {/* Dates and times (same as your original) */}
        {/* Start Date */}
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

        {/* End Date */}
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

        {/* Start Time */}
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

        {/* End Time */}
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

        {/* Notes */}
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

      {message && <div className="form-message">{message}</div>}
    </div>
  )
}

export default ReservationForm
