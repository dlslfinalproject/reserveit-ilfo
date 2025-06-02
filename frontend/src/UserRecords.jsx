// UserRecords.jsx
"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaPrint } from "react-icons/fa"
import "./ReservationRecords.css"
import logo from './assets/ilfo-logo.png'

function UserRecords() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)

  useEffect(() => {
    async function fetchUserReservations() {
      try {
        const response = await fetch("http://localhost/reserveit-ilfo/backend/api/get_user_reservations.php", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        if (response.ok && data.reservations) {
          setReservations(data.reservations)
        } else {
          console.error("Failed to fetch reservations:", data.message)
        }
      } catch (error) {
        console.error("Error fetching user reservations:", error)
      }
    }

    fetchUserReservations()
  }, [])

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "status-pill approved"
      case "rejected": return "status-pill rejected"
      case "pending": return "status-pill pending"
      default: return "status-pill pending"
    }
  }

  const printReservation = (r) => {
    const printWindow = window.open("", "_blank")
    const date = new Date().toLocaleDateString()

    const individualReport = `
      <html>
        <head>
          <title>Reservation Report - ${r.nameOfProgram}</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; padding: 20px; color: #1f2937; }
            .report-header {
              text-align: center;
              margin-bottom: 20px;
            }
            .report-header img {
              max-width: 150px;
              height: auto;
              margin-bottom: 10px;
            }
            h1 { text-align: center; color: #374151; }
            p { margin: 8px 0; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <img src="${logo}" alt="Company Logo" />
            <h1>Reservation Report</h1>
          </div>
          <p><span class="label">Generated on:</span> ${date}</p>
          <hr />
          <p><span class="label">Reservation ID:</span> ${r.reservation_id}</p>
          <p><span class="label">Program Name:</span> ${r.nameOfProgram}</p>
          <p><span class="label">Nature of Activity:</span> ${r.natureOfActivity}</p>
          <p><span class="label">Venue:</span> ${r.venue}</p>
          <p><span class="label">Participants:</span> ${r.numberOfParticipants}</p>
          <p><span class="label">Start Date:</span> ${r.startDate}</p>
          <p><span class="label">End Date:</span> ${r.endDate}</p>
          <p><span class="label">Time:</span> ${r.time.start} - ${r.time.end}</p>
          <p><span class="label">Status:</span> ${r.status}</p>
        </body>
      </html>
    `
    printWindow.document.write(individualReport)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="reservation-records-container">
      <div className="records-header">My Reservation Records</div>

      <div className="records-content">
        {reservations.length === 0 ? (
          <div className="no-records">
            <p>You have no reservation records yet.</p>
          </div>
        ) : (
          <div className="records-table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Venue</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.reservation_id}>
                    <td>{r.venue}</td> {/* Added Venue data */}
                    <td>{r.startDate} to {r.endDate}</td>
                    <td>{r.time.start} - {r.time.end}</td>
                    <td><span className={getStatusClass(r.status)}>{r.status}</span></td>
                    <td>
                      <button className="view-btn" onClick={() => setSelectedReservation(r)}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {selectedReservation && (
          <div className="reservation-modal-overlay" onClick={() => setSelectedReservation(null)}>
            <div className="reservation-modal" onClick={(e) => e.stopPropagation()}>
              <h2>Reservation Details</h2>
              <div className="modal-content">
                <p><strong>Reservation ID:</strong> {selectedReservation.reservation_id}</p>
                <p><strong>Program Name:</strong> {selectedReservation.nameOfProgram}</p>
                <p><strong>Nature of Activity:</strong> {selectedReservation.natureOfActivity}</p>
                <p><strong>Venue:</strong> {selectedReservation.venue}</p>
                <p><strong>Participants:</strong> {selectedReservation.numberOfParticipants}</p>
                <p><strong>Start Date:</strong> {selectedReservation.startDate}</p>
                <p><strong>End Date:</strong> {selectedReservation.endDate}</p>
                <p><strong>Time:</strong> {selectedReservation.time.start} - {selectedReservation.time.end}</p>
                <p><strong>Status:</strong> <span className={getStatusClass(selectedReservation.status)}>{selectedReservation.status}</span></p>
              </div>
              <button className="close-modal-btn" onClick={() => setSelectedReservation(null)}>Close</button>
            </div>
          </div>
        )}

        <div className="records-actions">
          <button className="back-dashboard-btn" onClick={() => navigate("/user-dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserRecords
