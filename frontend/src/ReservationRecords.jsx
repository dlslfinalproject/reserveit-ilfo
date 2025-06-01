"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./ReservationRecords.css"
import { FaPrint, FaEye } from "react-icons/fa"

function ReservationRecords() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])

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
            h1 { text-align: center; color: #374151; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #8ba96d; color: white; }
          </style>
        </head>
        <body>
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
              ${reservations
                .map(
                  (r) => `
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
              `
                )
                .join("")}
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
                  <th>Program Name</th>
                  <th>Nature of Activity</th>
                  <th>Venue</th>
                  <th>Participants</th>
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
                    <td>{r.nameOfProgram}</td>
                    <td>{r.natureOfActivity}</td>
                    <td>{r.venue}</td>
                    <td>{r.numberOfParticipants}</td>
                    <td>{r.startDate} to {r.endDate}</td>
                    <td>{r.time.start} - {r.time.end}</td>
                    <td>
                      <span className={getStatusClass(r.status)}>{r.status}</span>
                    </td>
                    <td>
                      <button className="view-details-btn">
                        <FaEye style={{ marginRight: "6px" }} />
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
