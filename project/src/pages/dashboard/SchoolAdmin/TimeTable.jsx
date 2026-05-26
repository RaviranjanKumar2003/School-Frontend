import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
    PlusIcon,
    AcademicCapIcon,
    CalendarDaysIcon,
    ClockIcon,
    TrashIcon,
    UserIcon,
    BookOpenIcon,
    BuildingOffice2Icon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

function TimeTable() {

    // =====================================================
    // STATES
    // =====================================================

    const [userData, setUserData] = useState(null);

    const [classes, setClasses] = useState([]);

    const [sections, setSections] = useState([]);

    const [teachers, setTeachers] = useState([]);

    const [periods, setPeriods] = useState([]);

    const [timeTables, setTimeTables] = useState([]);

    const [loading, setLoading] = useState(false);

    const [creating, setCreating] = useState(false);

    // =====================================================
    // FILTERS
    // =====================================================

    const [selectedClassId, setSelectedClassId] = useState("");

    const [selectedSection, setSelectedSection] = useState("");

    // =====================================================
    // FORM
    // =====================================================

    const [formData, setFormData] = useState({

        classId: "",

        sectionName: "",

        teacherId: "",

        subjectName: "",

        periodId: "",

        dayName: "MONDAY",
    });

    // =====================================================
    // DAYS
    // =====================================================

    const days = [
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
    ];

    // =====================================================
    // USER DATA
    // =====================================================

    useEffect(() => {

        const role =
            localStorage
                .getItem("userRole")
                ?.toLowerCase();

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
    // FETCH CLASSES
    // =====================================================

    const fetchClasses = async () => {

        try {

            const res = await axios.get(

                `${BASE_URL}/classes/by-school/${userData.schoolId}`
            );

            const classData =
                Array.isArray(res.data)
                    ? res.data
                    : [];

            // =================================================
            // FETCH SECTIONS FOR EVERY CLASS
            // =================================================

            const updatedClasses =
                await Promise.all(

                    classData.map(async (cls) => {

                        try {

                            const sectionRes =
                                await axios.get(

                                    `${BASE_URL}/sections/${userData.schoolId}/${cls.id}`
                                );

                            return {

                                ...cls,

                                sections:
                                    Array.isArray(sectionRes.data)
                                        ? sectionRes.data
                                        : [],
                            };

                        } catch (err) {

                            console.log(err);

                            return {

                                ...cls,

                                sections: [],
                            };
                        }
                    })
                );

            setClasses(updatedClasses);

        } catch (err) {

            console.log(err);
        }
    };

    // =====================================================
    // FETCH PERIODS
    // =====================================================

    const fetchPeriods = async () => {

        try {

            const res = await axios.get(

                `${BASE_URL}/periods/school/${userData.schoolId}`
            );

            let data =
                Array.isArray(res.data)
                    ? res.data
                    : [];

            data.sort((a, b) => {

                return (
                    a.startTime?.localeCompare(
                        b.startTime
                    )
                );
            });

            setPeriods(data);

        } catch (err) {

            console.log(err);
        }
    };

    // =====================================================
    // FETCH TEACHERS
    // =====================================================

    const fetchTeachers = async () => {

        try {

            const res = await axios.get(

                `${BASE_URL}/professors/by-school/${userData.schoolId}`
            );

            setTeachers(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

        } catch (err) {

            console.log(err);
        }
    };

    // =====================================================
    // FETCH TIMETABLE
    // =====================================================

    const fetchTimeTable = async () => {

        try {

            setLoading(true);

            const res = await axios.get(

                `${BASE_URL}/timetable/school/${userData.schoolId}`
            );

            setTimeTables(
                Array.isArray(res.data)
                    ? res.data
                    : []
            );

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

            fetchClasses();

            fetchTeachers();

            fetchPeriods();

            fetchTimeTable();
        }

    }, [userData]);

    // =====================================================
    // CLASS CHANGE => LOAD SECTION
    // =====================================================

    useEffect(() => {

        if (!formData.classId) {

            setSections([]);

            return;
        }

        const selectedClass =
            classes.find(
                (c) =>
                    String(c.id) ===
                    String(formData.classId)
            );

        setSections(
            selectedClass?.sections || []
        );

        setFormData((prev) => ({

            ...prev,

            sectionName: "",

            teacherId: "",

            subjectName: "",
        }));

    }, [formData.classId, classes]);

    // =====================================================
    // FILTER SECTION
    // =====================================================

    const filterSections = useMemo(() => {

        if (!selectedClassId)
            return [];

        const cls =
            classes.find(
                (c) =>
                    String(c.id) ===
                    String(selectedClassId)
            );

        return cls?.sections || [];

    }, [selectedClassId, classes]);

    // =====================================================
    // SELECTED CLASS
    // =====================================================

    const selectedClass = useMemo(() => {

        return classes.find(
            (c) =>
                String(c.id) ===
                String(formData.classId)
        );

    }, [classes, formData.classId]);

    // =====================================================
    // FILTERED TEACHERS
    // =====================================================

    const filteredTeachers = useMemo(() => {

        if (!selectedClass)
            return [];

        return teachers.filter((teacher) =>

            teacher?.assignments?.some(

                (a) =>

                    String(a.classId) ===
                    String(selectedClass.id)
            )
        );

    }, [teachers, selectedClass]);

    // =====================================================
    // FILTERED SUBJECTS
    // =====================================================

    const filteredSubjects = useMemo(() => {

        if (!formData.teacherId)
            return [];

        const teacher =
            teachers.find(
                (t) =>
                    String(t.id) ===
                    String(formData.teacherId)
            );

        if (!teacher)
            return [];

        return teacher.assignments?.filter(

            (a) =>
                String(a.classId) ===
                String(formData.classId)
        );

    }, [
        teachers,
        formData.teacherId,
        formData.classId,
    ]);

    // =====================================================
    // HANDLE CHANGE
    // =====================================================

    const handleChange = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value,
        });
    };

    // =====================================================
    // CREATE TIMETABLE
    // =====================================================

    const createTimeTable = async (e) => {

        e.preventDefault();

        try {

            setCreating(true);

            const teacher =
                teachers.find(
                    (t) =>
                        String(t.id) ===
                        String(formData.teacherId)
                );

            const period =
                periods.find(
                    (p) =>
                        String(p.id) ===
                        String(formData.periodId)
                );

            const payload = {

    schoolId: userData.schoolId,

    classId: formData.classId,

    className: selectedClass?.className,

    sectionName: formData.sectionName,

    teacherId: teacher?.id,

    teacherName: teacher?.name,

    subjectName: formData.subjectName,

    dayName: formData.dayName,

    periodNumber: period?.periodNumber,

    startTime: period?.startTime,

    endTime: period?.endTime,
};

            await axios.post(

                `${BASE_URL}/timetable/create`,

                payload
            );

            alert(
                "✅ Timetable Created Successfully"
            );

            setFormData({

                classId: "",

                sectionName: "",

                teacherId: "",

                subjectName: "",

                periodId: "",

                dayName: "MONDAY",
            });

            fetchTimeTable();

        } catch (err) {

            console.log(err);

            alert(
                err?.response?.data ||
                "❌ Failed"
            );

        } finally {

            setCreating(false);
        }
    };

    // =====================================================
    // DELETE TIMETABLE
    // =====================================================

    const deleteTimeTable = async (id) => {

        if (
            !window.confirm(
                "Delete timetable?"
            )
        ) return;

        try {

            await axios.delete(

                `${BASE_URL}/timetable/${id}`
            );

            fetchTimeTable();

        } catch (err) {

            console.log(err);
        }
    };

    // =====================================================
    // FILTERED TIMETABLES
    // =====================================================

    const filteredTimeTables =
        timeTables.filter((t) => {

            const classMatch =
                selectedClassId
                    ? String(t.classId) ===
                      String(selectedClassId)
                    : true;

            const sectionMatch =
                selectedSection
                    ? t.section ===
                      selectedSection
                    : true;

            return (
                classMatch &&
                sectionMatch
            );
        });

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-3 md:p-6">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="bg-white rounded-[30px] shadow-xl p-5 md:p-8 mb-6">

                <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">

                    <div>

                        <div className="flex items-center gap-4">

                            <div className="bg-blue-600 p-4 rounded-3xl shadow-lg">

                                <CalendarDaysIcon className="w-10 h-10 text-white" />

                            </div>

                            <div>

                                <h1 className="text-3xl md:text-5xl font-black text-gray-800">
                                    Time Table
                                </h1>

                                <p className="text-gray-500 mt-1">
                                    Manage School TimeTable
                                </p>

                            </div>

                        </div>

                        <div className="mt-5 flex items-center gap-2 text-gray-600">

                            <BuildingOffice2Icon className="w-5 h-5 text-blue-600" />

                            <span className="font-semibold">
                                {userData?.schoolName}
                            </span>

                        </div>

                    </div>

                    <div className="grid grid-cols-2 gap-4">

                        <div className="bg-blue-600 text-white rounded-3xl px-6 py-5 text-center shadow-lg">

                            <p className="text-sm">
                                Total Timetables
                            </p>

                            <h2 className="text-4xl font-black mt-1">
                                {timeTables.length}
                            </h2>

                        </div>

                        <div className="bg-green-600 text-white rounded-3xl px-6 py-5 text-center shadow-lg">

                            <p className="text-sm">
                                Total Periods
                            </p>

                            <h2 className="text-4xl font-black mt-1">
                                {periods.length}
                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* CREATE FORM */}
            {/* ================================================= */}

            <form
                onSubmit={createTimeTable}
                className="bg-white rounded-[30px] shadow-xl p-5 md:p-8 mb-6"
            >

                <div className="flex items-center gap-3 mb-6">

                    <div className="bg-blue-100 p-3 rounded-2xl">

                        <PlusIcon className="w-7 h-7 text-blue-700" />

                    </div>

                    <div>

                        <h2 className="text-3xl font-black text-gray-800">
                            Create TimeTable
                        </h2>

                        <p className="text-gray-500">
                            Add class routine easily
                        </p>

                    </div>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {/* CLASS */}

                    <div>

                        <label className="font-semibold text-gray-700 mb-2 block">
                            Class
                        </label>

                        <select
                            name="classId"
                            value={formData.classId}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 focus:border-blue-500 p-4 rounded-2xl outline-none"
                            required
                        >

                            <option value="">
                                Select Class
                            </option>

                            {classes.map((cls) => (

                                <option
                                    key={cls.id}
                                    value={cls.id}
                                >
                                    {cls.className}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* SECTION */}

                    <div>

                        <label className="font-semibold text-gray-700 mb-2 block">
                            Section
                        </label>

                        <select
                            name="sectionName"
                            value={formData.sectionName}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 focus:border-blue-500 p-4 rounded-2xl outline-none"
                            required
                        >

                            <option value="">
                                Select Section
                            </option>

                            {sections.map((sec) => (

                                <option
                                    key={sec.id}
                                    value={sec.sectionName}
                                >
                                    {sec.sectionName}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* TEACHER */}

                    <div>

                        <label className="font-semibold text-gray-700 mb-2 block">
                            Teacher
                        </label>

                        <select
                            name="teacherId"
                            value={formData.teacherId}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 focus:border-blue-500 p-4 rounded-2xl outline-none"
                            required
                        >

                            <option value="">
                                Select Teacher
                            </option>

                            {filteredTeachers.map((teacher) => (

                                <option
                                    key={teacher.id}
                                    value={teacher.id}
                                >
                                    {teacher.name}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* SUBJECT */}

                    <div>

                        <label className="font-semibold text-gray-700 mb-2 block">
                            Subject
                        </label>

                        <select
                            name="subjectName"
                            value={formData.subjectName}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 focus:border-blue-500 p-4 rounded-2xl outline-none"
                            required
                        >

                            <option value="">
                                Select Subject
                            </option>

                            {filteredSubjects.map((sub, i) => (

                                <option
                                    key={i}
                                    value={sub.subjectName}
                                >
                                    {sub.subjectName}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* DAY */}

                    <div>

                        <label className="font-semibold text-gray-700 mb-2 block">
                            Day
                        </label>

                        <select
                            name="dayName"
                            value={formData.dayName}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 focus:border-blue-500 p-4 rounded-2xl outline-none"
                        >

                            {days.map((day) => (

                                <option
                                    key={day}
                                    value={day}
                                >
                                    {day}
                                </option>

                            ))}

                        </select>

                    </div>

                    {/* PERIOD */}

                    <div>

                        <label className="font-semibold text-gray-700 mb-2 block">
                            Period
                        </label>

                        <select
                            name="periodId"
                            value={formData.periodId}
                            onChange={handleChange}
                            className="w-full border-2 border-gray-200 focus:border-blue-500 p-4 rounded-2xl outline-none"
                            required
                        >

                            <option value="">
                                Select Period
                            </option>

                            {periods.map((p) => (

                                <option
                                    key={p.id}
                                    value={p.id}
                                >
                                    {p.title}
                                    {" "}
                                    (
                                    {p.startTime}
                                    {" - "}
                                    {p.endTime}
                                    )
                                </option>

                            ))}

                        </select>

                    </div>

                </div>

                <button
                    type="submit"
                    disabled={creating}
                    className="mt-7 w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-bold text-lg transition shadow-lg"
                >

                    {creating
                        ? "Creating..."
                        : "Create TimeTable"}

                </button>

            </form>

            {/* ================================================= */}
            {/* FILTERS */}
            {/* ================================================= */}

            <div className="bg-white rounded-[30px] shadow-xl p-5 md:p-8 mb-6">

                <h2 className="text-2xl font-black text-gray-800 mb-5">
                    Filters
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {/* FILTER CLASS */}

                    <select
                        value={selectedClassId}
                        onChange={(e) => {

                            setSelectedClassId(
                                e.target.value
                            );

                            setSelectedSection("");
                        }}
                        className="border-2 border-gray-200 focus:border-blue-500 p-4 rounded-2xl outline-none"
                    >

                        <option value="">
                            All Classes
                        </option>

                        {classes.map((cls) => (

                            <option
                                key={cls.id}
                                value={cls.id}
                            >
                                {cls.className}
                            </option>

                        ))}

                    </select>

                    {/* FILTER SECTION */}

                    <select
                        value={selectedSection}
                        onChange={(e) =>
                            setSelectedSection(
                                e.target.value
                            )
                        }
                        className="border-2 border-gray-200 focus:border-blue-500 p-4 rounded-2xl outline-none"
                    >

                        <option value="">
                            All Sections
                        </option>

                        {filterSections.map((sec) => (

                            <option
                                key={sec.id}
                                value={sec.sectionName}
                            >
                                {sec.sectionName}
                            </option>

                        ))}

                    </select>

                </div>

            </div>

            {/* ================================================= */}
            {/* TIMETABLE LIST */}
            {/* ================================================= */}

            <div className="bg-white rounded-[30px] shadow-xl overflow-hidden">

                <div className="p-6 border-b flex items-center justify-between">

                    <h2 className="text-3xl font-black text-gray-800">
                        TimeTable List
                    </h2>

                    <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-2xl font-bold">

                        {filteredTimeTables.length}
                        {" "}
                        Records

                    </div>

                </div>

                {loading ? (

                    <div className="p-10 text-center text-gray-500 text-xl">
                        Loading...
                    </div>

                ) : filteredTimeTables.length === 0 ? (

                    <div className="p-16 text-center">

                        <CalendarDaysIcon className="w-20 h-20 text-gray-300 mx-auto mb-4" />

                        <h2 className="text-2xl font-bold text-gray-600">
                            No Timetable Found
                        </h2>

                    </div>

                ) : (

                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6 p-6">

                        {filteredTimeTables.map((t) => (

                            <div
                                key={t.id}
                                className="bg-gradient-to-br from-white to-blue-50 border border-blue-100 rounded-[30px] shadow-lg p-5 hover:shadow-2xl transition"
                            >

                                {/* TOP */}

                                <div className="flex items-start justify-between mb-5">

                                    <div className="flex items-center gap-3">

                                        <div className="bg-blue-600 p-3 rounded-2xl">

                                            <BookOpenIcon className="w-7 h-7 text-white" />

                                        </div>

                                        <div>

                                            <h2 className="text-2xl font-black text-gray-800">
                                                {t.subjectName}
                                            </h2>

                                            <p className="text-blue-700 font-semibold">
                                                {t.dayName}
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        onClick={() =>
                                            deleteTimeTable(
                                                t.id
                                            )
                                        }
                                        className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-2xl transition"
                                    >

                                        <TrashIcon className="w-5 h-5" />

                                    </button>

                                </div>

                                {/* BODY */}

                                <div className="space-y-4">

                                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">

                                        <AcademicCapIcon className="w-6 h-6 text-blue-600" />

                                        <div>

                                            <p className="text-sm text-gray-500">
                                                Class & Section
                                            </p>

                                            <h3 className="font-bold text-gray-800">
                                                {t.className}
                                                {" - "}
                                                {t.sectionName}
                                            </h3>

                                        </div>

                                    </div>

                                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">

                                        <UserIcon className="w-6 h-6 text-green-600" />

                                        <div>

                                            <p className="text-sm text-gray-500">
                                                Teacher
                                            </p>

                                            <h3 className="font-bold text-gray-800">
                                                {t.teacherName}
                                            </h3>

                                        </div>

                                    </div>

                                    <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">

                                        <ClockIcon className="w-6 h-6 text-orange-600" />

                                        <div>

                                            <p className="text-sm text-gray-500">
                                                Period Time
                                            </p>

                                            <h3 className="font-bold text-gray-800">
                                                {t.periodName}
                                                {" "}
                                                (
                                                {t.startTime}
                                                {" - "}
                                                {t.endTime}
                                                )
                                            </h3>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default TimeTable;