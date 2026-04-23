import axios from "axios";

const BASE = "http://localhost:8080/api";

// ================= STUDENTS =================

export const getStudents = () =>
  axios.get(`${BASE}/students`);

export const getStudentsByClass = (id) =>
  axios.get(`${BASE}/students/class/${id}`);


// ================= CLASSES =================

export const getClasses = () =>
  axios.get(`${BASE}/classes`);


// ================= FEES =================

export const addFee = (data) =>
  axios.post(`${BASE}/fees/add`, data);

// ❗ OPTIONAL (currently not used because same API use kar rahe ho)
export const updateFee = (data) =>
  axios.put(`${BASE}/fees/update`, data);


// ================= HISTORY =================

export const getHistory = (id) =>
  axios.get(`${BASE}/fees/history/${id}`);


// ================= SUMMARY (🔥 UPDATED) =================

export const getSummary = (classId) => {

  // 👉 ALL classes
  if (!classId || classId === "ALL") {
    return axios.get(`${BASE}/fees/summary`);
  }

  // 👉 Specific class
  return axios.get(`${BASE}/fees/summary?classId=${classId}`);
};

export const sendReminder = (studentId) =>
  axios.post(`http://localhost:8080/api/fees/send-reminder/${studentId}`);