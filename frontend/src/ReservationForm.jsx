"use client"

import { act, useState } from "react"
import { useNavigate } from "react-router-dom"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import TextField from "@mui/material/TextField"
import "./ReservationForm.css"

const activityMap = {
  "Assembly": 1,
  "Lasallian Formation": 2,
  "Master Class": 3,
  "Meeting": 4,
  "Outreach Program": 5,
  "PE Class": 6,
  "Recollection": 7,
  "Seminar": 8,
  "Spiritual Formation": 9,
  "Team Building": 10,
  "Training": 11,
}

const ReservationForm = () => {
  const navigate = useNavigate()

  // Load logged-in user data from localStorage
  const storedUser = JSON.parse(localStorage.getItem("user_data"))
  // You can optionally check if user exists and redirect if not logged in

  // State for form fields
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

  // Validation errors state
  const [errors, setErrors] = useState({})

  // For showing feedback messages
  const [message, setMessage] = useState("")

  // Handle field changes
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Validate all inputs and return errors object
  const validate = () => {
    const newErrors = {}

    if (!formData.whoReserved.trim()) newErrors.whoReserved = "Required"
    if (!formData.eventName.trim()) newErrors.eventName = "Required"

    // Activity validation (handle "Others")
    if (!formData.natureOfActivity) newErrors.natureOfActivity = "Select an activity"
    else if (formData.natureOfActivity === "Others: Please specify" && !formData.customActivity.trim())
      newErrors.customActivity = "Specify the activity"

    // Number of participants validation
    const num = Number.parseInt(formData.numberOfParticipants, 10)
    if (!num || num <= 0) newErrors.numberOfParticipants = "Enter a valid number > 0"

    // Dates validation
    if (!formData.startDate) newErrors.startDate = "Start date required"
    if (!formData.endDate) newErrors.endDate = "End date required"

    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
      newErrors.startDate = "Start date cannot be after end date"
      newErrors.endDate = "End date cannot be before start date"
    }

    // Time validation
    if (!formData.startTime) newErrors.startTime = "Start time required"
    if (!formData.endTime) newErrors.endTime = "End time required"

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

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!storedUser) {
      setMessage("You must be logged in to submit a reservation.")
      return
    }

    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      return // Stop submission if errors
    }

    // Prepare payload
    const payload = {
      user_id: storedUser.id, // <-- use stored user ID here
      who_reserved: formData.whoReserved.trim(),
      event_name: formData.eventName.trim(),
      activity_id:
        formData.natureOfActivity === "Others: Please specify"
          ? null
          : activityMap[formData.natureOfActivity] || null,
      customActivity: 
        formData.natureOfActivity === "Others: Please specify" 
        ? formData.customActivity.trim() : "",
      reservation_startdate: formData.startDate.toISOString().split("T")[0],
      reservation_enddate: formData.endDate.toISOString().split("T")[0],
      number_of_participants: Number(formData.numberOfParticipants),
      start_time: formData.startTime.toTimeString().split(" ")[0],
      end_time: formData.endTime.toTimeString().split(" ")[0],
      notes: formData.notes.trim(),
      link_to_csao_approved_poa: formData.poaLink.trim(),

    }

    try {
      const response = await fetch("http://localhost/reserveit-ilfo/backend/api/add_reservation.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setMessage("Reservation submitted successfully!")
        setTimeout(() => {
          setMessage("")
          navigate("/dashboard") // Redirect after success
        }, 2000)
      } else {
        setMessage("Failed to submit reservation: " + (data.message || "Unknown error"))
      }
    } catch (err) {
      setMessage("Error submitting reservation: " + err.message)
    }
  }

  return (
    <div className="reservation-form-container">
      <h2 className="form-header">Create New Reservation</h2>

      <form onSubmit={handleSubmit} className="reservation-form">
        <div className="form-columns">
          <div className="form-left">
            <div className="form-group">
              <label>Who Reserved:</label>
              <input
                type="text"
                value={formData.whoReserved}
                onChange={(e) => handleChange("whoReserved", e.target.value)}
                className={errors.whoReserved ? "error" : ""}
              />
              {errors.whoReserved && <small className="error-message">{errors.whoReserved}</small>}
            </div>

            <div className="form-group">
              <label>Event Name:</label>
              <input
                type="text"
                value={formData.eventName}
                onChange={(e) => handleChange("eventName", e.target.value)}
                className={errors.eventName ? "error" : ""}
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
              />
              {errors.numberOfParticipants && <small className="error-message">{errors.numberOfParticipants}</small>}
            </div>
          </div>

          <div className="form-right">
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

            <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="form-group">
              <label>Notes:</label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                placeholder="Additional notes (optional)"
              />
            </div>

            <div className="form-group">
              <label>Proof of Activity Link (POA Link):</label>
              <input
                type="text"
                value={formData.poaLink}
                onChange={(e) => handleChange("poaLink", e.target.value)}
                placeholder="URL to POA"
              />
            </div>
          </div>
        </div>

        <div className="form-buttons">
          <button type="button" className="cancel-button" onClick={() => navigate("/dashboard")}>
            Cancel
          </button>
          <button type="submit" className="submit-button">
            Submit Reservation
          </button>
        </div>

        {message && <div className="popup-success">{message}</div>}
      </form>
    </div>
  )
}

export default ReservationForm
