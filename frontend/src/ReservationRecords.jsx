"use client";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./ReservationRecords.css";
import { FaPrint, FaCheck, FaTimes } from "react-icons/fa";
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

  const updateStatus = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this reservation as ${newStatus}?`)) return;

    try {
      const response = await fetch("http://localhost/reserveit-ilfo/backend/api/update_reservation_status.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Reservation ${newStatus} successfully.`);
        setReservations((prev) =>
          prev.map((r) =>
            r.reservation_id === id ? { ...r, status: newStatus } : r
          )
        );
        setSelectedReservation((prev) =>
          prev ? { ...prev, status: newStatus } : null
        );
      } else {
        alert("Failed to update reservation status: " + result.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      alert("An error occurred while updating status.");
    }
  };

  const generateSummaryReport = () => {
    const printWindow = window.open("", "_blank");
    const date = new Date().toLocaleDateString();

    const summaryTable = `
    <html>
      <head>
        <title>Reservation Summary Report</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 40px;
            color: #1f2937;
          }
          .report-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .report-header img {
            max-width: 100px;
            height: auto;
            margin-bottom: 10px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 5px;
          }
          .date {
            font-size: 14px;
            color: #6b7280;
          }
          hr {
            margin: 20px 0;
            border: 1px solid #ccc;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            border: 1px solid #d1d5db;
            padding: 10px;
            font-size: 14px;
          }
          th {
            background-color: #8ba96d;
            color: white;
            text-align: left;
          }
          tr:nth-child(even) {
            background-color: #f9fafb;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <img src="${logo}" alt="ILFO Logo" />
          <h1>ILFO Reservation Summary Report</h1>
          <div class="date">Generated on: ${date}</div>
        </div>
        <hr />
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Requestor</th>
              <th>Program Name</th>
              <th>Activity</th>
              <th>Venue/Reason</th>
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
                <td>${r.status.toLowerCase() === 'rejected' 
                     ? (r.rejection_reason || 'Reason not specified')
                     : r.venue}</td>
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

  const generateIndividualReport = (r) => {
    const printWindow = window.open("", "_blank");
    const date = new Date().toLocaleDateString();

    const reportHTML = `
    <html>
      <head>
        <title>Reservation Report - ${r.reservation_id}</title>
        <style>
          body {
            font-family: 'Segoe UI', sans-serif;
            padding: 40px;
            color: #1f2937;
          }
          .report-header {
            text-align: center;
            margin-bottom: 30px;
          }
          .report-header img {
            max-width: 100px;
            height: auto;
            margin-bottom: 10px;
          }
          h1 {
            font-size: 24px;
            margin-bottom: 5px;
          }
          .date {
            font-size: 14px;
            color: #6b7280;
          }
          .section {
            margin-bottom: 16px;
          }
          .section span {
            font-weight: 600;
            display: inline-block;
            width: 180px;
          }
        </style>
      </head>
      <body>
        <div class="report-header">
          <img src="${logo}" alt="ILFO Logo" />
          <h1>Individual Reservation Report</h1>
          <div class="date">Generated on: ${date}</div>
        </div>
        <div class="section"><span>Reservation ID:</span> ${r.reservation_id}</div>
        <div class="section"><span>Requestor:</span> ${r.whoReserved}</div>
        <div class="section"><span>Event Name:</span> ${r.nameOfProgram}</div>
        <div class="section"><span>Participants:</span> ${r.numberOfParticipants}</div>
        <div class="section"><span>Nature of Activity:</span> ${r.natureOfActivity}</div>
        <div class="section"><span>Date:</span> ${r.startDate} to ${r.endDate}</div>
        <div class="section"><span>Time:</span> ${r.time.start} - ${r.time.end}</div>
        ${r.status.toLowerCase() === 'rejected' 
          ? `<div class="section"><span>Rejection Reason:</span> ${r.rejection_reason || 'Reason not specified'}</div>
             ${r.rejection_notes ? `<div class="section"><span>Rejection Notes:</span> ${r.rejection_notes}</div>` : ''}`
          : `<div class="section"><span>Venue:</span> ${r.venue}</div>`}
        <div class="section"><span>Status:</span> ${r.status}</div>
      </body>
    </html>
  `;

    printWindow.document.write(reportHTML);
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
                  <th>Requestor</th>
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
                      <button className="generate-icon-btn" title="Generate Individual Report" onClick={() => generateIndividualReport(r)}>
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
                <button className="close-panel-btn top-right" onClick={() => setSelectedReservation(null)}>
                  <FaTimes />
                </button>
                <div>
                  <div className="modal-header-title">Reservation ID {selectedReservation.reservation_id}</div>
                  <div className="modal-header-sub">{selectedReservation.whoReserved}</div>
                </div>
                <span className={getStatusClass(selectedReservation.status)}>
                  {selectedReservation.status}
                </span>
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
                      <p>{selectedReservation.startDate} to {selectedReservation.endDate}</p>
                    </div>
                    {selectedReservation.status.toLowerCase() === 'rejected' ? (
                      <>
                        <div className="modal-content-item">
                          <span>Rejection Reason</span>
                          <p>{selectedReservation.rejection_reason || 'Reason not specified'}</p>
                        </div>
                        {selectedReservation.rejection_notes && (
                          <div className="modal-content-item">
                            <span>Rejection Notes</span>
                            <p>{selectedReservation.rejection_notes}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="modal-content-item">
                        <span>Venue</span>
                        <p>{selectedReservation.venue}</p>
                      </div>
                    )}
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

            </div>
          </div>
        )}

        <div className="records-actions">
          <button className="back-dashboard-btn" onClick={() => navigate("/admin-dashboard")}>
            Back to Dashboard
          </button>
          <button className="print-summary-btn" onClick={generateSummaryReport}>
            <FaPrint style={{ marginRight: "8px" }} />
            PRINT SUMMARY
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default ReservationRecords;