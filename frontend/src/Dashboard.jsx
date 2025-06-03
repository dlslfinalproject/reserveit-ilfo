"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import { FaPlus, FaListAlt, FaEnvelope, FaUserCircle, FaChevronLeft, FaChevronRight } from "react-icons/fa"
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
  const [activeStatusTab, setActiveStatusTab] = useState("details")
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      const parsed = JSON.parse(userData)
      if (parsed.email) {
        setUserEmail(parsed.email)
      } else {
        console.warn("Email not found in user_data")
      }
    } else {
      navigate("/") // Redirect to login if no user data
    }
  }, [])

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
        const url = "http://localhost/reserveit-ilfo/backend/api/get_user_reservations.php"
        const response = await fetch(url, { credentials: "include" })
        const data = await response.json()

        console.log("Fetched user reservations:", data.reservations)

        if (response.ok && data.reservations) {
          let loadedEvents = data.reservations.flatMap(splitReservationIntoDays)

          if (filterStatus !== "All") {
            loadedEvents = loadedEvents.filter((ev) => ev.status.toLowerCase() === filterStatus.toLowerCase())
          }

          setEvents(loadedEvents)
          console.log("User's Events:", loadedEvents)
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
          color: "#000",
          padding: "2px 4px",
          borderRadius: "4px",
          fontSize: "0.7rem",
          lineHeight: "1",
          overflow: "hidden",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          margin: "1px 0",
          maxWidth: "100%",
          border: "1px solid rgba(0,0,0,0.1)",
        }}
      >
        {event.title}
      </div>
    )
  }

  const dayPropGetter = (date) => {
    return {
      style: {
        padding: "2px",
      },
    }
  }

  const slotPropGetter = () => {
    return {
      style: {
        height: "auto",
      },
    }
  }

  const calendarComponents = {
    event: EventComponent,
    month: {
      event: (props) => {
        return <EventComponent {...props} />
      },
      header: ({ label }) => <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>{label}</span>,
    },
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
          <button className="dashboard-button" onClick={() => navigate("/general-user/new-reservation")}>
            <FaPlus /> Make a Reservation
          </button>
          <button className="dashboard-button" onClick={() => navigate("/general-user/reservations")}>
            <FaListAlt /> My Reservations
          </button>
          <button className="dashboard-button" onClick={() => window.open("https://mail.google.com", "_blank")}>
            <FaEnvelope /> Gmail
          </button>
          <div className="profile-dropdown">
            <button onClick={() => setShowProfile(!showProfile)}>
              <FaUserCircle size={24} />
            </button>
            {/* MODIFICATION HERE: Apply the is-active class */}
            <div className={`profile-menu ${showProfile ? "is-active" : ""}`}>
              <p>{userEmail || "user@dlsl.edu.ph"}</p>
              <button onClick={handleLogout}>Log Out</button>
            </div>
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
          components={calendarComponents}
          dayPropGetter={dayPropGetter}
          slotPropGetter={slotPropGetter}
          eventPropGetter={(event) => {
            const statusColor = {
              Approved: "#C9E1B8",
              Pending: "#FFB527",
              Rejected: "#E78A8A",
            }
            return {
              style: {
                backgroundColor: statusColor[event.status] || "#9E9E9E",
              },
            }
          }}
        />
      </div>

      {selectedEvent && (
        <div className="status-update-panel">
          <div className="status-panel-header">
            <h3>Details for: {selectedEvent.raw.nameOfProgram}</h3>
            <button className="close-panel-btn" onClick={() => setSelectedEvent(null)}>
              ×
            </button>
          </div>

          <div className="status-panel-content">
            <div className="current-status">
              <span className="status-label">Status:</span>
              <span className={`status-badge ${selectedEvent.status.toLowerCase()}`}>{selectedEvent.status}</span>
            </div>
            <div className="tab-container">
              <div
                className={`tab ${activeStatusTab === "details" ? "active" : ""}`}
                onClick={() => setActiveStatusTab("details")}
              >
                Details
              </div>
              <div
                className={`tab ${activeStatusTab === "poa" ? "active" : ""}`}
                onClick={() => setActiveStatusTab("poa")}
              >
                POA
              </div>
            </div>

            {/* TAB CONTENT */}
            <div className="modal-body">
              {activeStatusTab === "details" ? (
                <>
                  <div className="modal-content-item">
                    <span>Event Name</span>
                    <p>{selectedEvent.raw.nameOfProgram}</p>
                  </div>
                  <div className="modal-content-item">
                    <span>Participants</span>
                    <p>{selectedEvent.raw.numberOfParticipants}</p>
                  </div>
                  <div className="modal-content-item">
                    <span>Nature of Activity</span>
                    <p>{selectedEvent.raw.natureOfActivity}</p>
                  </div>
                  <div className="modal-content-item">
                    <span>Date</span>
                    <p>
                      {selectedEvent.raw.startDate} to {selectedEvent.raw.endDate}
                    </p>
                  </div>
                  <div className="modal-content-item">
                    <span>Venue</span>
                    <p>{selectedEvent.raw.venue}</p>
                  </div>
                  <div className="modal-content-item">
                    <span>Time</span>
                    <p>
                      {selectedEvent.raw.time.start} - {selectedEvent.raw.time.end}
                    </p>
                  </div>
                </>
              ) : (
                <div className="modal-content-item">
                  <span>POA (Program of Activities)</span>
                  <p>{selectedEvent.raw.poa || "No POA uploaded."}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
