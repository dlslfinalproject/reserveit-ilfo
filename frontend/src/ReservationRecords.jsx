"use client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ReservationRecords.css";
import { FaPrint } from "react-icons/fa";
import logo from './assets/ilfo-logo.png';

function ReservationRecords() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    async function fetchReservations() {
      try {
        const response = await fetch("http://localhost/reserveit-ilfo/backend/api/get_all_reservation.php", {
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok && data.reservations) {
          setReservations(data.reservations);
        } else {
          console.error("Failed to fetch reservations:", data.message);
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }

    fetchReservations();
  }, []);

  const generateSummaryReport = () => {
    const printWindow = window.open("", "_blank");
    const date = new Date().toLocaleDateString();

    const summaryTable = `
      <html>
        <head>
          <title>Reservation Summary Report</title>
          <style>
            body { font-family: 'Inter', Arial, sans-serif; padding: 20px; }
            .report-header { text-align: center; margin-bottom: 20px; }
            .report-header img { max-width: 150px; height: auto; margin-bottom: 10px; }
            h1 { text-align: center; color: #374151; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
            th { background-color: #8ba96d; color: white; }
          </style>
        </head>
        <body>
          <div class="report-header">
            <img src="${logo}" alt="ILFO Logo" />
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
    `;

    printWindow.document.write(summaryTable);
    printWindow.document.close();
    printWindow.print();
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "approved": return "status-pill approved";
      case "rejected": return "status-pill rejected";
      case "pending": return "status-pill pending";
      default: return "status-pill pending";
    }
  };

  const handleViewDetails = (reservation) => {
    setSelectedReservation(reservation);
    setActiveTab("details");
  };

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
                      <button className="view-btn" onClick={() => handleViewDetails(r)}>View Details</button>
                      <button className="generate-icon-btn" title="Generate Report">
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
              <div className="modal-header">
                <div>
                  <div className="modal-header-title">Reservation ID {selectedReservation.reservation_id}</div>
                  <div className="modal-header-sub">{selectedReservation.whoReserved}</div>
                </div>
                <span className={getStatusClass(selectedReservation.status)}>{selectedReservation.status}</span>
              </div>

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
                    <p>
                      {selectedReservation.startDate} to {selectedReservation.endDate}
                    </p>
                  </div>
                  <div className="modal-content-item">
                    <span>Venue</span>
                    <p>{selectedReservation.venue}</p>
                  </div>
                   <div className="modal-content-item">
                    <span>Time</span>
                    <p>
                      {selectedReservation.time.start} - {selectedReservation.time.end}
                    </p>
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
  );
}

export default ReservationRecords
