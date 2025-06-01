"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import "./ReservationRecords.css"
import { FaPrint } from "react-icons/fa"

function ReservationRecords() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("http://localhost/reserveit-ilfo/backend/api/get_reservations.php", {
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
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { text-align: center; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Reservation Summary Report</h1>
          <p>Date: ${date}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${reservations
                .map(
                  (reservation) => `
                <tr>
                  <td>${reservation.id}</td>
                  <td>${reservation.name}</td>
                  <td>${reservation.contact}</td>
                  <td>${reservation.date}</td>
                  <td>${reservation.time}</td>
                  <td>${reservation.status}</td>
                </tr>
              `,
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
    <div className="records1-container">
      <h1 className="records1-title">All Reservation Status</h1>

      <div className="records1-table-wrapper">
        {reservations.length === 0 ? (
          <p style={{ padding: "20px", textAlign: "center" }}>No reservation records found.</p>
        ) : (
          <table className="records1-table">
            <thead>
              <tr>
                <th>Requester</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td>{reservation.name}</td>
                  <td>{reservation.date}</td>
                  <td>{reservation.time}</td>
                  <td>
                    <span className={getStatusClass(reservation.status)}>{reservation.status}</span>
                  </td>
                  <td>
                    <button className="view-details-btn">View Details</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="records1-actions">
        <button className="print-summary-btn" onClick={generateSummaryReport}>
          <FaPrint style={{ marginRight: "8px" }} />
          Print Summary
        </button>
        <button className="back-dashboard-btn" onClick={() => navigate("/admin-dashboard")}>Back to Dashboard</button>
      </div>
    </div>
  )
}

export default ReservationRecords
