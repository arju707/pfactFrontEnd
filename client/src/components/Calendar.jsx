import React, { useState } from "react";
import AppointmentForm from "./AppointmentForm";
import {
  startOfMonth,
  getDaysInMonth,
  getDay,
  format,
  parseISO,
} from "date-fns";

const Calendar = ({ isDark, setIsDark }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [mobileDate, setMobileDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [appointments, setAppointments] = useState(
    JSON.parse(localStorage.getItem("appointments")) || {}
  );
  const [filterType, setFilterType] = useState("all");
  const [filterValue, setFilterValue] = useState("");
  const [editData, setEditData] = useState(null);

  const today = new Date();
  const firstDay = startOfMonth(today);
  const totalDays = getDaysInMonth(today);
  const firstDayOfWeek = getDay(firstDay);

  const openForm = (day) => setSelectedDate(day);

  const handleDelete = (day, index) => {
    const updated = { ...appointments };
    updated[day].splice(index, 1);
    if (updated[day].length === 0) {
      delete updated[day];
    }
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
  };

  const days = [];
  for (let i = 0; i < firstDayOfWeek; i++) days.push(null);
  for (let i = 1; i <= totalDays; i++) days.push(i);

  const isToday = (day) => day === today.getDate();

  return (
    <div className="p-6 min-h-screen transition-all bg-white text-black dark:bg-black dark:text-white">
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsDark(!isDark)}
          className="px-4 py-2 border rounded text-sm bg-gray-100 dark:bg-gray-700 dark:text-white"
        >
          {isDark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      <h1 className="text-2xl font-semibold mb-4 text-center">
        {format(today, "MMMM yyyy")} Calendar
      </h1>

      <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setFilterValue("");
          }}
          className="border p-2 rounded bg-white text-black dark:bg-gray-800 dark:text-white"
        >
          <option value="all">Show All</option>
          <option value="doctor">Filter by Doctor</option>
          <option value="patient">Filter by Patient</option>
        </select>

        {filterType !== "all" && (
          <input
            type="text"
            placeholder={`Enter ${filterType} name`}
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            className="border p-2 rounded w-64 bg-white text-black dark:bg-gray-800 dark:text-white"
          />
        )}
      </div>

      <div className="hidden sm:grid grid-cols-7 text-center text-sm text-gray-500 font-medium mb-1">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

      <div className="hidden sm:grid grid-cols-7 gap-px bg-gray-200 dark:bg-gray-700 rounded overflow-hidden shadow">
        {days.map((day, index) => (
          <div
            key={index}
            className={`bg-white dark:bg-gray-900 h-32 p-2 flex flex-col justify-between border transition-all ${
              day ? "hover:bg-blue-50 dark:hover:bg-gray-800 cursor-pointer" : "bg-gray-100 dark:bg-gray-800"
            } ${isToday(day) ? "border-blue-500 border-2" : ""}`}
            onClick={() => day && openForm(day)}
          >
            <div className="text-xs text-gray-600 dark:text-gray-300 font-semibold">
              {day ? `Day ${day}` : ""}
            </div>

            <div className="text-xs space-y-1 overflow-y-auto max-h-20 mt-1">
              {appointments[day]
                ?.filter((appt) =>
                  filterType === "all" ||
                  appt[filterType]?.toLowerCase().includes(filterValue.toLowerCase())
                )
                .map((appt, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-blue-100 text-blue-900 px-2 py-1 rounded shadow-sm dark:bg-blue-900 dark:text-blue-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditData({ day, index: i, ...appt });
                      setSelectedDate(day);
                    }}
                  >
                    <div className="flex-1 truncate">
                      {appt.patient} ({appt.doctor}) @ {appt.time}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(day, i);
                      }}
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

      {selectedDate && (
        <AppointmentForm
          selectedDate={selectedDate}
          appointments={appointments}
          setAppointments={setAppointments}
          onClose={() => {
            setSelectedDate(null);
            setEditData(null);
          }}
          editData={editData}
        />
      )}
    </div>
  );
};

export default Calendar;
