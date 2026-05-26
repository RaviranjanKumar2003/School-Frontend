import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

function SchoolOverview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [school, setSchool] = useState(null);

  const [stats, setStats] = useState({
    teachers: 0,
    students: 0,
    classes: 0,
    subjects: 0,
    hods: 0,
    receptionists: 0,
    accountants: 0,
  });

  const fetchSchool = async () => {
    if (!id) return;

    try {
      setLoading(true);

      const schoolRes = await axios.get(`${BASE_URL}/schools/${id}`);
      setSchool(schoolRes.data);

      const results = await Promise.allSettled([
        axios.get(`${BASE_URL}/professors/by-school/${id}`),
        axios.get(`${BASE_URL}/students/school/${id}`),
        axios.get(`${BASE_URL}/classes/by-school/${id}`),
        axios.get(`${BASE_URL}/subjects/school/${id}`),
        axios.get(`${BASE_URL}/hods/school/${id}`),
        axios.get(`${BASE_URL}/receptionists/school/${id}`),
        axios.get(`${BASE_URL}/accountants/school/${id}`),
      ]);

      const getLen = (r) =>
        r.status === "fulfilled" ? r.value.data?.length || 0 : 0;

      setStats({
        teachers: getLen(results[0]),
        students: getLen(results[1]),
        classes: getLen(results[2]),
        subjects: getLen(results[3]),
        hods: getLen(results[4]),
        receptionists: getLen(results[5]),
        accountants: getLen(results[6]),
      });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchool();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-xl font-semibold">
        Loading School Dashboard...
      </div>
    );
  }

  if (!school) {
    return (
      <div className="p-10 text-center text-red-600 font-bold">
        School not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">

      {/* ================= TOP BAR ================= */}
      <div className="flex items-center justify-between mb-6">

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 bg-white shadow rounded-xl hover:bg-gray-100 transition"
        >
          ← Back
        </button>

        <h1 className="text-lg md:text-2xl font-bold text-gray-700">
          School Overview
        </h1>

        <div />
      </div>

      {/* ================= HEADER CARD ================= */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white p-6 md:p-10 rounded-3xl shadow-xl">

        <h1 className="text-2xl md:text-4xl font-black">
          {school.schoolName}
        </h1>

        <div className="mt-4 grid md:grid-cols-2 gap-2 text-sm md:text-base opacity-90">
          <p>📌 Code: {school.schoolCode}</p>
          <p>📧 Email: {school.email}</p>
          <p>📞 Phone: {school.phone}</p>
          <p>📍 {school.address}</p>
        </div>
      </div>

      {/* ================= ADMIN CARD ================= */}
      <div className="bg-white mt-6 p-6 rounded-3xl shadow-lg hover:shadow-xl transition">

        <h2 className="text-xl font-bold mb-4 text-gray-700">
          🏫 School Admin
        </h2>

        <div className="grid md:grid-cols-2 gap-3 text-gray-600">
          <p><span className="font-semibold text-gray-800">Name:</span> {school.schoolAdmin?.name}</p>
          <p><span className="font-semibold text-gray-800">Username:</span> {school.schoolAdmin?.username}</p>
          <p><span className="font-semibold text-gray-800">Email:</span> {school.schoolAdmin?.email}</p>
          <p><span className="font-semibold text-gray-800">Phone:</span> {school.schoolAdmin?.phone}</p>
        </div>

      </div>

      {/* ================= STATS GRID ================= */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">

        <StatCard title="Teachers" value={stats.teachers} color="from-blue-500 to-blue-700" />
        <StatCard title="Students" value={stats.students} color="from-green-500 to-green-700" />
        <StatCard title="Classes" value={stats.classes} color="from-purple-500 to-purple-700" />
        <StatCard title="Subjects" value={stats.subjects} color="from-pink-500 to-pink-700" />
        <StatCard title="HODs" value={stats.hods} color="from-yellow-500 to-yellow-600" />
        <StatCard title="Receptionists" value={stats.receptionists} color="from-indigo-500 to-indigo-700" />
        <StatCard title="Accountants" value={stats.accountants} color="from-red-500 to-red-700" />

      </div>

    </div>
  );
}

// ================= MODERN STATS CARD =================
function StatCard({ title, value, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} text-white p-5 rounded-2xl shadow-lg hover:scale-105 transition duration-300`}>

      <p className="text-sm opacity-90">{title}</p>

      <h2 className="text-3xl font-black mt-2">
        {value}
      </h2>

    </div>
  );
}

export default SchoolOverview;