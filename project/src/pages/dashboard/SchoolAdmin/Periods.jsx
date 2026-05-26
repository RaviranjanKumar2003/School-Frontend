import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    ClockIcon,
    TrashIcon,
    PencilSquareIcon,
    PlusIcon,
    MagnifyingGlassIcon,
    AcademicCapIcon,
    CheckCircleIcon,
    XCircleIcon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api/periods";

function Periods() {

    // =====================================================
    // STATES
    // =====================================================

    const [userData, setUserData] = useState(null);

    const [periods, setPeriods] = useState([]);

    const [loading, setLoading] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [search, setSearch] = useState("");

    const [formData, setFormData] = useState({

        periodNumber: "",

        title: "",

        startTime: "",

        endTime: "",

        type: "PERIOD",

        active: true,
    });

    // =====================================================
    // USER DATA
    // =====================================================

    useEffect(() => {

        const role =
            localStorage
                .getItem("userRole")
                ?.toLowerCase();

        // ================= SCHOOL ADMIN =================

        if (role === "schooladmin") {

            const schoolAdminData =
                JSON.parse(
                    localStorage.getItem(
                        "schoolAdminData"
                    )
                );

            setUserData({

                id: schoolAdminData?.id,

                schoolId:
                    schoolAdminData?.schoolId,

                schoolName:
                    schoolAdminData?.schoolName,
            });
        }

        // ================= HOD =================

        else if (role === "hod") {

            const hodData =
                JSON.parse(
                    localStorage.getItem(
                        "hodData"
                    )
                );

            setUserData({

                id: hodData?.id,

                schoolId:
                    hodData?.school?.id,

                schoolName:
                    hodData?.school?.schoolName,
            });
        }

    }, []);

    // =====================================================
    // FETCH PERIODS
    // =====================================================

    const fetchPeriods = async () => {

        try {

            setLoading(true);

            const res = await axios.get(

                `${BASE_URL}/school/${userData.schoolId}`
            );

            let data =
                Array.isArray(res.data)
                    ? res.data
                    : [];

            // SORT

            data.sort((a, b) => {

                return (
                    Number(a.periodNumber) -
                    Number(b.periodNumber)
                );
            });

            setPeriods(data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (userData?.schoolId) {

            fetchPeriods();
        }

    }, [userData]);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({

            ...formData,

            [name]:
                name === "active"
                    ? value === "true"
                    : value,
        });
    };

    // =====================================================
    // RESET FORM
    // =====================================================

    const resetForm = () => {

        setFormData({

            periodNumber: "",

            title: "",

            startTime: "",

            endTime: "",

            type: "PERIOD",

            active: true,
        });

        setEditingId(null);
    };

    // =====================================================
    // CREATE PERIOD
    // =====================================================

    const createPeriod = async (e) => {

        e.preventDefault();

        try {

            if (
                formData.startTime >=
                formData.endTime
            ) {

                alert(
                    "End time must be greater than start time"
                );

                return;
            }

            const payload = {

                schoolId:
                    userData.schoolId,

                periodNumber:
                    formData.periodNumber,

                title:
                    formData.title,

                startTime:
                    formData.startTime,

                endTime:
                    formData.endTime,

                type:
                    formData.type,

                active:
                    formData.active,
            };

            await axios.post(
                BASE_URL,
                payload
            );

            alert(
                "✅ Period Created Successfully"
            );

            resetForm();

            fetchPeriods();

        } catch (err) {

            console.log(err);

            alert(
                err?.response?.data ||
                "❌ Failed"
            );
        }
    };

    // =====================================================
    // UPDATE PERIOD
    // =====================================================

    const updatePeriod = async (e) => {

        e.preventDefault();

        try {

            const payload = {

                schoolId:
                    userData.schoolId,

                periodNumber:
                    formData.periodNumber,

                title:
                    formData.title,

                startTime:
                    formData.startTime,

                endTime:
                    formData.endTime,

                type:
                    formData.type,

                active:
                    formData.active,
            };

            await axios.put(

                `${BASE_URL}/${editingId}`,

                payload
            );

            alert(
                "✅ Period Updated Successfully"
            );

            resetForm();

            fetchPeriods();

        } catch (err) {

            console.log(err);

            alert(
                "❌ Update Failed"
            );
        }
    };

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = (period) => {

        setEditingId(period.id);

        setFormData({

            periodNumber:
                period.periodNumber || "",

            title:
                period.title || "",

            startTime:
                period.startTime || "",

            endTime:
                period.endTime || "",

            type:
                period.type || "PERIOD",

            active:
                period.active ?? true,
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // =====================================================
    // DELETE
    // =====================================================

    const deletePeriod = async (id) => {

        if (
            !window.confirm(
                "Delete this period?"
            )
        ) return;

        try {

            await axios.delete(
                `${BASE_URL}/${id}`
            );

            fetchPeriods();

        } catch (err) {

            console.log(err);

            alert(
                "❌ Delete Failed"
            );
        }
    };

    // =====================================================
    // DELETE ALL
    // =====================================================

    const deleteAllPeriods = async () => {

        if (
            !window.confirm(
                "Delete ALL periods?"
            )
        ) return;

        try {

            await axios.delete(

                `${BASE_URL}/school/${userData.schoolId}`
            );

            fetchPeriods();

        } catch (err) {

            console.log(err);
        }
    };

    // =====================================================
    // FILTERED PERIODS
    // =====================================================

    const filteredPeriods =
        useMemo(() => {

            return periods.filter((p) =>

                `${p.title} ${p.type}`
                    ?.toLowerCase()
                    .includes(
                        search.toLowerCase()
                    )
            );

        }, [periods, search]);

    // =====================================================
    // TYPE COLOR
    // =====================================================

    const getTypeColor = (type) => {

        switch (type) {

            case "LUNCH":
                return "bg-orange-100 text-orange-700";

            case "BREAK":
                return "bg-pink-100 text-pink-700";

            default:
                return "bg-blue-100 text-blue-700";
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-100 p-3 md:p-6">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-3xl shadow-2xl p-5 md:p-7 mb-6 text-white">

                <div className="flex flex-col xl:flex-row gap-5 xl:items-center xl:justify-between">

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="bg-white/20 p-3 rounded-2xl">

                                <ClockIcon className="w-10 h-10" />

                            </div>

                            <div>

                                <h1 className="text-3xl md:text-5xl font-black">
                                    Period Management
                                </h1>

                                <p className="text-blue-100 mt-1">
                                    Create School Timings & Schedule
                                </p>

                            </div>

                        </div>

                        <div className="mt-4 flex items-center gap-2 text-blue-100">

                            <AcademicCapIcon className="w-5 h-5" />

                            <span>
                                {userData?.schoolName}
                            </span>

                        </div>

                    </div>

                    <div className="bg-white text-blue-700 rounded-3xl px-6 py-5 shadow-xl text-center min-w-[200px]">

                        <p className="text-sm font-semibold">
                            Total Periods
                        </p>

                        <h2 className="text-5xl font-black mt-1">
                            {periods.length}
                        </h2>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* FORM */}
            {/* ================================================= */}

            <form
                onSubmit={
                    editingId
                        ? updatePeriod
                        : createPeriod
                }
                className="bg-white rounded-3xl shadow-xl p-5 md:p-7 mb-6"
            >

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-blue-100 p-3 rounded-2xl">

                        <PlusIcon className="w-7 h-7 text-blue-700" />

                    </div>

                    <div>

                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">

                            {editingId
                                ? "Update Period"
                                : "Create New Period"}

                        </h2>

                        <p className="text-gray-500 text-sm">
                            Add school timing schedule
                        </p>

                    </div>

                </div>

                {/* FORM GRID */}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {/* PERIOD NUMBER */}

                    <div>

                        <label className="text-sm font-semibold text-gray-600 block mb-2">
                            Period Number
                        </label>

                        <input
                            type="number"
                            name="periodNumber"
                            value={formData.periodNumber}
                            onChange={handleChange}
                            placeholder="1"
                            className="w-full border border-gray-300 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                    </div>

                    {/* TITLE */}

                    <div>

                        <label className="text-sm font-semibold text-gray-600 block mb-2">
                            Title
                        </label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Period 1 / Lunch Break"
                            className="w-full border border-gray-300 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                    </div>

                    {/* TYPE */}

                    <div>

                        <label className="text-sm font-semibold text-gray-600 block mb-2">
                            Type
                        </label>

                        <select
                            name="type"
                            value={formData.type}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="PERIOD">
                                PERIOD
                            </option>

                            <option value="BREAK">
                                BREAK
                            </option>

                            <option value="LUNCH">
                                LUNCH
                            </option>

                        </select>

                    </div>

                    {/* START */}

                    <div>

                        <label className="text-sm font-semibold text-gray-600 block mb-2">
                            Start Time
                        </label>

                        <input
                            type="time"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                    </div>

                    {/* END */}

                    <div>

                        <label className="text-sm font-semibold text-gray-600 block mb-2">
                            End Time
                        </label>

                        <input
                            type="time"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />

                    </div>

                    {/* ACTIVE */}

                    <div>

                        <label className="text-sm font-semibold text-gray-600 block mb-2">
                            Status
                        </label>

                        <select
                            name="active"
                            value={String(formData.active)}
                            onChange={handleChange}
                            className="w-full border border-gray-300 p-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                        >

                            <option value="true">
                                Active
                            </option>

                            <option value="false">
                                Inactive
                            </option>

                        </select>

                    </div>

                </div>

                {/* BUTTONS */}

                <div className="flex flex-col md:flex-row gap-4 mt-7">

                    <button
                        type="submit"
                        className={`flex-1 py-4 rounded-2xl text-white font-bold text-lg transition-all duration-300 ${
                            editingId
                                ? "bg-yellow-500 hover:bg-yellow-600"
                                : "bg-blue-600 hover:bg-blue-700"
                        }`}
                    >

                        {editingId
                            ? "Update Period"
                            : "Create Period"}

                    </button>

                    {editingId && (

                        <button
                            type="button"
                            onClick={resetForm}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-2xl font-bold text-lg"
                        >
                            Cancel
                        </button>

                    )}

                </div>

            </form>

            {/* ================================================= */}
            {/* SEARCH */}
            {/* ================================================= */}

            <div className="bg-white rounded-3xl shadow-xl p-5 md:p-6 mb-6">

                <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">

                    <div className="relative w-full xl:w-[400px]">

                        <MagnifyingGlassIcon className="w-5 h-5 absolute left-4 top-4 text-gray-400" />

                        <input
                            type="text"
                            placeholder="Search Period..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                            className="w-full border border-gray-300 pl-12 pr-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500"
                        />

                    </div>

                    <button
                        onClick={deleteAllPeriods}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl font-bold"
                    >
                        Delete All
                    </button>

                </div>

            </div>

            {/* ================================================= */}
            {/* LIST */}
            {/* ================================================= */}

            {loading ? (

                <div className="bg-white rounded-3xl shadow-xl p-10 text-center text-gray-500 text-lg">
                    Loading...
                </div>

            ) : filteredPeriods.length === 0 ? (

                <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

                    <ClockIcon className="w-16 h-16 mx-auto text-gray-300 mb-4" />

                    <h2 className="text-2xl font-bold text-gray-700">
                        No Periods Found
                    </h2>

                    <p className="text-gray-500 mt-2">
                        Create your first period
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">

                    {filteredPeriods.map((period) => (

                        <div
                            key={period.id}
                            className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        >

                            {/* TOP */}

                            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">

                                <div className="flex items-center justify-between">

                                    <div>

                                        <p className="text-sm opacity-90">
                                            Period Number
                                        </p>

                                        <h2 className="text-4xl font-black">
                                            {period.periodNumber}
                                        </h2>

                                    </div>

                                    <div className="bg-white/20 p-4 rounded-2xl">

                                        <ClockIcon className="w-10 h-10" />

                                    </div>

                                </div>

                            </div>

                            {/* BODY */}

                            <div className="p-5">

                                {/* TITLE */}

                                <div className="mb-5">

                                    <h3 className="text-2xl font-bold text-gray-800">
                                        {period.title}
                                    </h3>

                                    <div className="flex items-center gap-2 mt-3 flex-wrap">

                                        <span className={`px-4 py-1 rounded-full text-sm font-bold ${getTypeColor(period.type)}`}>

                                            {period.type}

                                        </span>

                                        {period.active ? (

                                            <span className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">

                                                <CheckCircleIcon className="w-4 h-4" />

                                                ACTIVE

                                            </span>

                                        ) : (

                                            <span className="bg-red-100 text-red-700 px-4 py-1 rounded-full text-sm font-bold flex items-center gap-1">

                                                <XCircleIcon className="w-4 h-4" />

                                                INACTIVE

                                            </span>

                                        )}

                                    </div>

                                </div>

                                {/* TIME */}

                                <div className="bg-gray-100 rounded-2xl p-4 mb-5">

                                    <p className="text-sm text-gray-500">
                                        Time Duration
                                    </p>

                                    <h2 className="text-2xl font-black text-blue-700 mt-1">

                                        {period.startTime}
                                        {" - "}
                                        {period.endTime}

                                    </h2>

                                </div>

                                {/* BUTTONS */}

                                <div className="grid grid-cols-2 gap-3">

                                    <button
                                        onClick={() =>
                                            handleEdit(period)
                                        }
                                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                                    >

                                        <PencilSquareIcon className="w-5 h-5" />

                                        Edit

                                    </button>

                                    <button
                                        onClick={() =>
                                            deletePeriod(period.id)
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
                                    >

                                        <TrashIcon className="w-5 h-5" />

                                        Delete

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}

export default Periods;