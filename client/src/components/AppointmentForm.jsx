import React, { useState, useEffect } from "react";
import { patients, doctors } from "../data/mockData";

const AppointmentForm = ({
  selectedDate,
  appointments,
  setAppointments,
  onClose,
  editData,
}) => {
  const [patient, setPatient] = useState("");
  const [doctor, setDoctor] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    if (editData) {
      setPatient(editData.patient);
      setDoctor(editData.doctor);
      setTime(editData.time);
    } else {
      setPatient("");
      setDoctor("");
      setTime("");
    }
  }, [editData]);

  const handleSubmit = () => {
    if (!patient || !doctor || !time) {
      alert("Please fill all fields.");
      return;
    }

    const updated = { ...appointments };
    const currentAppointments = updated[selectedDate] || [];

    if (editData) {
      currentAppointments[editData.index] = { patient, doctor, time };
    } else {
      currentAppointments.push({ patient, doctor, time });
    }

    updated[selectedDate] = currentAppointments;
    setAppointments(updated);
    localStorage.setItem("appointments", JSON.stringify(updated));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 text-black dark:text-white p-6 rounded-lg w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          {editData ? "Edit Appointment" : "Add Appointment"} - Day {selectedDate}
        </h2>

        <label className="block mb-1">Patient</label>
        <select
          value={patient}
          onChange={(e) => setPatient(e.target.value)}
          className="w-full mb-3 border p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          <option value="">Select Patient</option>
          {patients.map((p) => (
            <option key={p.id} value={p.name}>{p.name}</option>
          ))}
        </select>

        <label className="block mb-1">Doctor</label>
        <select
          value={doctor}
          onChange={(e) => setDoctor(e.target.value)}
          className="w-full mb-3 border p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        >
          <option value="">Select Doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.name}>{d.name}</option>
          ))}
        </select>

        <label className="block mb-1">Time</label>
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-full mb-4 border p-2 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentForm;
