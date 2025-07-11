import React, { useState } from "react";
import AppointmentForm from "./AppointmentForm";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments")) || {}
  );

  const daysInMonth = 30; // Simplified
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const openForm = (day) => setSelectedDate(day);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Clinic Calendar</h1>
      <div className="grid grid-cols-7 gap-4">
        {days.map((day) => (
          <div
            key={day}
            onClick={() => openForm(day)}
            className="border p-2 rounded hover:bg-blue-100 cursor-pointer"
          >
            <div className="font-bold">Day {day}</div>
            <div className="text-sm text-gray-600">
              {appointments[day]?.map((appt, i) => (
                <div key={i}>{appt.patient} @ {appt.time}</div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedDate && (
        <AppointmentForm
          selectedDate={selectedDate}
          appointments={appointments}
          setAppointments={setAppointments}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default Calendar;
