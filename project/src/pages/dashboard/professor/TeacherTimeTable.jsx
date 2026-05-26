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
} from "@heroicons/react/24/solid";

const BASE_URL =
    "http://localhost:8080/api";

function TeacherTimeTable() {

    // =====================================================
    // STATES
    // =====================================================

    const [teacherData, setTeacherData] =
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
    // GET TODAY / YESTERDAY
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
    // LOAD TEACHER
    // =====================================================

    useEffect(() => {

        const professorData =
            JSON.parse(
                localStorage.getItem(
                    "professorData"
                )
            );

        if (professorData) {

            setTeacherData({

                id: professorData?.id,

                name:
                    professorData?.name,

                schoolId:
                    professorData?.schoolId,

                schoolName:
                    professorData?.schoolName,
            });
        }

    }, []);

    // =====================================================
    // FETCH TIMETABLE
    // =====================================================

    const fetchTeacherTimeTable =
        async () => {

            try {

                setLoading(true);

                const res =
                    await axios.get(

                        `${BASE_URL}/timetable/teacher/${teacherData.id}`
                    );

                let data =
                    Array.isArray(
                        res.data
                    )
                        ? res.data
                        : [];

                // SORT
                data.sort((a, b) => {

                    const dayOrder = {
                        MONDAY: 1,
                        TUESDAY: 2,
                        WEDNESDAY: 3,
                        THURSDAY: 4,
                        FRIDAY: 5,
                        SATURDAY: 6,
                    };

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

                setTimeTables(data);

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

        if (teacherData?.id) {

            fetchTeacherTimeTable();
        }

    }, [teacherData]);

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

                                    Teacher TimeTable

                                </h1>

                                <p className="text-gray-500 mt-1">

                                    {
                                        teacherData?.name
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
            {/* FILTER */}
            {/* ================================================= */}

            <div className="bg-white rounded-3xl shadow-xl p-5 mb-6">

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    {/* LEFT */}

                    <div className="flex items-center gap-3">

                        <div className="bg-indigo-100 p-3 rounded-2xl">

                            <FunnelIcon className="w-6 h-6 text-indigo-700" />

                        </div>

                        <div>

                            <h2 className="text-2xl font-bold text-gray-700">

                                {filterTitle}

                            </h2>

                            <p className="text-gray-500 text-sm">

                                View classes day wise

                            </p>

                        </div>

                    </div>

                    {/* RIGHT */}

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

                        No classes assigned

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
                                                    timetable.periodNumber
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

export default TeacherTimeTable;