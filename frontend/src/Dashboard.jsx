"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {
  FaPlus,
  FaListAlt,
  FaEnvelope,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa"
import moment from "moment"
import { useNavigate } from "react-router-dom"

const localizer = momentLocalizer(moment)

const Dashboard = ({ onSignOut }) => {
  const [events, setEvents] = useState([])
  const [showProfile, setShowProfile] = useState(false)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [userEmail, setUserEmail] = useState("")
  const [filterStatus, setFilterStatus] = useState("All")
  const [selectedEvent, setSelectedEvent] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      const parsed = JSON.parse(userData)
      setUserEmail(parsed.email || "")
    }
  }, [])

 const splitReservationIntoDays = (reservation) => {
  const start = moment(reservation.startDate)
  const end = moment(reservation.endDate)
  const days = []

  for (let m = start.clone(); m.diff(end, "days") <= 0; m.add(1, "days")) {
    days.push({
      id: reservation.reservation_id + "-" + m.format("YYYYMMDD"), // match admin ID field
      reservationId: reservation.reservation_id,
      title: reservation.nameOfProgram,
      whoReserved: reservation.whoReserved,
      category: reservation.natureOfActivity,
      status: reservation.status,
      start: m.toDate(),
      end: m.toDate(),
      timeRange: `${reservation.time.start} - ${reservation.time.end}`, // if time is nested like that
      raw: reservation,
    })
  }

  return days
}


  useEffect(() => {
    async function fetchReservations() {
      try {
        const url = "http://localhost/reserveit-ilfo/backend/api/get_all_reservations.php"
        const response = await fetch(url, { credentials: "include" })
        const data = await response.json()

        if (response.ok && data.reservations) {
          let userReservations = data.reservations.filter(
            (r) => r.email?.toLowerCase() === userEmail.toLowerCase()
          )

          let loadedEvents = userReservations.flatMap(splitReservationIntoDays)

          if (filterStatus !== "All") {
            loadedEvents = loadedEvents.filter(
              (ev) => ev.status.toLowerCase() === filterStatus.toLowerCase()
            )
          }

          setEvents(loadedEvents)
        }
      } catch (error) {
        console.error("Failed to load reservations", error)
      }
    }

    if (userEmail) {
      fetchReservations()
    }
  }, [filterStatus, userEmail])

  const handleLogout = async () => {
    if (onSignOut) {
      await onSignOut()
    }
    navigate("/")
  }

  const goToPreviousMonth = () => setCurrentDate(moment(currentDate).subtract(1, "month").toDate())
  const goToNextMonth = () => setCurrentDate(moment(currentDate).add(1, "month").toDate())

  const handleEventClick = (event) => {
    setSelectedEvent(event)
  }

  const EventComponent = ({ event }) => {
    const statusColor = {
      Approved: "#C9E1B8",
      Pending: "#FFB527",
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
          <button className="dashboard-button" onClick={() => navigate("/general_user/new-reservation")}>
            <FaPlus /> Make a Reservation
          </button>
          <button className="dashboard-button" onClick={() => navigate("/user-records")}>
            <FaListAlt /> Records
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
                <p>{userEmail || "user@dlsl.edu.ph"}</p>
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
            <label htmlFor="statusFilter" className="filter-label">
              Filter by Status:
            </label>
            <select
              id="statusFilter"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
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
          events={events}
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
            <h3>Details for: {selectedEvent.raw.eventName}</h3>
            <button className="close-panel-btn" onClick={() => setSelectedEvent(null)}>×</button>
          </div>

          <div className="status-panel-content">
            <div className="current-status">
              <span className="status-label">Status:</span>
              <span className={`status-badge ${selectedEvent.status.toLowerCase()}`}>
                {selectedEvent.status}
              </span>
            </div>
            <div className="reservation-info">
              <p><strong>Reserved By:</strong> {selectedEvent.whoReserved}</p>
              <p><strong>Category:</strong> {selectedEvent.category}</p>
              <p><strong>Date:</strong> {moment(selectedEvent.start).format("MMMM D, YYYY")}</p>
              <p><strong>Time:</strong> {selectedEvent.timeRange}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
