import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import axios from "axios";

import {
    CalendarDaysIcon,
    ClockIcon,
    AcademicCapIcon,
    UserIcon,
    BookOpenIcon,
    FunnelIcon,
    BuildingOffice2Icon,
} from "@heroicons/react/24/solid";

const BASE_URL =
    "http://localhost:8080/api";

function StuTimeTable() {

    // =====================================================
    // STATES
    // =====================================================

    const [studentData, setStudentData] =
        useState(null);

    const [timeTables, setTimeTables] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [selectedFilter, setSelectedFilter] =
        useState("TODAY");

    // =====================================================
    // DAYS
    // =====================================================

    const days = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
    ];

    // =====================================================
    // TODAY / YESTERDAY
    // =====================================================

    const todayIndex =
        new Date().getDay();

    const todayName =
        days[todayIndex];

    const yesterdayName =
        days[
            todayIndex === 0
                ? 6
                : todayIndex - 1
        ];

    // =====================================================
    // LOAD STUDENT DATA
    // =====================================================

    useEffect(() => {

        const loadStudent =
            async () => {

                try {

                    const stored =
                        localStorage.getItem(
                            "studentData"
                        );

                    let studentId = null;

                    if (stored) {

                        const parsed =
                            JSON.parse(
                                stored
                            );

                        studentId =
                            parsed?.id;
                    }

                    if (!studentId) {

                        studentId =
                            localStorage.getItem(
                                "id"
                            );
                    }

                    if (!studentId)
                        return;

                    // =====================================
                    // FETCH LATEST STUDENT
                    // =====================================

                    const res =
                        await axios.get(

                            `${BASE_URL}/students/${studentId}`
                        );

                    console.log(
                        "LATEST STUDENT =",
                        res.data
                    );

                    const student =
                        res.data;

                    setStudentData({

                        id: student?.id,

                        studentName:
                            `${student?.studfirstName || ""} ${student?.studlastName || ""}`,

                        schoolId:
                            student?.schoolId,

                        classId:
                            student?.classId,

                        className:
                            student?.className,

                        // =====================================
                        // FIXED SECTION
                        // =====================================

                        sectionName:

                            student?.sectionName ||

                            student?.section ||

                            student?.studentSection ||

                            "",

                        schoolName:
                            student?.schoolName,
                    });

                    // UPDATE STORAGE

                    localStorage.setItem(
                        "studentData",
                        JSON.stringify(
                            student
                        )
                    );

                } catch (err) {

                    console.log(err);

                    console.error(
                        "Student Load Error:",
                        err.response?.data ||
                            err.message
                    );
                }
            };

        loadStudent();

    }, []);

    // =====================================================
    // FETCH TIMETABLE
    // =====================================================

    const fetchStudentTimeTable =
        async () => {

            try {

                if (
                    !studentData?.classId ||
                    !studentData?.sectionName
                ) {

                    console.log(
                        "Class or Section Missing"
                    );

                    return;
                }

                setLoading(true);

                console.log(
                    "CLASS ID =",
                    studentData.classId
                );

                console.log(
                    "SECTION =",
                    studentData.sectionName
                );

                const res =
                    await axios.get(

                        `${BASE_URL}/timetable/class/${studentData.classId}/section/${studentData.sectionName}`
                    );

                let data =
                    Array.isArray(
                        res.data
                    )
                        ? res.data
                        : [];

                // =====================================
                // SORT
                // =====================================

                const dayOrder = {

                    MONDAY: 1,

                    TUESDAY: 2,

                    WEDNESDAY: 3,

                    THURSDAY: 4,

                    FRIDAY: 5,

                    SATURDAY: 6,

                    SUNDAY: 7,
                };

                data.sort((a, b) => {

                    if (
                        a.dayName ===
                        b.dayName
                    ) {

                        return (
                            a.periodNumber -
                            b.periodNumber
                        );
                    }

                    return (
                        dayOrder[
                            a.dayName
                        ] -
                        dayOrder[
                            b.dayName
                        ]
                    );
                });

                console.log(
                    "TIMETABLE =",
                    data
                );

                setTimeTables(data);

            } catch (err) {

                console.log(err);

                console.error(
                    "Timetable Error:",
                    err.response?.data ||
                        err.message
                );

            } finally {

                setLoading(false);
            }
        };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {

        if (
            studentData?.classId &&
            studentData?.sectionName
        ) {

            fetchStudentTimeTable();
        }

    }, [studentData]);

    // =====================================================
    // FILTERED DATA
    // =====================================================

    const filteredData = useMemo(() => {

        if (
            selectedFilter ===
            "ALL"
        ) {

            return timeTables;
        }

        if (
            selectedFilter ===
            "TODAY"
        ) {

            return timeTables.filter(
                (t) =>
                    t.dayName ===
                    todayName
            );
        }

        if (
            selectedFilter ===
            "YESTERDAY"
        ) {

            return timeTables.filter(
                (t) =>
                    t.dayName ===
                    yesterdayName
            );
        }

        return timeTables.filter(
            (t) =>
                t.dayName ===
                selectedFilter
        );

    }, [
        timeTables,
        selectedFilter,
        todayName,
        yesterdayName,
    ]);

    // =====================================================
    // TOTAL CLASSES
    // =====================================================

    const totalClasses =
        filteredData.length;

    // =====================================================
    // FILTER TITLE
    // =====================================================

    const filterTitle =
        selectedFilter ===
        "TODAY"

            ? `Today's Classes (${todayName})`

            : selectedFilter ===
              "YESTERDAY"

            ? `Yesterday Classes (${yesterdayName})`

            : selectedFilter ===
              "ALL"

            ? "All Classes"

            : `${selectedFilter} Classes`;

    // =====================================================
    // UI
    // =====================================================

    return (

        <div className="min-h-screen bg-gray-100 p-3 md:p-6">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="bg-white rounded-3xl shadow-xl p-5 mb-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* LEFT */}

                    <div>

                        <div className="flex items-center gap-3">

                            <div className="bg-blue-100 p-3 rounded-2xl">

                                <CalendarDaysIcon className="w-8 h-8 text-blue-700" />

                            </div>

                            <div>

                                <h1 className="text-2xl md:text-4xl font-bold text-gray-800">

                                    Student TimeTable

                                </h1>

                                <p className="text-gray-500 mt-1">

                                    {
                                        studentData?.studentName
                                    }

                                </p>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-3xl shadow-lg text-center">

                        <p className="text-sm">
                            Total Classes
                        </p>

                        <h2 className="text-4xl font-bold">

                            {totalClasses}

                        </h2>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* INFO CARDS */}
            {/* ================================================= */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

                {/* CLASS */}

                <div className="bg-white rounded-3xl shadow-xl p-5">

                    <div className="flex items-center gap-4">

                        <div className="bg-indigo-100 p-4 rounded-2xl">

                            <AcademicCapIcon className="w-8 h-8 text-indigo-700" />

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Class
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800">

                                {
                                    studentData?.className
                                }

                            </h2>

                        </div>

                    </div>

                </div>

                {/* SECTION */}

                <div className="bg-white rounded-3xl shadow-xl p-5">

                    <div className="flex items-center gap-4">

                        <div className="bg-green-100 p-4 rounded-2xl">

                            <BuildingOffice2Icon className="w-8 h-8 text-green-700" />

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                Section
                            </p>

                            <h2 className="text-2xl font-bold text-gray-800">

                                {
                                    studentData?.sectionName ||
                                    "N/A"
                                }

                            </h2>

                        </div>

                    </div>

                </div>

                {/* SCHOOL */}

                <div className="bg-white rounded-3xl shadow-xl p-5">

                    <div className="flex items-center gap-4">

                        <div className="bg-purple-100 p-4 rounded-2xl">

                            <BookOpenIcon className="w-8 h-8 text-purple-700" />

                        </div>

                        <div>

                            <p className="text-sm text-gray-500">
                                School
                            </p>

                            <h2 className="text-lg font-bold text-gray-800">

                                {
                                    studentData?.schoolName
                                }

                            </h2>

                        </div>

                    </div>

                </div>

            </div>

            {/* ================================================= */}
            {/* FILTER */}
            {/* ================================================= */}

            <div className="bg-white rounded-3xl shadow-xl p-5 mb-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="flex items-center gap-3">

                        <div className="bg-indigo-100 p-3 rounded-2xl">

                            <FunnelIcon className="w-6 h-6 text-indigo-700" />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold text-gray-700">

                                {filterTitle}

                            </h2>

                            <p className="text-gray-500 text-sm">

                                View timetable day wise

                            </p>

                        </div>

                    </div>

                    <select
                        value={
                            selectedFilter
                        }
                        onChange={(e) =>
                            setSelectedFilter(
                                e.target.value
                            )
                        }
                        className="border border-gray-300 px-4 py-3 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 w-full lg:w-80"
                    >

                        <option value="TODAY">
                            Today
                        </option>

                        <option value="YESTERDAY">
                            Yesterday
                        </option>

                        <option value="ALL">
                            All Days
                        </option>

                        <option value="MONDAY">
                            MONDAY
                        </option>

                        <option value="TUESDAY">
                            TUESDAY
                        </option>

                        <option value="WEDNESDAY">
                            WEDNESDAY
                        </option>

                        <option value="THURSDAY">
                            THURSDAY
                        </option>

                        <option value="FRIDAY">
                            FRIDAY
                        </option>

                        <option value="SATURDAY">
                            SATURDAY
                        </option>

                    </select>

                </div>

            </div>

            {/* ================================================= */}
            {/* TIMETABLE */}
            {/* ================================================= */}

            {loading ? (

                <div className="bg-white rounded-3xl shadow-xl p-10 text-center text-gray-500 text-lg">

                    Loading timetable...

                </div>

            ) : filteredData.length ===
              0 ? (

                <div className="bg-white rounded-3xl shadow-xl p-10 text-center">

                    <div className="flex justify-center mb-4">

                        <div className="bg-gray-100 p-5 rounded-full">

                            <CalendarDaysIcon className="w-12 h-12 text-gray-400" />

                        </div>

                    </div>

                    <h2 className="text-2xl font-bold text-gray-700">

                        No Timetable Found

                    </h2>

                    <p className="text-gray-500 mt-2">

                        Section not assigned or timetable not created

                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">

                    {filteredData.map(
                        (timetable) => (

                            <div
                                key={
                                    timetable.id
                                }
                                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition duration-300"
                            >

                                {/* TOP */}

                                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <h2 className="text-2xl font-bold">

                                                {
                                                    timetable.dayName
                                                }

                                            </h2>

                                            <p className="opacity-90">

                                                Period{" "}

                                                {
                                                    timetable.periodNumber + 1
                                                }

                                            </p>

                                        </div>

                                        <div className="bg-white/20 p-3 rounded-2xl">

                                            <ClockIcon className="w-8 h-8" />

                                        </div>

                                    </div>

                                </div>

                                {/* BODY */}

                                <div className="p-5 space-y-4">

                                    {/* SUBJECT */}

                                    <div className="bg-blue-50 rounded-2xl p-4">

                                        <div className="flex items-center gap-3">

                                            <BookOpenIcon className="w-6 h-6 text-blue-700" />

                                            <div>

                                                <p className="text-sm text-gray-500">

                                                    Subject

                                                </p>

                                                <h3 className="text-xl font-bold text-blue-700">

                                                    {
                                                        timetable.subjectName
                                                    }

                                                </h3>

                                            </div>

                                        </div>

                                    </div>

                                    {/* CLASS */}

                                    <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-2xl">

                                        <AcademicCapIcon className="w-6 h-6 text-indigo-600" />

                                        <div>

                                            <p className="text-sm text-gray-500">

                                                Class

                                            </p>

                                            <h3 className="font-bold text-gray-800">

                                                {
                                                    timetable.className
                                                }

                                                {" - "}

                                                {
                                                    timetable.sectionName
                                                }

                                            </h3>

                                        </div>

                                    </div>

                                    {/* TIME */}

                                    <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-2xl">

                                        <ClockIcon className="w-6 h-6 text-green-600" />

                                        <div>

                                            <p className="text-sm text-gray-500">

                                                Timing

                                            </p>

                                            <h3 className="font-bold text-gray-800">

                                                {
                                                    timetable.startTime
                                                }

                                                {" - "}

                                                {
                                                    timetable.endTime
                                                }

                                            </h3>

                                        </div>

                                    </div>

                                    {/* TEACHER */}

                                    <div className="flex items-center gap-3 bg-gray-100 p-4 rounded-2xl">

                                        <UserIcon className="w-6 h-6 text-purple-600" />

                                        <div>

                                            <p className="text-sm text-gray-500">

                                                Teacher

                                            </p>

                                            <h3 className="font-bold text-gray-800">

                                                {
                                                    timetable.teacherName
                                                }

                                            </h3>

                                        </div>

                                    </div>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>
    );
}

export default StuTimeTable;