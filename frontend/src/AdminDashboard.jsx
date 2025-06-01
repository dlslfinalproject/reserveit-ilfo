"use client"

import { useState, useEffect } from "react"
import "./AdminDashboard.css"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { FaPlus, FaListAlt, FaEnvelope, FaUserCircle, FaChevronLeft, FaChevronRight, FaCog, FaCheck, FaTimes, FaClock } from "react-icons/fa"
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

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("http://localhost/reserveit-ilfo/backend/api/get_reservations.php", {
          credentials: "include",
        })
        const data = await response.json()
        if (response.ok && data.reservations) {
          const loadedEvents = data.reservations.map((res) => ({
            id: res.id,
            title: `${res.eventName} (${res.status})`,
            start: new Date(res.startDate + "T" + res.startTime),
            end: new Date(res.endDate + "T" + res.endTime),
            status: res.status,
            raw: res,
          }))
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
  const formattedMonthYear = moment(currentDate).format("MMMM YYYY")

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
            ev.id === id ? { ...ev, status: newStatus, title: `${ev.raw.eventName} (${newStatus})` } : ev,
          ),
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

  const filteredEvents = filterStatus === "All" ? events : events.filter((e) => e.status.toLowerCase() === filterStatus.toLowerCase())

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
          <h2>Admin Dashboard</h2>
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
                <button
                  onClick={() => {
                    setShowProfile(false)
                    navigate("/settings")
                  }}
                >
                  <FaCog style={{ marginRight: "8px" }} />
                  Settings
                </button>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Calendar Navigation with integrated filter */}
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
          <span className="calendar-nav-month">{formattedMonthYear}</span>
        </div>

        <button onClick={goToNextMonth} className="calendar-nav-button">
          <FaChevronRight />
        </button>
      </div>

      {/* Calendar */}
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
        />
      </div>

      {/* Status Update Panel */}
      {selectedEvent && (
        <div className="status-update-panel">
          <div className="status-panel-header">
            <h3>Update Status for: {selectedEvent.raw.eventName}</h3>
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
              <button 
                className="status-btn approve-btn" 
                onClick={() => updateStatus(selectedEvent.id, "Approved")}
              >
                <FaCheck /> Approve
              </button>
              <button 
                className="status-btn reject-btn" 
                onClick={() => updateStatus(selectedEvent.id, "Rejected")}
              >
                <FaTimes /> Reject
              </button>
              <button 
                className="status-btn pending-btn" 
                onClick={() => updateStatus(selectedEvent.id, "Pending")}
              >
                <FaClock /> Set Pending
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
