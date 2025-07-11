import React, { useState } from "react";
import AppointmentForm from "./AppointmentForm";
import {
  startOfMonth,
  getDaysInMonth,
  getDay,
  format,
  parseISO
} from "date-fns";

const Calendar = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [mobileDate, setMobileDate] = useState(format(new Date(), "yyyy-MM-dd")); // 🟢 Mobile selected date
  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments")) || {}
  );

  const today = new Date();
  const firstDay = startOfMonth(today);
  const totalDays = getDaysInMonth(today);
  const firstDayOfWeek = getDay(firstDay); // 🟢 0 (Sun) to 6 (Sat)

  const openForm = (day) => setSelectedDate(day);

  const handleDelete = (day, index) => {
    const updatedAppointments = { ...appointments };
    updatedAppointments[day].splice(index, 1);
    if (updatedAppointments[day].length === 0) {
      delete updatedAppointments[day];
    }
    setAppointments(updatedAppointments);
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments));
  };

  // 🟢 Create empty tiles + real days
  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push(null); // Empty tiles
  }
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }

  // 🟢 Optional: check if the day is today
  const isToday = (day) => day === today.getDate();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {format(today, "MMMM yyyy")} Calendar
      </h1>

      {/* 🟢 MOBILE: Date Picker */}
      <div className="sm:hidden mb-4">
        <label className="block mb-1 font-medium">Select a Date</label>
        <input
          type="date"
          value={mobileDate}
          onChange={(e) => setMobileDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      {/* 🟢 MOBILE: Show appointments for selected date */}
      {window.innerWidth < 640 && (
        <div className="sm:hidden border p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">
            {format(parseISO(mobileDate), "MMMM d, yyyy")}
          </h2>

          <div className="space-y-2">
            {appointments[parseISO(mobileDate).getDate()]?.length > 0 ? (
              appointments[parseISO(mobileDate).getDate()].map((appt, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                >
                  <span>{appt.patient} @ {appt.time}</span>
                  <button
                    onClick={() =>
                      handleDelete(parseISO(mobileDate).getDate(), i)
                    }
                    className="text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-400">No appointments</p>
            )}
          </div>

          <button
            onClick={() => setSelectedDate(parseISO(mobileDate).getDate())}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Appointment
          </button>
        </div>
      )}

      {/* 🟢 DESKTOP: Day Headers like Google Calendar */}
      <div className="hidden sm:grid grid-cols-7 text-center text-sm text-gray-500 font-medium mb-1">
        <div>Sun</div>
        <div>Mon</div>
        <div>Tue</div>
        <div>Wed</div>
        <div>Thu</div>
        <div>Fri</div>
        <div>Sat</div>
      </div>

      {/* 🟢 DESKTOP: Google-style Calendar Grid */}
      <div className="hidden sm:grid grid-cols-7 gap-px bg-gray-200 rounded overflow-hidden shadow">
        {days.map((day, index) => (
          <div
            key={index}
            className={`bg-white h-32 p-2 flex flex-col justify-between border transition-all ${
              day ? "hover:bg-blue-50 cursor-pointer" : "bg-gray-100"
            } ${isToday(day) ? "border-blue-500 border-2" : ""}`} // 🟢 Optional: Highlight today
            onClick={() => day && openForm(day)}
          >
            <div className="text-xs text-gray-600 font-semibold">
              {day ? `Day ${day}` : ""}
            </div>

            <div className="text-xs space-y-1 overflow-y-auto max-h-20 mt-1">
              {day &&
                appointments[day]?.map((appt, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-blue-100 text-blue-900 px-2 py-1 rounded shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="truncate">
                      {appt.patient} @ {appt.time}
                    </span>
                    <button
                      onClick={() => handleDelete(day, i)}
                      className="ml-2 text-red-500 text-xs hover:underline"
                    >
                      ✕
                    </button>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      {/* 🟢 FORM: Shared across views */}
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
