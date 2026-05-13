import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPlus, FaEye } from "react-icons/fa";

function StuAttendance() {

  const [takenInfo, setTakenInfo] = useState(null);

  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState(null);

  const [mode, setMode] = useState("");

  const [students, setStudents] = useState([]);

  const [date, setDate] = useState("");

  const [attendance, setAttendance] = useState({});

  const [loading, setLoading] = useState(false);

  // =========================================================
  // USER
  // =========================================================

  const role =
    localStorage.getItem("userRole");

  let user = null;

  // ================= HOD =================
  if (role?.toLowerCase() === "hod") {

    const hodData = JSON.parse(
      localStorage.getItem("hodData")
    );

    console.log("HOD DATA => ", hodData);

    user = {

      id: hodData?.id,

      name:
        hodData?.name ||
        hodData?.hodName ||
        "HOD",

      role: "HOD",

      // ✅ FIXED
      schoolId:
        hodData?.school?.id,
    };
  }

  // ================= PROFESSOR =================
  else if (
    role?.toLowerCase() === "professor"
  ) {

    const professorData = JSON.parse(
      localStorage.getItem("professorData")
    );

    console.log(
      "PROFESSOR DATA => ",
      professorData
    );

    user = {

      id: professorData?.id,

      name:
        professorData?.name ||
        professorData?.professorName ||
        "Professor",

      role: "Professor",

      // ✅ FIXED
      schoolId:
        professorData?.school?.id,
    };
  }

  // ================= SCHOOL ADMIN =================
  else if (
    role?.toLowerCase() === "schooladmin"
  ) {

    const schoolAdminData = JSON.parse(
      localStorage.getItem("schoolAdminData")
    );

    console.log(
      "SCHOOL ADMIN DATA => ",
      schoolAdminData
    );

    user = {

      id: schoolAdminData?.id,

      name:
        schoolAdminData?.name ||
        schoolAdminData?.schoolName ||
        "Admin",

      role: "SchoolAdmin",

      // ✅ FIXED
      schoolId:
        schoolAdminData?.school?.id,
    };
  }

  console.log("FINAL USER => ", user);

  const schoolId = user?.schoolId;

  // =========================================================
  // LOAD CLASSES
  // =========================================================

  useEffect(() => {

    if (!schoolId) {

      console.log(
        "❌ SCHOOL ID NOT FOUND"
      );

      return;
    }

    loadClasses();

  }, [schoolId]);

  const loadClasses = async () => {

    try {

      console.log(
        "LOADING CLASSES FOR SCHOOL => ",
        schoolId
      );

      const res = await axios.get(
        `http://localhost:8080/api/classes/by-school/${schoolId}`
      );

      console.log(
        "CLASSES RESPONSE => ",
        res.data
      );

      setClasses(res.data);

    } catch (err) {

      console.error(
        "CLASS LOAD ERROR => ",
        err
      );

      alert("Error loading classes");
    }
  };

  // =========================================================
  // LOAD STUDENTS
  // =========================================================

  const loadStudents = async (
    classNumber,
    type
  ) => {

    setMode(type);

    setSelectedClass(classNumber);
    console.log("Class Number : ",classNumber);
    

    setStudents([]);

    setAttendance({});

    setDate("");

    setTakenInfo(null);

    // ================= TAKE MODE =================
    if (type === "take") {

      try {

        console.log(
          "CLASS NUMBER => ",
          classNumber
        );

        const res = await axios.get(
          `http://localhost:8080/api/students/school/${schoolId}/class/${classNumber}`
        );

        console.log(
          "STUDENTS => ",
          res.data
        );

        setStudents(res.data);

        const initial = {};

        res.data.forEach((s) => {

          initial[s.id] = "P";
        });

        setAttendance(initial);

      } catch (err) {

        console.error(
          "LOAD STUDENT ERROR => ",
          err
        );

        alert("Error loading students");
      }
    }
  };

  // =========================================================
  // LOAD ATTENDANCE
  // =========================================================

  const loadAttendanceByDate = async () => {

    if (!date) {

      alert("Select Date");

      return;
    }

    setLoading(true);

    try {

      const res = await axios.get(
        `http://localhost:8080/api/stu-attendance?schoolId=${schoolId}&classId=${selectedClass}&date=${date}`
      );

      console.log(
        "ATTENDANCE => ",
        res.data
      );

      if (
        !res.data ||
        res.data.length === 0
      ) {

        alert("No attendance found");

        setStudents([]);

        return;
      }

      // ================= STUDENTS =================
      const mappedStudents =
        res.data.map((s) => ({

          id: s.studentId,

          studName: s.studentName,

          studLastName:
            s.studentLastName,

          email: s.email,

          studRollNo:
            s.studRollNo,
        }));

      setStudents(mappedStudents);

      // ================= ATT MAP =================
      const attMap = {};

      res.data.forEach((s) => {

        attMap[s.studentId] =
          s.status;
      });

      setAttendance(attMap);

      // ================= TAKEN INFO =================
      setTakenInfo({

        name:
          res.data[0]?.takenByName,

        role:
          res.data[0]?.takenByRole,
      });

    } catch (err) {

      console.error(
        "ATTENDANCE ERROR => ",
        err
      );

      alert("Error loading attendance");

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange = (
    id,
    value
  ) => {

    setAttendance((prev) => ({

      ...prev,

      [id]: value,
    }));
  };

  // =========================================================
  // SAVE
  // =========================================================

  const handleSubmit = async () => {

    if (!date) {

      alert("Select Date");

      return;
    }

    const payload =
      students.map((s) => ({

        studentId: s.id,

        status:
          attendance[s.id],
      }));

    console.log(
      "SAVE PAYLOAD => ",
      payload
    );

    setLoading(true);

    try {

      await axios.post(

        `http://localhost:8080/api/stu-attendance/save?schoolId=${schoolId}&classId=${selectedClass}&date=${date}&takenById=${user.id}&takenByName=${encodeURIComponent(user.name)}&takenByRole=${user.role}`,

        payload
      );

      alert(
        "Attendance Saved"
      );

    } catch (err) {

      console.error(
        "SAVE ERROR => ",
        err
      );

      alert(
        err?.response?.data ||
        "Save Failed"
      );

    } finally {

      setLoading(false);
    }
  };

  // =========================================================
  // BACK
  // =========================================================

  const goBack = () => {

    setSelectedClass(null);

    setMode("");

    setStudents([]);

    setAttendance({});

    setDate("");

    setTakenInfo(null);
  };

  return (

    <div className="min-h-screen p-4 bg-gray-100">

      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="bg-blue-600 text-white text-center py-4 text-xl font-bold">
          Student Attendance
        </div>

        {/* CLASS LIST */}
        {!selectedClass && (

          <div className="p-4 space-y-3">

            {classes.length === 0 && (

              <div className="text-center text-red-500">
                No Classes Found
              </div>
            )}

            {classes.map((cls) => (

              <div
                key={cls.id}
                className="bg-gray-50 p-4 rounded-xl shadow flex justify-between items-center"
              >

                <h3 className="font-semibold">
                  {cls.className}
                </h3>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      loadStudents(
                        cls.id,
                        "take"
                      )
                    }
                    className="bg-blue-500 text-white px-3 py-2 rounded flex items-center gap-1"
                  >
                    <FaPlus />
                    Take
                  </button>

                  <button
                    onClick={() =>
                      loadStudents(
                        cls.id,
                        "view"
                      )
                    }
                    className="bg-purple-500 text-white px-3 py-2 rounded flex items-center gap-1"
                  >
                    <FaEye />
                    View
                  </button>

                </div>

              </div>
            ))}

          </div>
        )}

        {/* ATTENDANCE */}
        {selectedClass && (

          <div className="p-4">

            <button
              onClick={goBack}
              className="mb-4 bg-gray-600 text-white px-4 py-2 rounded"
            >
              Back
            </button>

            <div className="flex gap-2 justify-center mb-4">

              <input
                type="date"
                className="border p-2 rounded"
                value={date}
                onChange={(e) =>
                  setDate(e.target.value)
                }
              />

              {mode === "view" && (

                <button
                  onClick={
                    loadAttendanceByDate
                  }
                  className="bg-purple-600 text-white px-4 rounded"
                >
                  Load
                </button>
              )}

            </div>

            {/* TAKEN INFO */}
            {takenInfo && (

              <div className="bg-yellow-100 p-2 rounded text-center mb-3">

                Attendance Taken By :

                <b>
                  {" "}
                  {takenInfo.name}
                </b>

                {" "}
                ({takenInfo.role})

              </div>
            )}

            <div className="space-y-3">

              {students.map((stu) => (

                <div
                  key={stu.id}
                  className="bg-gray-50 p-3 rounded flex justify-between items-center"
                >

                  <div>

                    <p className="font-semibold">
                      {stu.studName}
                      {" "}
                      {stu.studLastName}
                    </p>

                    <p className="text-sm">
                      {stu.email}
                    </p>

                  </div>

                  {mode === "take" ? (

                    <select
                      value={
                        attendance[stu.id]
                      }
                      onChange={(e) =>
                        handleChange(
                          stu.id,
                          e.target.value
                        )
                      }
                      className="border p-2 rounded"
                    >

                      <option value="P">
                        Present
                      </option>

                      <option value="A">
                        Absent
                      </option>

                    </select>

                  ) : (

                    <div>

                      {attendance[stu.id] ===
                      "P"
                        ? "Present"
                        : "Absent"}

                    </div>

                  )}

                </div>
              ))}

            </div>

            {mode === "take" && (

              <div className="text-center mt-4">

                <button
                  onClick={handleSubmit}
                  className="bg-blue-600 text-white px-6 py-2 rounded"
                >

                  {loading
                    ? "Saving..."
                    : "Submit"}

                </button>

              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

export default StuAttendance;