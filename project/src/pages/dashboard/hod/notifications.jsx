 
// import { useState } from "react";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Button,
//   Input,
//   Typography,
//   Select,
//   Option,
//   Spinner,
// } from "@material-tailwind/react";

// const NotificationSender = () => {
//   const [recipientType, setRecipientType] = useState("ALL_STUDENTS");
//   const [title, setTitle] = useState("");
//   const [message, setMessage] = useState("");
//   const [subject, setSubject] = useState("");
//   const [receiverId, setReceiverId] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const notificationData = {
//       title,
//       message,
//       subject,
//       recipientType,
//       receiverId: recipientType === "INDIVIDUAL" ? receiverId : null,
//       sender: localStorage.getItem("userName") || "HOD",
//       timestamp: new Date().toISOString(),
//       readStatus: false,
//     };

//     try {
//       setIsLoading(true);

//       const response = await fetch(
//         "http://localhost:8080/api/notifications/send",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(notificationData),
//         }
//       );

//       if (response.ok) {
//         alert("✅ Notification Sent Successfully!");
//         resetForm();
//       } else {
//         alert("❌ Failed to send notification");
//       }
//     } catch (error) {
//       console.error("Error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setTitle("");
//     setMessage("");
//     setSubject("");
//     setReceiverId("");
//     setRecipientType("ALL_STUDENTS");
//   };

//   return (
//     <Card className="max-w-lg mx-auto mt-10 shadow-lg">
//       <CardHeader className="bg-blue-600 text-white p-4">
//         <Typography variant="h5">Send Notification</Typography>
//       </CardHeader>

//       <CardBody>
//         <form onSubmit={handleSubmit} className="space-y-5">

//           {/* Recipient */}
//           <div>
//             <Typography variant="small" className="mb-2">
//               Recipient Type
//             </Typography>
//             <Select
//               value={recipientType}
//               onChange={(val) => setRecipientType(val)}
//             >
//               <Option value="ALL_STUDENTS">ALL STUDENTS</Option>
//               <Option value="ALL_TEACHERS">ALL TEACHERS</Option>
//               <Option value="ALL">ALL (Students + Teachers)</Option>
//               <Option value="INDIVIDUAL">INDIVIDUAL</Option>
//             </Select>
//           </div>

//           {/* Individual Field */}
//           {recipientType === "INDIVIDUAL" && (
//             <Input
//               label="Receiver ID / Email"
//               value={receiverId}
//               onChange={(e) => setReceiverId(e.target.value)}
//               required
//             />
//           )}

//           {/* Title */}
//           <Input
//             label="Notification Title"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             required
//           />

//           {/* Message */}
//           <textarea
//             className="w-full border p-2 rounded"
//             placeholder="Enter Message"
//             rows="4"
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//             required
//           />

//           {/* Subject */}
//           <Input
//             label="Subject"
//             value={subject}
//             onChange={(e) => setSubject(e.target.value)}
//           />

//           {/* Button */}
//           <Button type="submit" fullWidth disabled={isLoading}>
//             {isLoading ? <Spinner className="h-5 w-5" /> : "Send Notification"}
//           </Button>

//         </form>
//       </CardBody>
//     </Card>
//   );
// };

// export default NotificationSender;




import React, { useEffect, useState } from "react";

import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Typography,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";

const NotificationSender = () => {

  // ======================================================
  // STATES
  // ======================================================

  const [recipientType, setRecipientType] =
    useState("ALL_STUDENTS");

  const [title, setTitle] = useState("");

  const [message, setMessage] = useState("");

  const [subject, setSubject] = useState("");

  const [teacherId, setTeacherId] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [className, setClassName] =
    useState("");

  const [teachers, setTeachers] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [classes, setClasses] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  // ======================================================
  // LOCAL STORAGE
  // ======================================================

  const hodData =
  JSON.parse(localStorage.getItem("hodData"));
  const schoolId = hodData?.school?.id;

  const sender =
    localStorage.getItem("userName");

  const senderId =
    localStorage.getItem("id");

  // ======================================================
  // LOAD INITIAL DATA
  // ======================================================

  useEffect(() => {

    // =========================================
    // LOAD TEACHERS
    // =========================================

    fetch(
      `http://localhost:8080/api/professors/by-school/${schoolId}`
    )
      .then((res) => res.json())
      .then((data) => {

        console.log("TEACHERS => ", data);

        setTeachers(data || []);

      })
      .catch((err) => console.log(err));

    // =========================================
    // LOAD CLASSES
    // =========================================

    fetch(
      `http://localhost:8080/api/classes/by-school/${schoolId}`
    )
      .then((res) => res.json())
      .then((data) => {

        console.log("CLASSES => ", data);

        setClasses(data || []);

      })
      .catch((err) => console.log(err));

  }, []);

  // ======================================================
  // LOAD STUDENTS
  // ======================================================

  const loadStudents = async (selectedClass) => {

    try {

      const res = await fetch(
        `http://localhost:8080/api/students/school/${schoolId}/class/${selectedClass}`
      );

      const data = await res.json();

      console.log("STUDENTS => ", data);

      setStudents(data || []);

    } catch (err) {

      console.log(err);

    }
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const notificationData = {

      title,

      subject,

      message,

      sender,

      senderId: Number(senderId),

      schoolId: Number(schoolId),

      recipientType,

      teacherId:
        recipientType === "SINGLE_TEACHER"
          ? Number(teacherId)
          : null,

      studentId:
        recipientType === "SINGLE_STUDENT"
          ? Number(studentId)
          : null,

      className:
        recipientType === "CLASS_STUDENTS" ||
        recipientType === "SINGLE_STUDENT"
          ? className
          : null,
    };

    console.log(
      "NOTIFICATION DATA => ",
      notificationData
    );

    try {

      setIsLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/notifications/send",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(notificationData),
        }
      );

      if (response.ok) {

        alert(
          "✅ Notification Sent Successfully!"
        );

        resetForm();

      } else {

        const err = await response.text();

        console.log(err);

        alert("❌ Failed to send notification");

      }

    } catch (error) {

      console.error("Error:", error);

    } finally {

      setIsLoading(false);

    }
  };

  // ======================================================
  // RESET
  // ======================================================

  const resetForm = () => {

    setTitle("");

    setMessage("");

    setSubject("");

    setTeacherId("");

    setStudentId("");

    setClassName("");

    setRecipientType("ALL_STUDENTS");
  };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="p-6 bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 min-h-screen">

      <Card className="max-w-3xl mx-auto shadow-2xl rounded-3xl border border-gray-100">

        {/* HEADER */}

        <CardHeader
          floated={false}
          shadow={false}
          className="rounded-t-3xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6"
        >

          <Typography
            variant="h4"
            color="white"
            className="font-bold"
          >
            Send Notification
          </Typography>

          <Typography
            color="white"
            className="mt-2 text-sm opacity-80"
          >
            Send professional school notifications
          </Typography>

        </CardHeader>

        {/* BODY */}

        <CardBody className="space-y-6">

          {/* RECIPIENT TYPE */}

          <div>

            <Typography
              variant="small"
              className="mb-2 font-semibold"
            >
              Recipient Type
            </Typography>

            <Select
              value={recipientType}
              onChange={(val) =>
                setRecipientType(val)
              }
            >

              <Option value="ALL_STUDENTS">
                ALL STUDENTS
              </Option>

              <Option value="ALL_TEACHERS">
                ALL TEACHERS
              </Option>

              <Option value="ALL">
                ALL USERS
              </Option>

              <Option value="SINGLE_TEACHER">
                SINGLE TEACHER
              </Option>

              <Option value="SINGLE_STUDENT">
                SINGLE STUDENT
              </Option>

              <Option value="CLASS_STUDENTS">
                CLASS STUDENTS
              </Option>

            </Select>

          </div>

          {/* ========================================= */}
          {/* SINGLE TEACHER */}
          {/* ========================================= */}

          {recipientType ===
            "SINGLE_TEACHER" && (

            <div>

              <Typography
                variant="small"
                className="mb-2 font-semibold"
              >
                Select Teacher
              </Typography>

              <Select
                value={teacherId}
                onChange={(val) =>
                  setTeacherId(val)
                }
              >

                {teachers.map((teacher) => (

                  <Option
                    key={teacher.id}
                    value={teacher.id}
                  >
                    {teacher.name}
                  </Option>

                ))}

              </Select>

            </div>
          )}

          {/* ========================================= */}
          {/* CLASS STUDENTS */}
          {/* ========================================= */}

          {recipientType ===
            "CLASS_STUDENTS" && (

            <div>

              <Typography
                variant="small"
                className="mb-2 font-semibold"
              >
                Select Class
              </Typography>

              <Select
                value={className}
                onChange={(val) => {

                  setClassName(val);

                  loadStudents(val);

                }}
              >

                {classes.map((cls) => (

                  <Option
                    key={cls.id}
                    value={cls.className}
                  >
                    {cls.className}
                  </Option>

                ))}

              </Select>

            </div>
          )}

          {/* ========================================= */}
          {/* SINGLE STUDENT */}
          {/* ========================================= */}

          {recipientType ===
            "SINGLE_STUDENT" && (

            <>

              {/* CLASS */}

              <div>

                <Typography
                  variant="small"
                  className="mb-2 font-semibold"
                >
                  Select Class
                </Typography>

                <Select
                  value={className}
                  onChange={(val) => {

                    setClassName(val);

                    loadStudents(val);

                  }}
                >

                  {classes.map((cls) => (

                    <Option
                      key={cls.id}
                      value={cls.className}
                    >
                      {cls.className}
                    </Option>

                  ))}

                </Select>

              </div>

              {/* STUDENTS */}

              <div>

                <Typography
                  variant="small"
                  className="mb-2 font-semibold"
                >
                  Select Student
                </Typography>

                <Select
                  value={studentId}
                  onChange={(val) =>
                    setStudentId(val)
                  }
                >

                  {students.map((student) => (

                    <Option
                      key={student.id}
                      value={student.id}
                    >
                      {student.fullName}
                    </Option>

                  ))}

                </Select>

              </div>

            </>
          )}

          {/* TITLE */}

          <Input
            label="Notification Title"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            required
          />

          {/* SUBJECT */}

          <Input
            label="Subject"
            value={subject}
            onChange={(e) =>
              setSubject(e.target.value)
            }
          />

          {/* MESSAGE */}

          <div>

            <Typography
              variant="small"
              className="mb-2 font-semibold"
            >
              Message
            </Typography>

            <textarea
              className="w-full border border-gray-300 rounded-2xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[140px]"
              placeholder="Enter your message..."
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              required
            />

          </div>

          {/* BUTTON */}

          <Button
            type="submit"
            fullWidth
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl py-4 text-lg shadow-lg hover:scale-[1.02] transition-all duration-300"
          >

            {isLoading ? (

              <div className="flex justify-center">

                <Spinner className="h-5 w-5" />

              </div>

            ) : (

              "SEND NOTIFICATION"

            )}

          </Button>

        </CardBody>
      </Card>
    </div>
  );
};

export default NotificationSender;