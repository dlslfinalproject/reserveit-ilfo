import React, { useState } from 'react';
import './App.css'; // Using your existing CSS
import { Calendar, momentLocalizer } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaPlus, FaListAlt, FaEnvelope, FaUserCircle } from 'react-icons/fa';
import { addDays } from 'date-fns';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    window.location.href = '/';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>Reservation Calendar</h2>

        <div className="dashboard-actions">
          <button className="dashboard-button" onClick={() => navigate('/new-reservation')}>
            <FaPlus /> Reservation
          </button>

          <button className="dashboard-button" onClick={() => navigate('/user-records')}>
            <FaListAlt /> Records
          </button>

          <button className="dashboard-button"><FaEnvelope /> Gmail</button>

          <div className="profile-dropdown">
            <button onClick={() => setShowProfile(!showProfile)}>
              <FaUserCircle size={24} />
            </button>
            {showProfile && (
              <div className="profile-menu">
                <p>user@dlsl.edu.ph</p>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '20px' }}
      />
    </div>
  );
};

export default Dashboard;
