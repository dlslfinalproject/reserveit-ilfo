// src/ReservationContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const ReservationContext = createContext();

export const ReservationProvider = ({ children }) => {
  const [reservations, setReservations] = useState(() => {
    const stored = localStorage.getItem('reservations');
    return stored ? JSON.parse(stored) : [];
  });

  const addReservation = (reservation) => {
    const newReservation = {
      id: Date.now().toString(), // Unique identifier
      whoReserved: reservation.whoReserved || '', // Student/Faculty name
      activityNature: reservation.activityNature || '', // Nature of activity
      classification: reservation.classification || '', // Academic / Non-academic
      participants: reservation.participants || '', // Number of participants
      date: reservation.date || '',
      time: reservation.time || '',
      poaLink: reservation.poaLink || '', // POA file link (optional for faculty)
      status: 'Pending', // Default status
      ...reservation // Just in case there are additional dynamic fields
    };

    const updated = [...reservations, newReservation];
    setReservations(updated);
    localStorage.setItem('reservations', JSON.stringify(updated));
  };

  return (
    <ReservationContext.Provider value={{ reservations, addReservation }}>
      {children}
    </ReservationContext.Provider>
  );
};

export const useReservation = () => useContext(ReservationContext);
