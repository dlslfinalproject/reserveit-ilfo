// UserRecords.jsx
"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaPrint } from "react-icons/fa" // Keep FaPrint import if used elsewhere, otherwise remove
import "./ReservationRecords.css" // Assuming this CSS file is shared
import logo from './assets/ilfo-logo.png' // Assuming this path is correct

function UserRecords() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [activeTab, setActiveTab] = useState("details") // Added activeTab state

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

  // The printReservation function is kept as it's used in the modal for individual report,
  // but the button to trigger it from the main table is removed.
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

  // Function to handle opening the modal and setting the active tab
  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setActiveTab("details"); // Always start with the 'details' tab
  };

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
                    <td>{r.venue}</td>
                    <td>{r.startDate} to {r.endDate}</td>
                    <td>{r.time.start} - {r.time.end}</td>
                    <td><span className={getStatusClass(r.status)}>{r.status}</span></td>
                    <td>
                      <button className="view-btn" onClick={() => handleViewDetails(r)}>View</button>
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
              {/* Modal Header */}
              <div className="modal-header">
                <div>
                  <div className="modal-header-title">Reservation ID {selectedReservation.reservation_id}</div>
                  <div className="modal-header-sub">{selectedReservation.whoReserved}</div> {/* Assuming whoReserved exists in user records */}
                </div>
                <span className={getStatusClass(selectedReservation.status)}>{selectedReservation.status}</span>
              </div>

              {/* Tab Navigation */}
              <div className="tab-container">
                <div
                  className={`tab ${activeTab === "details" ? "active" : ""}`}
                  onClick={() => setActiveTab("details")}
                >
                  Details
                </div>
                <div
                  className={`tab ${activeTab === "poa" ? "active" : ""}`}
                  onClick={() => setActiveTab("poa")}
                >
                  POA
                </div>
              </div>

              {/* Modal Body - Conditional Content */}
              <div className="modal-body">
                {activeTab === "details" ? (
                  <>
                    <div className="modal-content-item">
                      <span>Event Name</span>
                      <p>{selectedReservation.nameOfProgram}</p>
                    </div>
                    <div className="modal-content-item">
                      <span>Participants</span>
                      <p>{selectedReservation.numberOfParticipants}</p>
                    </div>
                    <div className="modal-content-item">
                      <span>Nature of Activity</span>
                      <p>{selectedReservation.natureOfActivity}</p>
                    </div>
                    <div className="modal-content-item">
                      <span>Date</span>
                      <p>{selectedReservation.startDate} to {selectedReservation.endDate}</p>
                    </div>
                    <div className="modal-content-item">
                      <span>Venue</span>
                      <p>{selectedReservation.venue}</p>
                    </div>
                    <div className="modal-content-item">
                      <span>Time</span>
                      <p>{selectedReservation.time.start} - {selectedReservation.time.end}</p>
                    </div>
                  </>
                ) : (
                  <div className="modal-content-item">
                    <span>POA (Program of Activities)</span>
                    <p>{selectedReservation.poa || "No POA uploaded."}</p>
                  </div>
                )}
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
