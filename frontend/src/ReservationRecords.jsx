"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./ReservationRecords.css"
import { FaPrint } from "react-icons/fa"

// Import the logo image
import logo from './assets/ilfo-logo.png';

function ReservationRecords() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("http://localhost/reserveit-ilfo/backend/api/get_all_reservation.php", {
          credentials: "include",
        })
        const data = await response.json()
        if (response.ok && data.reservations) {
          setReservations(data.reservations)
        } else {
          console.error("Failed to fetch reservations:", data.message)
        }
      } catch (error) {
        console.error("Error fetching reservations:", error)
      }
    }

    fetchReservations()
  }, [])

  const generateSummaryReport = () => {
    const printWindow = window.open("", "_blank")
    const date = new Date().toLocaleDateString()

    const summaryTable = `
      <html>
        <head>
          <title>Reservation Summary Report</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; padding: 20px; }
            .report-header {
                text-align: center;
                margin-bottom: 20px;
            }
            .report-header img {
                max-width: 150px; /* Adjust logo size as needed */
                height: auto;
                margin-bottom: 10px;
            }
            h1 { text-align: center; color: #374151; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #8ba96d; color: white; }
          </style>
        </head>
        <body>
        <div class="report-header">
            <img src="${logo}" alt="Company Logo" />
          </div>
          <h1>Reservation Summary Report</h1>
          <p>Generated on: ${date}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Requester</th>
                <th>Program Name</th>
                <th>Nature of Activity</th>
                <th>Venue</th>
                <th>Participants</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reservations.map(r => `
                <tr>
                  <td>${r.reservation_id}</td>
                  <td>${r.whoReserved}</td>
                  <td>${r.nameOfProgram}</td>
                  <td>${r.natureOfActivity}</td>
                  <td>${r.venue}</td>
                  <td>${r.numberOfParticipants}</td>
                  <td>${r.startDate}</td>
                  <td>${r.endDate}</td>
                  <td>${r.time.start} - ${r.time.end}</td>
                  <td>${r.status}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </body>
      </html>
    `

    printWindow.document.write(summaryTable)
    printWindow.document.close()
    printWindow.print()
  }

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "status-pill approved"
      case "rejected":
        return "status-pill rejected"
      case "pending":
        return "status-pill pending"
      default:
        return "status-pill pending"
    }
  }

  return (
    <div className="reservation-records-container">
      <div className="records-header">All Reservation Status</div>

      <div className="records-content">
        {reservations.length === 0 ? (
          <div className="no-records">
            <p>No reservation records found.</p>
          </div>
        ) : (
          <div className="records-table-wrapper">
            <table className="records-table">
              <thead>
                <tr>
                  <th>Requester</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.reservation_id}>
                    <td>{r.whoReserved}</td>
                    <td>{r.startDate} to {r.endDate}</td>
                    <td>{r.time.start} - {r.time.end}</td>
                    <td>
                      <span className={getStatusClass(r.status)}>{r.status}</span>
                    </td>
                    <td>
                      <button className="view-btn" onClick={() => setSelectedReservation(r)}>
                        View Details
                      </button>
                      <button
                        className="generate-icon-btn"
                        title="Generate Report"
                        onClick={() => {
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
                                      max-width: 150px; /* Adjust logo size as needed */
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
                                <p><span class="label">Requester:</span> ${r.whoReserved}</p>
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
                        }}
                      >
                        <FaPrint />
                      </button>
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
                <p><strong>Requester:</strong> {selectedReservation.whoReserved}</p>
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
          <button className="print-summary-btn" onClick={generateSummaryReport}>
            <FaPrint style={{ marginRight: "8px" }} />
            Print Summary
          </button>
          <button className="back-dashboard-btn" onClick={() => navigate("/admin-dashboard")}>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReservationRecords
