"use client"

import { useState, useEffect } from "react"
import "./AdminDashboard.css"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { 
  FaPlus, FaListAlt, FaEnvelope, FaUserCircle, 
  FaChevronLeft, FaChevronRight, FaCog, 
  FaCheck, FaTimes 
} from "react-icons/fa"
import moment from "moment"
import { useNavigate } from "react-router-dom"

const localizer = momentLocalizer(moment)

const AdminDashboard = ({ session, onSignOut }) => {
  const [events, setEvents] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [filterStatus, setFilterStatus] = useState("All")
  const navigate = useNavigate()

  // Split multi-day reservations into daily events
  const splitReservationIntoDays = (reservation) => {
    const start = moment(reservation.startDate)
    const end = moment(reservation.endDate)
    const days = []

    for (let m = start.clone(); m.diff(end, "days") <= 0; m.add(1, "days")) {
      days.push({
        id: reservation.reservation_id + "-" + m.format("YYYYMMDD"),
        reservationId: reservation.reservation_id,
        title: reservation.nameOfProgram,
        whoReserved: reservation.whoReserved,
        category: reservation.natureOfActivity,
        status: reservation.status,
        start: m.toDate(),
        end: m.toDate(),
        timeRange: `${reservation.time.start} - ${reservation.time.end}`,
        raw: reservation,
      })
    }

    return days
  }

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("http://localhost/reserveit-ilfo/backend/api/get_all_reservation.php", {
          credentials: "include",
        })
        const data = await response.json()
        if (response.ok && data.reservations) {
          const loadedEvents = data.reservations.flatMap(splitReservationIntoDays)
          setEvents(loadedEvents)
        }
      } catch (error) {
        console.error("Failed to load reservations", error)
      }
    }

    fetchReservations()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost/reserveit-ilfo/backend/api/logout.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      })
      const data = await response.json()
      if (response.ok && data.success) {
        if (onSignOut) onSignOut()
        setShowProfile(false)
        navigate("/login")
      } else {
        console.error("Logout failed:", data.message || "Unknown error")
      }
    } catch (error) {
      console.error("Error during sign out:", error)
    }
  }

  const goToPreviousMonth = () => setCurrentDate(moment(currentDate).subtract(1, "month").toDate())
  const goToNextMonth = () => setCurrentDate(moment(currentDate).add(1, "month").toDate())

  const handleEventClick = (event) => setSelectedEvent(event)

  const updateStatus = async (id, newStatus) => {
    try {
      const response = await fetch("http://localhost/reserveit-ilfo/backend/api/update_reservation_status.php", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      })
      const data = await response.json()
      if (response.ok && data.success) {
        setEvents((prevEvents) =>
          prevEvents.map((ev) =>
            ev.reservationId === id
              ? { ...ev, status: newStatus, title: `${ev.raw.nameOfProgram} (${newStatus})` }
              : ev
          )
        )
        alert("Status updated successfully")
        setSelectedEvent(null)
      } else {
        alert("Failed to update status: " + (data.message || "Unknown error"))
      }
    } catch (error) {
      alert("Error updating status: " + error.message)
    }
  }

  const filteredEvents = filterStatus === "All"
    ? events
    : events.filter((e) => e.status.toLowerCase() === filterStatus.toLowerCase())

  // ✅ Google Calendar-like Event Display
  const EventComponent = ({ event }) => {
    const statusColor = {
      Approved: "#d1dfbb",
      Pending: "#d2995e",
      Rejected: "#E78A8A",
    }

    return (
      <div
        style={{
          backgroundColor: statusColor[event.status] || "#9E9E9E",
          color: "#fff",
          padding: "4px 6px",
          borderRadius: "4px",
          fontSize: "0.75rem",
          lineHeight: "1.2",
          overflow: "hidden",
          whiteSpace: "normal",
        }}
      >
        <div style={{ fontWeight: "bold" }}>{event.whoReserved}</div>
        <div>{`${event.category} | ${event.timeRange}`}</div>
        <div style={{ fontStyle: "italic", fontSize: "0.7rem" }}>{event.status}</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-left">
          <div className="logo-container">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reserveit-logo-bW3iq7A4wVSCnpoC86tviNKzWDJKWT.png"
              alt="ReserveIT Logo"
              className="dashboard-logo enhanced"
            />
          </div>
          <h2>Reservation Calendar</h2>
        </div>

        <div className="dashboard-actions">
          <button className="dashboard-button" onClick={() => navigate("/new-reservation")}>
            <FaPlus /> Make a Reservation
          </button>
          <button className="dashboard-button" onClick={() => navigate("/reservation-records")}>
            <FaListAlt /> Reservation Records
          </button>
          <button className="dashboard-button">
            <FaEnvelope /> Gmail
          </button>
          <div className="profile-dropdown">
            <button onClick={() => setShowProfile(!showProfile)}>
              <FaUserCircle size={24} />
            </button>
            {showProfile && (
              <div className="profile-menu">
                <p>{session?.user?.email || "Unknown User"}</p>
                <button onClick={() => {
                  setShowProfile(false)
                  navigate("/settings")
                }}>
                  <FaCog style={{ marginRight: "8px" }} />
                  Settings
                </button>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="calendar-nav-container">
        <button onClick={goToPreviousMonth} className="calendar-nav-button">
          <FaChevronLeft />
        </button>

        <div className="calendar-nav-center">
          <div className="filter-section">
            <label htmlFor="status-filter" className="filter-label">
              Filter by Status:
            </label>
            <select
              id="status-filter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <span className="calendar-nav-month">{moment(currentDate).format("MMMM YYYY")}</span>
        </div>

        <button onClick={goToNextMonth} className="calendar-nav-button">
          <FaChevronRight />
        </button>
      </div>

      <div className="calendar-wrapper">
        <Calendar
          localizer={localizer}
          events={filteredEvents}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={(date) => setCurrentDate(date)}
          view={Views.MONTH}
          toolbar={false}
          style={{ height: 500 }}
          onSelectEvent={handleEventClick}
          components={{ event: EventComponent }}
        />
      </div>

      {selectedEvent && (
        <div className="status-update-panel">
          <div className="status-panel-header">
            <h3>Update Status for: {selectedEvent.raw.nameOfProgram}</h3>
            <button className="close-panel-btn" onClick={() => setSelectedEvent(null)}>
              <FaTimes />
            </button>
          </div>

          <div className="status-panel-content">
            <div className="current-status">
              <span className="status-label">Current Status:</span>
              <span className={`status-badge ${selectedEvent.status.toLowerCase()}`}>
                {selectedEvent.status}
              </span>
            </div>
            <div className="status-actions">
              <button className="status-btn approve-btn" onClick={() => updateStatus(selectedEvent.reservationId, "Approved")}>
                <FaCheck /> Approve
              </button>
              <button className="status-btn reject-btn" onClick={() => updateStatus(selectedEvent.reservationId, "Rejected")}>
                <FaTimes /> Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
