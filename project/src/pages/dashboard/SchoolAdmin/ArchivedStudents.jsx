import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  FaTrash,
  FaUndo,
  FaSearch,
  FaUsers,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const BASE_URL =
  "http://localhost:8080/api";

export default function ArchivedStudents() {

  // =========================================================
  // STATES
  // =========================================================

  const [students, setStudents] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [currentPage, setCurrentPage] =
    useState(1);

  const studentsPerPage = 5;

  // =========================================================
  // USER ROLE
  // =========================================================

  const role =
    localStorage
      .getItem("userRole")
      ?.toLowerCase();

  // =========================================================
  // SCHOOL ID
  // =========================================================

  let schoolId = null;

  // ================= SCHOOL ADMIN =================

  if (role === "schooladmin") {

    const adminData = JSON.parse(
      localStorage.getItem(
        "schoolAdminData"
      )
    );

    schoolId =
      adminData?.schoolId ||
      adminData?.school?.id;
  }

  // ================= HOD =================

  else if (role === "hod") {

    const hodData = JSON.parse(
      localStorage.getItem(
        "hodData"
      )
    );

    schoolId =
      hodData?.schoolId ||
      hodData?.school?.id;
  }

  // =========================================================
  // FETCH ARCHIVED STUDENTS
  // =========================================================

  const fetchStudents = async () => {

    if (!schoolId) return;

    try {

      setLoading(true);

      // ✅ CORRECT NEW API
      const res = await axios.get(

        `${BASE_URL}/students/deleted/${schoolId}`
      );

      console.log(
        "ARCHIVED STUDENTS => ",
        res.data
      );

      setStudents(

        Array.isArray(res.data)
          ? res.data
          : []
      );

    } catch (err) {

      console.error(
        "FETCH ERROR => ",
        err
      );

      setStudents([]);

      alert(
        err?.response?.data ||
        "Failed to load archived students"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // LOAD
  // =========================================================

  useEffect(() => {

    fetchStudents();

  }, [schoolId]);

  // =========================================================
  // RESTORE STUDENT
  // =========================================================

  const restoreStudent =
    async (id) => {

      const confirmRestore =
        window.confirm(
          "Restore this student?"
        );

      if (!confirmRestore) return;

      try {

        await axios.put(

          `${BASE_URL}/students/restore/${id}`
        );

        alert(
          "Student Restored Successfully"
        );

        // REMOVE FROM UI
        setStudents((prev) =>
          prev.filter(
            (s) => s.id !== id
          )
        );

      } catch (err) {

        console.error(
          "RESTORE ERROR => ",
          err
        );

        alert(
          err?.response?.data ||
          "Restore Failed"
        );
      }
    };

  // =========================================================
  // PERMANENT DELETE
  // =========================================================

  const deletePermanently =
    async (id) => {

      const confirmDelete =
        window.confirm(

          "Permanently delete this student?"
        );

      if (!confirmDelete) return;

      try {

        await axios.delete(

          `${BASE_URL}/students/permanent/${id}`
        );

        alert(
          "Student Permanently Deleted"
        );

        // REMOVE FROM UI
        setStudents((prev) =>
          prev.filter(
            (s) => s.id !== id
          )
        );

      } catch (err) {

        console.error(
          "DELETE ERROR => ",
          err
        );

        alert(
          err?.response?.data ||
          "Delete Failed"
        );
      }
    };

  // =========================================================
  // SEARCH FILTER
  // =========================================================

  const filteredStudents =
    useMemo(() => {

      return students.filter((s) => {

        const keyword =
          search.toLowerCase();

        return (

          s.studName
            ?.toLowerCase()
            .includes(keyword) ||

          s.fullName
            ?.toLowerCase()
            .includes(keyword) ||

          s.email
            ?.toLowerCase()
            .includes(keyword) ||

          s.studentId
            ?.toLowerCase()
            .includes(keyword) ||

          String(
            s.studRollNo
          ).includes(keyword)
        );
      });

    }, [students, search]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages =
    Math.ceil(
      filteredStudents.length /
      studentsPerPage
    );

  const indexOfLast =
    currentPage *
    studentsPerPage;

  const indexOfFirst =
    indexOfLast -
    studentsPerPage;

  const currentStudents =
    filteredStudents.slice(
      indexOfFirst,
      indexOfLast
    );

  // =========================================================
  // PAGE CHANGE
  // =========================================================

  const goToPage = (page) => {

    if (
      page < 1 ||
      page > totalPages
    ) return;

    setCurrentPage(page);
  };

  // =========================================================
  // RESET PAGE
  // =========================================================

  useEffect(() => {

    setCurrentPage(1);

  }, [search]);

  // =========================================================
  // UI
  // =========================================================

  return (

    <div className="min-h-screen bg-gray-100 p-2 sm:p-4">

      <div className="max-w-7xl mx-auto">

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* ================================================= */}
          {/* HEADER */}
          {/* ================================================= */}

          <div className="bg-red-600 text-white px-5 py-6">

            <div className="flex items-center gap-4">

              <div className="bg-white/20 p-4 rounded-2xl">

                <FaUsers className="text-2xl" />

              </div>

              <div>

                <h1 className="text-2xl sm:text-3xl font-bold">

                  Archived Students

                </h1>

                <p className="text-sm mt-1 text-red-100">

                  Total Archived :
                  {" "}
                  {students.length}

                </p>

              </div>

            </div>

          </div>

          {/* ================================================= */}
          {/* SEARCH */}
          {/* ================================================= */}

          <div className="p-4 sm:p-6 border-b">

            <div className="relative max-w-md">

              <FaSearch className="absolute left-4 top-4 text-gray-400" />

              <input
                type="text"
                placeholder="Search archived students..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                className="border border-gray-300 rounded-2xl w-full pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-red-400"
              />

            </div>

          </div>

          {/* ================================================= */}
          {/* LOADING */}
          {/* ================================================= */}

          {loading && (

            <div className="p-6 text-center text-blue-600 font-semibold">

              Loading Archived Students...

            </div>
          )}

          {/* ================================================= */}
          {/* TABLE */}
          {/* ================================================= */}

          {!loading && (

            <div className="overflow-x-auto">

              <table className="w-full min-w-[950px]">

                <thead>

                  <tr className="bg-gray-100 text-gray-700">

                    <th className="p-4 text-center">
                      #
                    </th>

                    <th className="p-4 text-left">
                      Student
                    </th>

                    <th className="p-4 text-left">
                      Email
                    </th>

                    <th className="p-4 text-center">
                      Phone
                    </th>

                    <th className="p-4 text-center">
                      Roll
                    </th>

                    <th className="p-4 text-center">
                      Class
                    </th>

                    <th className="p-4 text-center">
                      Section
                    </th>

                    <th className="p-4 text-center">
                      Actions
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {currentStudents.length === 0 ? (

                    <tr>

                      <td
                        colSpan="8"
                        className="text-center py-10 text-gray-500"
                      >

                        No Archived Students Found

                      </td>

                    </tr>

                  ) : (

                    currentStudents.map(
                      (s, index) => (

                        <tr
                          key={s.id}
                          className="border-t hover:bg-gray-50 transition"
                        >

                          {/* INDEX */}
                          <td className="p-4 text-center">

                            {indexOfFirst +
                              index +
                              1}

                          </td>

                          {/* STUDENT */}
                          <td className="p-4">

                            <div className="flex items-center gap-3">

                              <img
                                src={
                                  s.profileImage
                                    ? `${BASE_URL}/students/image/get/${s.id}`
                                    : "https://via.placeholder.com/100"
                                }
                                alt=""
                                className="w-12 h-12 rounded-full object-cover border"
                              />

                              <div>

                                <h3 className="font-bold">

                                  {s.fullName ||
                                    `${s.studName || ""} ${s.studLastName || ""}`}

                                </h3>

                                <p className="text-sm text-gray-500">

                                  Student ID :
                                  {" "}
                                  {s.studentId || "N/A"}

                                </p>

                              </div>

                            </div>

                          </td>

                          {/* EMAIL */}
                          <td className="p-4">

                            {s.email || "N/A"}

                          </td>

                          {/* PHONE */}
                          <td className="p-4 text-center">

                            {s.studPhoneNumber || "N/A"}

                          </td>

                          {/* ROLL */}
                          <td className="p-4 text-center">

                            {s.studRollNo || "N/A"}

                          </td>

                          {/* CLASS */}
                          <td className="p-4 text-center">

                            {s.className ||
                              s.classNumber ||
                              "N/A"}

                          </td>

                          {/* SECTION */}
                          <td className="p-4 text-center">

                            {s.section || "N/A"}

                          </td>

                          {/* ACTIONS */}
                          <td className="p-4">

                            <div className="flex justify-center gap-3 flex-wrap">

                              {/* RESTORE */}
                              <button
                                onClick={() =>
                                  restoreStudent(
                                    s.id
                                  )
                                }
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
                              >

                                <FaUndo />

                                Restore

                              </button>

                              {/* DELETE */}
                              <button
                                onClick={() =>
                                  deletePermanently(
                                    s.id
                                  )
                                }
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition"
                              >

                                <FaTrash />

                                Delete

                              </button>

                            </div>

                          </td>

                        </tr>
                      )
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

          {/* ================================================= */}
          {/* PAGINATION */}
          {/* ================================================= */}

          {!loading &&
            totalPages > 1 && (

            <div className="p-5 flex items-center justify-center gap-2 flex-wrap border-t">

              {/* PREVIOUS */}
              <button
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
                disabled={
                  currentPage === 1
                }
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 px-4 py-2 rounded-xl"
              >

                <FaChevronLeft />

              </button>

              {/* PAGE BUTTONS */}
              {Array.from(
                { length: totalPages },
                (_, i) => (

                  <button
                    key={i}
                    onClick={() =>
                      goToPage(i + 1)
                    }
                    className={`px-4 py-2 rounded-xl font-semibold ${
                      currentPage === i + 1
                        ? "bg-red-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300"
                    }`}
                  >

                    {i + 1}

                  </button>
                )
              )}

              {/* NEXT */}
              <button
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 px-4 py-2 rounded-xl"
              >

                <FaChevronRight />

              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}