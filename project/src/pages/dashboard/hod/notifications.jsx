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
  Chip,
} from "@material-tailwind/react";

import {
  PencilSquareIcon,
  TrashIcon,
  BellIcon,
} from "@heroicons/react/24/solid";

const HodNotifications = () => {

  // ======================================================
  // STATES
  // ======================================================

  const [activeTab, setActiveTab] =
    useState("MY");

  const [recipientType, setRecipientType] =
    useState("ALL_STUDENTS");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [teacherId, setTeacherId] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [classId, setClassId] =
    useState("");

  const [teachers, setTeachers] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [classes, setClasses] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  const [myNotices, setMyNotices] =
    useState([]);

  const [editingNotice, setEditingNotice] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  // ======================================================
  // LOCAL STORAGE
  // ======================================================

  const hodData =
    JSON.parse(
      localStorage.getItem("hodData")
    );

  const schoolId =
    hodData?.school?.id;

  const sender =
    localStorage.getItem("userName");

  const senderId =
    hodData?.id;

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {

    loadNotifications();

    loadMyNotices();

    // TEACHERS

    fetch(
      `http://localhost:8080/api/professors/by-school/${schoolId}`
    )
      .then((res) => res.json())
      .then((data) => {

        setTeachers(data || []);

      })
      .catch((err) => console.log(err));

    // CLASSES

    fetch(
      `http://localhost:8080/api/classes/by-school/${schoolId}`
    )
      .then((res) => res.json())
      .then((data) => {

        setClasses(data || []);

      })
      .catch((err) => console.log(err));

  }, [schoolId]);

  // ======================================================
  // LOAD RECEIVED NOTIFICATIONS
  // ======================================================

  const loadNotifications = async () => {

    try {

      const res = await fetch(

        `http://localhost:8080/api/notifications/hod/${senderId}`

      );

      const data =
        await res.json();

      setNotifications(data || []);

    } catch (err) {

      console.log(err);
    }
  };

  // ======================================================
  // LOAD MY NOTICES
  // ======================================================

  const loadMyNotices = async () => {

    try {

      const res = await fetch(

        `http://localhost:8080/api/notifications/my/${senderId}/HOD`

      );

      const data =
        await res.json();

      setMyNotices(data || []);

    } catch (err) {

      console.log(err);
    }
  };

  // ======================================================
  // LOAD STUDENTS
  // ======================================================

  const loadStudents = async (
    selectedClassId
  ) => {

    try {

      const res = await fetch(

        `http://localhost:8080/api/students/school/${schoolId}/class/${selectedClassId}`

      );

      const data =
        await res.json();

      setStudents(data || []);

    } catch (err) {

      console.log(err);
    }
  };

  // ======================================================
  // RESET FORM
  // ======================================================

  const resetForm = () => {

    setTitle("");

    setSubject("");

    setMessage("");

    setRecipientType(
      "ALL_STUDENTS"
    );

    setTeacherId("");

    setStudentId("");

    setClassId("");

    setStudents([]);

    setEditingNotice(null);
  };

  // ======================================================
  // EDIT NOTICE
  // ======================================================

  const editNotice = (
    notice
  ) => {

    setEditingNotice(notice);

    setActiveTab("CREATE");

    setTitle(notice.title);

    setSubject(notice.subject);

    setMessage(notice.message);

    setRecipientType(
      notice.recipientType
    );
  };

  // ======================================================
  // DELETE NOTICE
  // ======================================================

  const deleteNotice = async (
    noticeId
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this notice?"
      );

    if (!confirmDelete) return;

    try {

      await fetch(

        `http://localhost:8080/api/notifications/delete-notice/${noticeId}/${senderId}/HOD`,

        {
          method: "DELETE",
        }
      );

      alert(
        "✅ Notice Deleted"
      );

      loadMyNotices();

    } catch (err) {

      console.log(err);

      alert(
        "❌ Delete Failed"
      );
    }
  };

  // ======================================================
  // SUBMIT
  // ======================================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    const notificationData = {

      title,

      subject,

      message,

      sender,

      senderType: "HOD",

      senderId:
        Number(senderId),

      schoolId:
        Number(schoolId),

      recipientType,

      teacherId:
        recipientType ===
        "SINGLE_TEACHER"

          ? Number(teacherId)

          : null,

      studentId:
        recipientType ===
        "SINGLE_STUDENT"

          ? Number(studentId)

          : null,

      classId:
        recipientType ===
        "CLASS_STUDENTS"

        ||

        recipientType ===
        "SINGLE_STUDENT"

          ? Number(classId)

          : null,
    };

    try {

      setIsLoading(true);

      let response;

      // UPDATE

      if (editingNotice) {

        response = await fetch(

          `http://localhost:8080/api/notifications/update/${editingNotice.id}`,

          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              notificationData
            ),
          }
        );
      }

      // CREATE

      else {

        response = await fetch(

          "http://localhost:8080/api/notifications/send",

          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              notificationData
            ),
          }
        );
      }

      if (response.ok) {

        alert(

          editingNotice

            ? "✅ Notice Updated"

            : "✅ Notice Sent Successfully"

        );

        resetForm();

        loadNotifications();

        loadMyNotices();

        setActiveTab("MY");

      } else {

        alert(
          "❌ Failed"
        );
      }

    } catch (err) {

      console.log(err);

    } finally {

      setIsLoading(false);

    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="
    min-h-screen
    bg-gradient-to-br
    from-slate-100
    via-blue-50
    to-indigo-100
    p-6
    ">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="
      max-w-7xl
      mx-auto
      ">

        <div className="
        flex
        justify-between
        items-center
        flex-wrap
        gap-5
        mb-8
        ">

          <div>

            <div className="
            flex
            items-center
            gap-4
            ">

              <div className="
              bg-gradient-to-r
              from-blue-600
              to-indigo-600
              p-4
              rounded-2xl
              shadow-lg
              ">

                <BellIcon className="
                h-10
                w-10
                text-white
                " />

              </div>

              <div>

                <h1 className="
                text-4xl
                font-bold
                text-gray-800
                ">
                  HOD Notifications
                </h1>

                <p className="
                text-gray-500
                mt-1
                ">
                  Professional Notification Management
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================== */}
        {/* TABS */}
        {/* ====================================================== */}

        <div className="
        flex
        gap-4
        mb-10
        flex-wrap
        ">

          <Button

            onClick={() =>
              setActiveTab("MY")
            }

            className={

              activeTab === "MY"

              ?

              "rounded-2xl bg-blue-600 shadow-lg"

              :

              "rounded-2xl bg-white text-black shadow-md"
            }
          >
            My Notices
          </Button>

          <Button

            onClick={() =>
              setActiveTab("RECEIVED")
            }

            className={

              activeTab === "RECEIVED"

              ?

              "rounded-2xl bg-indigo-600 shadow-lg"

              :

              "rounded-2xl bg-white text-black shadow-md"
            }
          >
            Received Notices
          </Button>

          <Button

            onClick={() =>
              setActiveTab("CREATE")
            }

            className={

              activeTab === "CREATE"

              ?

              "rounded-2xl bg-green-600 shadow-lg"

              :

              "rounded-2xl bg-white text-black shadow-md"
            }
          >
            Create Notice
          </Button>

        </div>

        {/* ====================================================== */}
        {/* CREATE FORM */}
        {/* ====================================================== */}

        {
          activeTab === "CREATE" && (

            <Card className="
            rounded-3xl
            shadow-2xl
            border
            border-gray-100
            mb-10
            ">

              <CardHeader
                floated={false}
                shadow={false}
                className="
                rounded-t-3xl
                bg-gradient-to-r
                from-blue-600
                to-indigo-600
                p-6
                "
              >

                <Typography
                  variant="h4"
                  color="white"
                >

                  {
                    editingNotice

                    ? "Update Notice"

                    : "Create New Notice"
                  }

                </Typography>

              </CardHeader>

              <CardBody className="
              space-y-6
              ">

                {/* RECIPIENT */}

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

                {/* SINGLE TEACHER */}

                {
                  recipientType ===
                  "SINGLE_TEACHER"

                  && (

                    <Select
                      value={teacherId}
                      onChange={(val) =>
                        setTeacherId(val)
                      }
                    >

                      {
                        teachers.map((teacher) => (

                          <Option
                            key={teacher.id}
                            value={teacher.id.toString()}
                          >
                            {teacher.name}
                          </Option>

                        ))
                      }

                    </Select>
                  )
                }

                {/* CLASS */}

                {
                  (
                    recipientType ===
                    "CLASS_STUDENTS"

                    ||

                    recipientType ===
                    "SINGLE_STUDENT"
                  )

                  && (

                    <Select
                      value={classId}
                      onChange={(val) => {

                        setClassId(val);

                        loadStudents(val);

                      }}
                    >

                      {
                        classes.map((cls) => (

                          <Option
                            key={cls.id}
                            value={cls.id.toString()}
                          >
                            {cls.className}
                          </Option>

                        ))
                      }

                    </Select>
                  )
                }

                {/* SINGLE STUDENT */}

                {
                  recipientType ===
                  "SINGLE_STUDENT"

                  && (

                    <Select
                      value={studentId}
                      onChange={(val) =>
                        setStudentId(val)
                      }
                    >

                      {
                        students.map((student) => (

                          <Option
                            key={student.id}
                            value={student.id.toString()}
                          >
                            {
                              student.studfirstName
                            }{" "}
                            {
                              student.studlastName
                            }
                          </Option>

                        ))
                      }

                    </Select>
                  )
                }

                {/* TITLE */}

                <Input
                  label="Notification Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
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

                <textarea
                  className="
                  w-full
                  min-h-[180px]
                  rounded-2xl
                  border
                  border-gray-300
                  p-5
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  "
                  placeholder="
                  Write your notification message...
                  "
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                />

                {/* BUTTON */}

                <Button
                  fullWidth
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="
                  bg-gradient-to-r
                  from-blue-600
                  to-indigo-600
                  rounded-2xl
                  py-4
                  text-lg
                  "
                >

                  {
                    isLoading

                    ?

                    <Spinner className="
                    mx-auto
                    h-5
                    w-5
                    " />

                    :

                    editingNotice

                    ? "UPDATE NOTICE"

                    : "SEND NOTICE"
                  }

                </Button>

              </CardBody>

            </Card>
          )
        }

        {/* ====================================================== */}
        {/* MY NOTICES */}
        {/* ====================================================== */}

        {
          activeTab === "MY" && (

            <div>

              <h2 className="
              text-3xl
              font-bold
              text-gray-800
              mb-8
              ">
                My Notices
              </h2>

              <div className="
              grid
              md:grid-cols-2
              gap-8
              ">

                {
                  myNotices.map((notice) => (

                    <Card
                      key={notice.id}
                      className="
                      rounded-3xl
                      shadow-xl
                      border
                      border-gray-100
                      hover:scale-[1.01]
                      transition
                      "
                    >

                      <CardBody>

                        <div className="
                        flex
                        justify-between
                        items-start
                        mb-5
                        ">

                          <div>

                            <h2 className="
                            text-2xl
                            font-bold
                            text-gray-800
                            ">
                              {notice.title}
                            </h2>

                            <p className="
                            text-blue-600
                            font-semibold
                            mt-1
                            ">
                              {
                                notice.recipientType
                              }
                            </p>

                          </div>

                          <Chip
                            value="MY NOTICE"
                            color="blue"
                          />

                        </div>

                        <p className="
                        text-gray-600
                        leading-relaxed
                        min-h-[80px]
                        ">
                          {notice.message}
                        </p>

                        <div className="
                        flex
                        justify-between
                        items-center
                        mt-8
                        ">

                          <Button
                            color="blue"
                            size="sm"
                            className="
                            rounded-xl
                            flex
                            items-center
                            gap-2
                            "
                            onClick={() =>
                              editNotice(notice)
                            }
                          >

                            <PencilSquareIcon
                              className="
                              h-4
                              w-4
                              "
                            />

                            Edit

                          </Button>

                          <Button
                            color="red"
                            size="sm"
                            className="
                            rounded-xl
                            flex
                            items-center
                            gap-2
                            "
                            onClick={() =>
                              deleteNotice(
                                notice.id
                              )
                            }
                          >

                            <TrashIcon
                              className="
                              h-4
                              w-4
                              "
                            />

                            Delete

                          </Button>

                        </div>

                      </CardBody>

                    </Card>
                  ))
                }

              </div>

            </div>
          )
        }

        {/* ====================================================== */}
        {/* RECEIVED */}
        {/* ====================================================== */}

        {
          activeTab === "RECEIVED" && (

            <div>

              <h2 className="
              text-3xl
              font-bold
              text-gray-800
              mb-8
              ">
                Received Notifications
              </h2>

              {
                notifications.length === 0 && (

                  <Card className="
                  rounded-3xl
                  shadow-lg
                  ">

                    <CardBody className="
                    p-10
                    text-center
                    ">

                      <h2 className="
                      text-2xl
                      font-bold
                      text-gray-700
                      ">
                        No Notifications
                      </h2>

                      <p className="
                      text-gray-500
                      mt-2
                      ">
                        No notices received yet
                      </p>

                    </CardBody>

                  </Card>
                )
              }

              <div className="
              grid
              md:grid-cols-2
              gap-8
              ">

                {
                  notifications.map((notice) => (

                    <Card
                      key={
                        notice.notificationId
                      }
                      className="
                      rounded-3xl
                      shadow-xl
                      border
                      border-gray-100
                      hover:scale-[1.01]
                      transition
                      "
                    >

                      <CardBody>

                        <div className="
                        flex
                        justify-between
                        items-start
                        mb-5
                        ">

                          <div>

                            <h2 className="
                            text-2xl
                            font-bold
                            text-gray-800
                            ">
                              {notice.title}
                            </h2>

                            <p className="
                            text-indigo-600
                            font-semibold
                            mt-1
                            ">
                              {notice.sender}
                            </p>

                          </div>

                          <Chip
                            value="NOTICE"
                            color="indigo"
                          />

                        </div>

                        <p className="
                        text-gray-600
                        leading-relaxed
                        min-h-[80px]
                        ">
                          {notice.message}
                        </p>

                        <div className="
                        flex
                        justify-between
                        items-center
                        mt-6
                        text-sm
                        text-gray-400
                        ">

                          <span>

                            {
                              new Date(
                                notice.sentAt
                              ).toLocaleDateString()
                            }

                          </span>

                          <span>

                            {
                              new Date(
                                notice.sentAt
                              ).toLocaleTimeString()
                            }

                          </span>

                        </div>

                      </CardBody>

                    </Card>
                  ))
                }

              </div>

            </div>
          )
        }

      </div>

    </div>
  );
};

export default HodNotifications;