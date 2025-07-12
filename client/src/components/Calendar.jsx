import React, { useState, useEffect } from "react";
import AppointmentForm from "./AppointmentForm";
import {
  startOfMonth,
  getDaysInMonth,
  getDay,
  format,
  parseISO,
} from "date-fns";

const Calendar = () => {
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
    <div className="p-6 bg-white text-black min-h-screen transition-all">
      <h1 className="text-2xl font-semibold mb-4 text-center">
        {format(today, "MMMM yyyy")} Calendar
      </h1>

      {/*Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-center gap-4 mb-6">
        <select
          value={filterType}
          onChange={(e) => {
            setFilterType(e.target.value);
            setFilterValue("");
          }}
          className="border p-2 rounded bg-white text-black"
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
            className="border p-2 rounded w-64 bg-white text-black"
          />
        )}
      </div>

      
      <div className="sm:hidden mb-4">
        <label className="block mb-1 font-medium">Select a Date</label>
        <input
          type="date"
          value={mobileDate}
          onChange={(e) => setMobileDate(e.target.value)}
          className="border p-2 rounded w-full bg-white text-black"
        />
      </div>

      {/* Mobile Appointments */}
      {window.innerWidth < 640 && (
        <div className="sm:hidden border p-4 rounded shadow bg-white">
          <h2 className="text-lg font-semibold mb-2">
            {format(parseISO(mobileDate), "MMMM d, yyyy")}
          </h2>

          <div className="space-y-2">
            {appointments[parseISO(mobileDate).getDate()]
              ?.filter((appt) =>
                filterType === "all" ||
                appt[filterType]?.toLowerCase().includes(filterValue.toLowerCase())
              )
              .map((appt, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-100 p-2 rounded"
                  onClick={() => {
                    setEditData({
                      day: parseISO(mobileDate).getDate(),
                      index: i,
                      ...appt,
                    });
                    setSelectedDate(parseISO(mobileDate).getDate());
                  }}
                >
                  <div className="flex-1 truncate">
                    {appt.patient} ({appt.doctor}) @ {appt.time}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(parseISO(mobileDate).getDate(), i);
                    }}
                    className="ml-2 text-red-500 text-xs hover:underline"
                  >
                    Delete
                  </button>
                </div>
              )) || <p className="text-gray-400">No appointments</p>}
          </div>

          <button
            onClick={() => setSelectedDate(parseISO(mobileDate).getDate())}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Appointment
          </button>
        </div>
      )}

      
      <div className="hidden sm:grid grid-cols-7 text-center text-sm text-gray-500 font-medium mb-1">
        <div>Sun</div><div>Mon</div><div>Tue</div>
        <div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>

     {/*desktop*/}
      <div className="hidden sm:grid grid-cols-7 gap-px bg-gray-200 rounded overflow-hidden shadow">
        {days.map((day, index) => (
          <div
            key={index}
            className={`bg-white h-32 p-2 flex flex-col justify-between border transition-all ${
              day ? "hover:bg-blue-50 cursor-pointer" : "bg-gray-100"
            } ${isToday(day) ? "border-blue-500 border-2" : ""}`}
            onClick={() => day && openForm(day)}
          >
            <div className="text-xs text-gray-600 font-semibold">
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
                    className="flex justify-between items-center bg-blue-100 text-blue-900 px-2 py-1 rounded shadow-sm"
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
