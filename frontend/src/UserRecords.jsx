"use client"
import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { FaTimes } from "react-icons/fa"
import "./ReservationRecords.css"
import logo from './assets/ilfo-logo.png'

function UserRecords() {
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [activeTab, setActiveTab] = useState("details")

  useEffect(() => {
    async function fetchUserReservations() {
      try {
        const response = await fetch("http://localhost/reserveit-ilfo/backend/api/get_user_reservations.php", {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        console.log("API Response:", data) // Debug log
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
    switch (status?.toLowerCase()) {
      case "approved": return "status-pill approved"
      case "rejected": return "status-pill rejected"
      case "pending": return "status-pill pending"
      default: return "status-pill pending"
    }
  }

  const handleViewDetails = (reservation) => {
    console.log("Selected reservation:", reservation) // Debug log
    setSelectedReservation(reservation);
    setActiveTab("details");
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
                  <th>Venue/Reason</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr key={r.reservation_id}>
                    <td>
                      {r.status && r.status.toLowerCase() === 'rejected' 
                        ? (r.rejection_reason || 'Reason not specified')
                        : (r.venue || 'N/A')}
                    </td>
                    <td>{r.startDate} to {r.endDate}</td>
                    <td>{r.time?.start || 'N/A'} - {r.time?.end || 'N/A'}</td>
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
                      <p>{selectedReservation.nameOfProgram || 'N/A'}</p>
                    </div>
                    <div className="modal-content-item">
                      <span>Participants</span>
                      <p>{selectedReservation.numberOfParticipants || 'N/A'}</p>
                    </div>
                    <div className="modal-content-item">
                      <span>Nature of Activity</span>
                      <p>{selectedReservation.natureOfActivity || 'N/A'}</p>
                    </div>
                    <div className="modal-content-item">
                      <span>Date</span>
                      <p>{selectedReservation.startDate} to {selectedReservation.endDate}</p>
                    </div>
                    {selectedReservation.status && selectedReservation.status.toLowerCase() === 'rejected' ? (
                      <>
                        <div className="modal-content-item">
                          <span>Rejection Reason</span>
                          <p>{selectedReservation.rejection_reason || 'Reason not specified'}</p>
                        </div>
                        {selectedReservation.rejection_notes && (
                          <div className="modal-content-item">
                            <span>Additional Notes</span>
                            <p>{selectedReservation.rejection_notes}</p>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="modal-content-item">
                        <span>Venue</span>
                        <p>{selectedReservation.venue || 'N/A'}</p>
                      </div>
                    )}
                    <div className="modal-content-item">
                      <span>Time</span>
                      <p>{selectedReservation.time?.start || 'N/A'} - {selectedReservation.time?.end || 'N/A'}</p>
                    </div>
                    {selectedReservation.notes && (
                      <div className="modal-content-item">
                        <span>Notes</span>
                        <p>{selectedReservation.notes}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="modal-content-item">
                    <span>POA (Program of Activities)</span>
                    {selectedReservation.poa || selectedReservation.poaLink ? (
                      <div>
                        <a 
                          href={selectedReservation.poa || selectedReservation.poaLink} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="poa-link"
                        >
                          View POA Document
                        </a>
                      </div>
                    ) : (
                      <p>No POA uploaded.</p>
                    )}
                  </div>
                )}
              </div>
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