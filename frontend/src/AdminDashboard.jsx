import { useState, useEffect } from "react"
import "./AdminDashboard.css"
import { Calendar, momentLocalizer, Views } from "react-big-calendar"
import "react-big-calendar/lib/css/react-big-calendar.css"
import {
  FaPlus,
  FaListAlt,
  FaEnvelope,
  FaUserCircle,
  FaChevronLeft,
  FaChevronRight,
  FaCog,
  FaCheck,
  FaTimes
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
  const [activeStatusTab, setActiveStatusTab] = useState("details")
  const navigate = useNavigate()

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
        onSignOut()
      }
    } catch (error) {
      alert("Logout failed: " + error.message)
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
        setSelectedEvent(null)

        if (newStatus === "Approved") {
          navigate("/admin/approval-success")
        }
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
          <button className="dashboard-button" onClick={() => navigate("/admin/new-reservation")}>
            <FaPlus /> Make a Reservation
          </button>
          <button className="dashboard-button" onClick={() => navigate("/admin/reservation-records")}>
            <FaListAlt /> Reservation Records
          </button>
          <button className="dashboard-button" onClick={() => window.open("https://mail.google.com/mail/u/0/#inbox", "_blank")}
          >
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

            <div className="modal-body">
              {activeStatusTab === "details" ? (
                <>
                  <div className="modal-content-item"><span>Event Name</span><p>{selectedEvent.raw.nameOfProgram}</p></div>
                  <div className="modal-content-item"><span>Participants</span><p>{selectedEvent.raw.numberOfParticipants}</p></div>
                  <div className="modal-content-item"><span>Nature of Activity</span><p>{selectedEvent.raw.natureOfActivity}</p></div>
                  <div className="modal-content-item"><span>Date</span><p>{selectedEvent.raw.startDate} to {selectedEvent.raw.endDate}</p></div>
                  <div className="modal-content-item"><span>Venue</span><p>{selectedEvent.raw.venue}</p></div>
                  <div className="modal-content-item"><span>Time</span><p>{selectedEvent.raw.time.start} - {selectedEvent.raw.time.end}</p></div>
                </>
              ) : (
                <div className="modal-content-item">
                  <span>POA (Program of Activities)</span>
                  <p>{selectedEvent.raw.poa || "No POA uploaded."}</p>
                </div>
              )}
            </div>

            <div className="status-actions">
              <button className="status-btn reject-btn" onClick={() => updateStatus(selectedEvent.reservationId, "Rejected")}>
                <FaTimes /> Reject
              </button>
              <button className="status-btn approve-btn" onClick={() => {
                  navigate("/admin/approval-success", { state: { reservation: selectedEvent.raw } })
                }}
              >
                <FaCheck /> Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard
