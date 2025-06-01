import { useState, useEffect } from 'react';
import './App.css';
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
  const [userEmail, setUserEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUserEmail(parsed.email || '');
    }
  }, []);

  const handleLogout = async () => {
    if (onSignOut) {
      await onSignOut();
    }
    navigate('/');
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
        <div className="dashboard-header-left">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/reserveit-logo-bW3iq7A4wVSCnpoC86tviNKzWDJKWT.png" 
            alt="ReserveIT Logo" 
            className="dashboard-logo"
          />
          <h2>Reservation Calendar</h2>
        </div>

        <div className="dashboard-actions">
          <button className="dashboard-button" onClick={() => navigate('/new-reservation')}>
            <FaPlus /> Make a Reservation
          </button>

          <button className="dashboard-button" onClick={() => navigate('/user-records')}>
            <FaListAlt /> Records
          </button>

          <button className="dashboard-button">
            <FaEnvelope /> Gmail
          </button>

          <div className="profile-dropdown">
            <button onClick={() => setShowProfile(!showProfile)}>
              <FaUserCircle size={24} />
            </button>
            {showProfile && (
              <div className="profile-menu">
                <p>{userEmail || 'user@dlsl.edu.ph'}</p>
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
        onNavigate={setCurrentDate}
        view={Views.MONTH}
        toolbar={false}
        style={{ height: 500, margin: '20px' }}
      />
    </div>
  );
};

export default Dashboard;