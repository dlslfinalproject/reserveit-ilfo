import React, { useState } from 'react';
import './Dashboard.css';
import { Calendar, momentLocalizer, Views } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { FaPlus, FaListAlt, FaEnvelope, FaUserCircle, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

const localizer = momentLocalizer(moment);

const Dashboard = ({ onSignOut }) => {
  const [events, setEvents] = useState([]);
  const [showProfile, setShowProfile] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (onSignOut) {
      await onSignOut();
      navigate('/');
    } else {
      console.error("Sign out function not passed as a prop.");
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

          <button className="dashboard-button" onClick={() => navigate('/user-records')}>
            <FaListAlt /> Records
          </button>

          <button className="dashboard-button"><FaEnvelope /> Gmail</button>

          {/* ILFO Button */}
          <button className="dashboard-button" onClick={() => navigate('/ilfo-designs')}>
            ILFO
          </button>

          <div className="profile-dropdown">
            <button onClick={() => setShowProfile(!showProfile)}>
              <FaUserCircle size={24} />
            </button>
            {showProfile && (
              <div className="profile-menu">
                <p>user@dlsl.edu.ph</p>
                <button onClick={() => navigate('/settings')}>Settings</button>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Calendar Navigation */}
      <div className="calendar-nav-container">
        <button onClick={goToPreviousMonth} className="calendar-nav-button">
          <FaChevronLeft /> 
        </button>

        <span className="calendar-nav-month">{formattedMonthYear}</span>

        <button onClick={goToNextMonth} className="calendar-nav-button">
           <FaChevronRight />
        </button>
      </div>

      {/* Calendar */}
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

export default Dashboard;
