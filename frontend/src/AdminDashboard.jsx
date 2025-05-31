import React, { useState } from 'react';
import './Dashboard.css';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaPlus, FaListAlt, FaEnvelope, FaUserCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const AdminDashboard = ({ session, onSignOut }) => {
  const [events, setEvents] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call your backend logout endpoint
      const response = await fetch('http://localhost/reserveit-ilfo/backend/api/logout.php', {
        method: 'POST',
        credentials: 'include', // important to send cookies/session
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();

      if (response.ok && data.success) {
        // Clear local session state in frontend
        if (onSignOut) {
          onSignOut(); // clear session and roles in React state
        }
        setShowProfile(false); // close dropdown
        navigate('/login'); // redirect to login page
      } else {
        console.error('Logout failed:', data.message || 'Unknown error');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month').toDate());
  };

  const goToNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'month').toDate());
  };

  const formattedMonthYear = moment(currentDate).format('MMMM YYYY');

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Reservation Calendar</h2>

        <div className="dashboard-actions">
          <button className="dashboard-button" onClick={() => navigate('/new-reservation')}>
            <FaPlus /> Reservation
          </button>

          <button className="dashboard-button" onClick={() => navigate('/request-form')}>
            <FaPlus /> Request
          </button>

          <button className="dashboard-button" onClick={() => navigate('/user-records')}>
            <FaListAlt /> Records
          </button>

          <button className="dashboard-button">
            <FaEnvelope /> Gmail
          </button>

          <button className="dashboard-button" onClick={() => navigate('/ilfo-designs')}>
            ILFO
          </button>

          <div className="profile-dropdown">
            <button onClick={() => setShowProfile(!showProfile)}>
              <FaUserCircle size={24} />
            </button>
            {showProfile && (
              <div className="profile-menu">
                <p>{session?.user?.email || 'Unknown User'}</p>
                <button onClick={() => { setShowProfile(false); navigate('/settings'); }}>
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

        <span className="calendar-nav-month">{formattedMonthYear}</span>

        <button onClick={goToNextMonth} className="calendar-nav-button">
          <FaChevronRight />
        </button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        date={currentDate}
        onNavigate={date => setCurrentDate(date)}
        view={Views.MONTH}
        toolbar={false}
        style={{ height: 500, margin: '20px' }}
      />
    </div>
  );
};

export default AdminDashboard;
