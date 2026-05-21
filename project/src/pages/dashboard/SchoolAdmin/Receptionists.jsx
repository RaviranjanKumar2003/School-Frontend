import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  FaPlus,
  FaPhoneAlt,
  FaEnvelope,
  FaSearch,
  FaEye,
  FaTimes,
  FaClipboardList,
  FaUserCheck,
  FaPhoneVolume,
  FaCalendarCheck,
  FaClock,
  FaChevronDown,
  FaChevronUp,
  FaUsers,
  FaChartLine,
  FaWhatsapp,
  FaSms,
} from "react-icons/fa";

const BASE_URL = "http://localhost:8080/api";

function Receptionists() {

  // =====================================================
  // STATES
  // =====================================================

  const [receptionists, setReceptionists] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [selectedReceptionist, setSelectedReceptionist] =
    useState(null);

  const [expandedActivity, setExpandedActivity] =
    useState(null);

  const [formData, setFormData] =
    useState({
      name: "",
      email: "",
      phone: "",
      image: null,
    });

  const [dashboardData, setDashboardData] =
    useState({});

  // =====================================================
  // FETCH ALL DATA
  // =====================================================

  const fetchReceptionists = async () => {

    try {

      const schoolAdminData =
        JSON.parse(
          localStorage.getItem("schoolAdminData")
        );

      const schoolId =
        schoolAdminData?.schoolId;

      // ================= RECEPTIONISTS =================

      const receptionistRes =
        await axios.get(
          `${BASE_URL}/receptionists/school/${schoolId}`
        );

      const receptionistList =
        receptionistRes.data || [];

      // ================= FETCH ACTIVITY FOR EACH =================

      const finalData =
        await Promise.all(

          receptionistList.map(async (r) => {

            try {

              // =========================================
              // INQUIRIES
              // =========================================

              const inquiryRes =
                await axios.get(
                  `${BASE_URL}/inquiries/school/${schoolAdminData?.schoolCode}`
                );

              const inquiries =
                inquiryRes.data || [];

              // =========================================
              // FILTER RECEPTIONIST INQUIRIES
              // =========================================

              const myInquiries =
                inquiries.filter(
                  (i) =>
                    i?.createdBy === r?.username
                    ||
                    i?.createdBy === r?.email
                    ||
                    i?.createdBy === r?.name
                );

              // =========================================
              // CALL LOGS
              // =========================================

              const callLogsRes =
                await axios.get(
                  `${BASE_URL}/calllogs`
                );

              const callLogs =
                (callLogsRes.data || [])
                  .filter(
                    (c) =>
                      c?.calledBy === r?.username
                      ||
                      c?.calledBy === r?.email
                      ||
                      c?.calledBy === r?.name
                  );

              // =========================================
              // FOLLOWUPS
              // =========================================

              const followRes =
                await axios.get(
                  `${BASE_URL}/followups`
                );

              const followUps =
                (followRes.data || [])
                  .filter(
                    (f) =>
                      f?.updatedBy === r?.username
                      ||
                      f?.updatedBy === r?.email
                      ||
                      f?.updatedBy === r?.name
                  );

              // =========================================
              // TODAY DATA
              // =========================================

              const today =
                new Date().toDateString();

              const todayInquiry =
                myInquiries.filter(
                  (i) =>
                    new Date(
                      i.createdAt
                    ).toDateString() === today
                );

              const todayCalls =
                callLogs.filter(
                  (c) =>
                    new Date(
                      c.callTime
                    ).toDateString() === today
                );

              const pendingFollowUps =
                followUps.filter(
                  (f) =>
                    f.status !== "DONE"
                );

              // =========================================
              // RECENT ACTIVITY
              // =========================================

              const recentActivities = [];

              callLogs.slice(0, 3).forEach((c) => {

                recentActivities.push({
                  type: "CALL",
                  text:
                    c.remarks ||
                    "Parent Call",
                  time: c.callTime,
                });
              });

              followUps.slice(0, 3).forEach((f) => {

                recentActivities.push({
                  type: "FOLLOWUP",
                  text:
                    f.remark ||
                    "Follow Up",
                  time: f.createdAt,
                });
              });

              recentActivities.sort(
                (a, b) =>
                  new Date(b.time) -
                  new Date(a.time)
              );

              // =========================================
              // PERFORMANCE
              // =========================================

              let performance =
                "Average";

              if (
                myInquiries.length >= 20
              ) {
                performance =
                  "Excellent";
              } else if (
                myInquiries.length >= 10
              ) {
                performance =
                  "Good";
              }

              return {

                ...r,

                dashboard: {

                  totalInquiries:
                    myInquiries.length,

                  todayInquiry:
                    todayInquiry.length,

                  totalCalls:
                    callLogs.length,

                  todayCalls:
                    todayCalls.length,

                  totalFollowUps:
                    followUps.length,

                  pendingFollowUps:
                    pendingFollowUps.length,

                  admissions:
                    myInquiries.filter(
                      (i) =>
                        i.status ===
                        "ADMISSION_DONE"
                    ).length,

                  performance,

                  recentActivities,
                },
              };

            } catch (err) {

              console.log(err);

              return {
                ...r,
                dashboard: {},
              };
            }
          })
        );

      setReceptionists(finalData);

    } catch (err) {

      console.log(err);

      setReceptionists([]);
    }
  };

  useEffect(() => {

    fetchReceptionists();

  }, []);

  // =====================================================
  // FORM HANDLERS
  // =====================================================

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleFileChange = (e) => {

    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // =====================================================
  // CREATE
  // =====================================================

  const createReceptionist = async (e) => {

    e.preventDefault();

    try {

      const schoolAdminData =
        JSON.parse(
          localStorage.getItem("schoolAdminData")
        );

      const schoolId =
        schoolAdminData?.schoolId;

      const dto = {

        name: formData.name,

        email: formData.email,

        phone: formData.phone,

        schoolId,
      };

      const data =
        new FormData();

      data.append(
        "data",

        new Blob(
          [JSON.stringify(dto)],

          {
            type:
              "application/json",
          }
        )
      );

      if (formData.image) {

        data.append(
          "image",
          formData.image
        );
      }

      await axios.post(

        `${BASE_URL}/receptionists`,

        data,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      alert(
        "Receptionist Created Successfully"
      );

      setShowCreateModal(false);

      setFormData({
        name: "",
        email: "",
        phone: "",
        image: null,
      });

      fetchReceptionists();

    } catch (err) {

      console.log(err);

      alert(
        "Error creating receptionist"
      );
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filtered =
    receptionists.filter((r) =>

      r?.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      r?.email
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

      ||

      r?.phone
        ?.includes(search)
    );

  // =====================================================
  // IMAGE URL
  // =====================================================

  const getImageUrl = (
    imageName
  ) => {

    if (!imageName) return null;

    return `${BASE_URL}/receptionists/image/${imageName}`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4 md:p-6">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

        <div>

          <h1 className="text-4xl font-black text-gray-800">
            Receptionists
          </h1>

          <p className="text-gray-500 mt-1">
            Monitor reception team activities
          </p>

        </div>

        <button

          onClick={() =>
            setShowCreateModal(true)
          }

          className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:scale-105 transition text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg"
        >

          <FaPlus />

          Add Receptionist

        </button>

      </div>

      {/* ================================================= */}
      {/* SEARCH */}
      {/* ================================================= */}

      <div className="bg-white p-4 rounded-3xl shadow mb-7">

        <div className="relative">

          <FaSearch className="absolute left-4 top-4 text-gray-400" />

          <input

            className="w-full border border-gray-200 pl-12 p-3 rounded-2xl outline-none focus:border-blue-500"

            placeholder="Search receptionist..."

            value={search}

            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* CARDS */}
      {/* ================================================= */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {filtered.map((r) => (

          <div

            key={r.id}

            className="bg-white rounded-3xl p-5 shadow-xl border border-gray-100 hover:-translate-y-1 transition-all"
          >

            {/* ============================================= */}
            {/* TOP */}
            {/* ============================================= */}

            <div className="flex items-center gap-4">

              {r.imageUrl ? (

                <img

                  src={getImageUrl(r.imageUrl)}

                  alt="Receptionist"

                  className="w-20 h-20 rounded-2xl object-cover border-4 border-blue-100"

                />

              ) : (

                <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center text-white font-black text-3xl">

                  {r.name?.charAt(0)}

                </div>
              )}

              <div className="flex-1">

                <h2 className="font-black text-2xl text-gray-800">
                  {r.name}
                </h2>

                <p className="text-gray-500">
                  Receptionist
                </p>

                <div className="mt-3 flex flex-wrap gap-2">

                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">
                    {r.dashboard?.performance}
                  </div>

                  <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                    Active
                  </div>

                </div>

              </div>

            </div>

            {/* ============================================= */}
            {/* DETAILS */}
            {/* ============================================= */}

            <div className="mt-5 space-y-3 text-gray-700">

              <div className="flex items-center gap-3">
                <FaPhoneAlt className="text-blue-700" />
                {r.phone}
              </div>

              <div className="flex items-center gap-3">
                <FaEnvelope className="text-purple-700" />
                {r.email}
              </div>

            </div>

            {/* ============================================= */}
            {/* STATS */}
            {/* ============================================= */}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">

              <div className="bg-blue-50 p-4 rounded-2xl">

                <div className="text-sm text-gray-500">
                  Inquiry
                </div>

                <div className="text-2xl font-black text-blue-700">
                  {r.dashboard?.totalInquiries || 0}
                </div>

              </div>

              <div className="bg-green-50 p-4 rounded-2xl">

                <div className="text-sm text-gray-500">
                  Calls
                </div>

                <div className="text-2xl font-black text-green-700">
                  {r.dashboard?.totalCalls || 0}
                </div>

              </div>

              <div className="bg-orange-50 p-4 rounded-2xl">

                <div className="text-sm text-gray-500">
                  FollowUps
                </div>

                <div className="text-2xl font-black text-orange-700">
                  {r.dashboard?.totalFollowUps || 0}
                </div>

              </div>

              <div className="bg-purple-50 p-4 rounded-2xl">

                <div className="text-sm text-gray-500">
                  Admission
                </div>

                <div className="text-2xl font-black text-purple-700">
                  {r.dashboard?.admissions || 0}
                </div>

              </div>

            </div>

            {/* ============================================= */}
            {/* BUTTONS */}
            {/* ============================================= */}

            <div className="flex flex-wrap gap-3 mt-6">

              <button

                onClick={() =>
                  setSelectedReceptionist(r)
                }

                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >

                <FaEye />

                View

              </button>

              <button

                onClick={() =>
                  setExpandedActivity(
                    expandedActivity === r.id
                      ? null
                      : r.id
                  )
                }

                className="bg-gradient-to-r from-purple-600 to-indigo-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
              >

                <FaClipboardList />

                Activities

                {expandedActivity === r.id
                  ? <FaChevronUp />
                  : <FaChevronDown />
                }

              </button>

            </div>

            {/* ============================================= */}
            {/* EXPANDED ACTIVITY */}
            {/* ============================================= */}

            {expandedActivity === r.id && (

              <div className="mt-7 border-t pt-6">

                {/* ========================================= */}
                {/* TOP CARDS */}
                {/* ========================================= */}

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl p-4">

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="text-sm">
                          Today's Inquiry
                        </div>

                        <div className="text-3xl font-black mt-1">
                          {r.dashboard?.todayInquiry || 0}
                        </div>

                      </div>

                      <FaUsers className="text-3xl" />

                    </div>

                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-2xl p-4">

                    <div className="flex items-center justify-between">

                      <div>

                        <div className="text-sm">
                          Today's Calls
                        </div>

                        <div className="text-3xl font-black mt-1">
                          {r.dashboard?.todayCalls || 0}
                        </div>

                      </div>

                      <FaPhoneVolume className="text-3xl" />

                    </div>

                  </div>

                </div>

                {/* ========================================= */}
                {/* EXTRA */}
                {/* ========================================= */}

                <div className="mt-6 space-y-4">

                  <div className="flex items-center gap-3 text-gray-700">

                    <FaCalendarCheck className="text-orange-600" />

                    Pending FollowUps:

                    <span className="font-bold">
                      {r.dashboard?.pendingFollowUps || 0}
                    </span>

                  </div>

                  <div className="flex items-center gap-3 text-gray-700">

                    <FaChartLine className="text-green-600" />

                    Performance:

                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                      {r.dashboard?.performance}
                    </span>

                  </div>

                </div>

                {/* ========================================= */}
                {/* RECENT ACTIVITIES */}
                {/* ========================================= */}

                <div className="mt-7">

                  <h3 className="font-black text-lg mb-4">
                    Recent Activities
                  </h3>

                  {r.dashboard?.recentActivities?.length === 0 ? (

                    <div className="bg-gray-100 rounded-2xl p-4 text-gray-500 text-sm">
                      No Recent Activities
                    </div>

                  ) : (

                    <div className="space-y-3">

                      {r.dashboard?.recentActivities?.map(
                        (a, i) => (

                          <div
                            key={i}
                            className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-start gap-3"
                          >

                            <div className="bg-blue-100 p-3 rounded-xl">

                              {a.type === "CALL"
                                ? (
                                  <FaPhoneVolume className="text-blue-700" />
                                )
                                : (
                                  <FaCalendarCheck className="text-orange-700" />
                                )}

                            </div>

                            <div className="flex-1">

                              <div className="font-semibold text-gray-800">
                                {a.text}
                              </div>

                              <div className="text-xs text-gray-500 mt-1">
                                {a.time
                                  ? new Date(
                                      a.time
                                    ).toLocaleString()
                                  : "N/A"}
                              </div>

                            </div>

                          </div>
                        )
                      )}

                    </div>

                  )}

                </div>

              </div>

            )}

          </div>
        ))}

      </div>

      {/* ================================================= */}
      {/* VIEW MODAL */}
      {/* ================================================= */}

      {selectedReceptionist && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white rounded-3xl p-6 w-full max-w-lg">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-black">
                Receptionist Details
              </h2>

              <FaTimes

                className="cursor-pointer text-xl"

                onClick={() =>
                  setSelectedReceptionist(null)
                }
              />

            </div>

            <div className="space-y-4">

              <div>
                <b>Name:</b>{" "}
                {selectedReceptionist.name}
              </div>

              <div>
                <b>Email:</b>{" "}
                {selectedReceptionist.email}
              </div>

              <div>
                <b>Phone:</b>{" "}
                {selectedReceptionist.phone}
              </div>

              <div>
                <b>Username:</b>{" "}
                {selectedReceptionist.username}
              </div>

            </div>

          </div>

        </div>
      )}

      {/* ================================================= */}
      {/* CREATE MODAL */}
      {/* ================================================= */}

      {showCreateModal && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

          <div className="bg-white p-6 rounded-3xl w-full max-w-md">

            <div className="flex justify-between items-center mb-5">

              <h2 className="text-2xl font-black">
                Create Receptionist
              </h2>

              <FaTimes

                className="cursor-pointer"

                onClick={() =>
                  setShowCreateModal(false)
                }
              />

            </div>

            <form
              onSubmit={createReceptionist}
              className="space-y-4"
            >

              <input

                name="name"

                placeholder="Name"

                onChange={handleChange}

                value={formData.name}

                required

                className="w-full border p-3 rounded-2xl outline-none"
              />

              <input

                name="email"

                type="email"

                placeholder="Email"

                onChange={handleChange}

                value={formData.email}

                required

                className="w-full border p-3 rounded-2xl outline-none"
              />

              <input

                name="phone"

                placeholder="Phone"

                onChange={handleChange}

                value={formData.phone}

                required

                className="w-full border p-3 rounded-2xl outline-none"
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />

              <button className="w-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white p-3 rounded-2xl font-bold">

                Create Receptionist

              </button>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default Receptionists;