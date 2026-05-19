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
  FaUserGraduate,
  FaImage,
} from "react-icons/fa";

const BASE_URL = "http://localhost:8080/api/receptionists";

function Receptionists() {

  // ================= STATES =================
  const [receptionists, setReceptionists] = useState([]);
  const [search, setSearch] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedReceptionist, setSelectedReceptionist] = useState(null);
  const [activityReceptionist, setActivityReceptionist] = useState(null);

  const [generatedCreds, setGeneratedCreds] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    image: null,
  });

  // ================= FETCH =================
  const fetchReceptionists = async () => {
    try {
      const schoolAdminData = JSON.parse(localStorage.getItem("schoolAdminData"));
      const schoolId = schoolAdminData?.schoolId;

      const res = await axios.get(`${BASE_URL}/school/${schoolId}`);
      setReceptionists(Array.isArray(res.data) ? res.data : []);

    } catch (err) {
      console.log(err);
      setReceptionists([]);
    }
  };

  useEffect(() => {
    fetchReceptionists();
  }, []);

  // ================= INPUT =================
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      image: e.target.files[0],
    });
  };

  // ================= CREATE =================
  const createReceptionist = async (e) => {
    e.preventDefault();

    try {
      const schoolAdminData = JSON.parse(localStorage.getItem("schoolAdminData"));
      const schoolId = schoolAdminData?.schoolId;

      const dto = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        schoolId: schoolId,
      };

      const data = new FormData();

      data.append(
        "data",
        new Blob([JSON.stringify(dto)], {
          type: "application/json",
        })
      );

      if (formData.image) {
        data.append("image", formData.image);
      }

      const res = await axios.post(BASE_URL, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setGeneratedCreds(res.data);

      setShowCreateModal(false);
      setFormData({ name: "", email: "", phone: "", image: null });

      fetchReceptionists();

    } catch (err) {
      console.log(err);
      alert("Error creating receptionist");
    }
  };

  // ================= SEARCH =================
  const filtered = receptionists.filter((r) =>
    r?.name?.toLowerCase().includes(search.toLowerCase()) ||
    r?.email?.toLowerCase().includes(search.toLowerCase()) ||
    r?.phone?.includes(search)
  );

  // ================= UI =================
  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Receptionists</h1>
          <p className="text-gray-500">Manage reception department</p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
        >
          <FaPlus /> Add Receptionist
        </button>
      </div>

      {/* SEARCH */}
      <div className="bg-white p-4 rounded-2xl mb-6 shadow">
        <div className="relative">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            className="w-full border pl-10 p-2 rounded-xl"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {filtered.map((r) => (
          <div key={r.id} className="bg-white p-5 rounded-2xl shadow">

            {/* TOP */}
            <div className="flex items-center gap-3">

              {r.imageUrl ? (
                <img
                  src={r.imageUrl}
                  className="w-14 h-14 rounded-full object-cover"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                  {r.name?.charAt(0)}
                </div>
              )}

              <div>
                <h2 className="font-bold">{r.name}</h2>
                <p className="text-sm text-gray-500">Receptionist</p>
              </div>
            </div>

            {/* DETAILS */}
            <div className="mt-4 space-y-2 text-gray-600">
              <p className="flex gap-2 items-center">
                <FaPhoneAlt /> {r.phone}
              </p>
              <p className="flex gap-2 items-center">
                <FaEnvelope /> {r.email}
              </p>
            </div>

            {/* BUTTONS */}
            <div className="flex gap-3 mt-5">

              <button
                onClick={() => setSelectedReceptionist(r)}
                className="bg-blue-600 text-white px-3 py-2 rounded-xl flex items-center gap-2"
              >
                <FaEye /> View
              </button>

              <button
                onClick={() => setActivityReceptionist(r)}
                className="bg-purple-600 text-white px-3 py-2 rounded-xl flex items-center gap-2"
              >
                <FaClipboardList /> Activities
              </button>

            </div>
          </div>
        ))}
      </div>

      {/* ================= VIEW MODAL ================= */}
      {selectedReceptionist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md">

            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-xl">Details</h2>
              <FaTimes onClick={() => setSelectedReceptionist(null)} />
            </div>

            <p><b>Name:</b> {selectedReceptionist.name}</p>
            <p><b>Email:</b> {selectedReceptionist.email}</p>
            <p><b>Phone:</b> {selectedReceptionist.phone}</p>

          </div>
        </div>
      )}

      {/* ================= ACTIVITIES MODAL ================= */}
      {activityReceptionist && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white p-6 rounded-2xl w-full max-w-md">

            <div className="flex justify-between mb-4">
              <h2 className="font-bold text-xl">
                {activityReceptionist.name}
              </h2>
              <FaTimes onClick={() => setActivityReceptionist(null)} />
            </div>

            <div className="space-y-3">

              <div className="bg-blue-100 p-3 rounded-xl">
                Today Inquiry: <b>12</b>
              </div>

              <div className="bg-green-100 p-3 rounded-xl">
                Admission Done: <b>4</b>
              </div>

              <div className="bg-yellow-100 p-3 rounded-xl">
                Pending Follow-up: <b>7</b>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">

          <div className="bg-white p-6 rounded-2xl w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">Create Receptionist</h2>

            <form onSubmit={createReceptionist} className="space-y-3">

              <input
                name="name"
                placeholder="Name"
                onChange={handleChange}
                className="w-full border p-2 rounded-xl"
              />

              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                className="w-full border p-2 rounded-xl"
              />

              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                className="w-full border p-2 rounded-xl"
              />

              <input type="file" onChange={handleFileChange} />

              <button className="bg-blue-700 text-white w-full p-2 rounded-xl">
                Create
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}

export default Receptionists;