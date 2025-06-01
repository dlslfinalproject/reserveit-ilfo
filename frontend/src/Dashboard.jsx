"use client"

import { useState, useEffect } from "react"
import "./Dashboard.css" // Change from App.css to Dashboard.css
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
  const [filterStatus, setFilterStatus] = useState("All Status")
  const navigate = useNavigate()

  // Load user email from localStorage
  useEffect(() => {
    const userData = localStorage.getItem("user_data")
    if (userData) {
      const parsed = JSON.parse(userData)
      setUserEmail(parsed.email || "")
    }
  }, [])

  // Fetch reservations with optional status filter
  useEffect(() => {
    async function fetchReservations() {
      try {
        const url = "http://localhost/reserveit-ilfo/backend/api/get_reservations.php"
        const response = await fetch(url, { credentials: "include" })
        const data = await response.json()
        if (response.ok && data.reservations) {
          let loadedEvents = data.reservations.map((res) => ({
            id: res.id,
            title: `${res.eventName} (${res.status})`,
            start: new Date(res.startDate + "T" + res.startTime),
            end: new Date(res.endDate + "T" + res.endTime),
            status: res.status,
            raw: res,
          }))

          if (filterStatus !== "All Status") {
            loadedEvents = loadedEvents.filter((ev) => ev.status.toLowerCase() === filterStatus.toLowerCase())
          }

          setEvents(loadedEvents)
        }
      } catch (error) {
        console.error("Failed to load reservations", error)
      }
    }
    fetchReservations()
  }, [filterStatus])

  const handleLogout = async () => {
    if (onSignOut) {
      await onSignOut()
    }
    navigate("/")
  }

  const goToPreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, "month").toDate())
  }

  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, "month").toDate())
  }

  const formattedMonthYear = moment(currentDate).format("MMMM YYYY")

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

      {/* Calendar Navigation with integrated filter */}
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
              <option>All Status</option>
              <option>Approved</option>
              <option>Pending</option>
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
          events={events}
          startAccessor="start"
          endAccessor="end"
          date={currentDate}
          onNavigate={setCurrentDate}
          view={Views.MONTH}
          toolbar={false}
          style={{ height: 500 }}
        />
      </div>
    </div>
  )
}

export default Dashboard
