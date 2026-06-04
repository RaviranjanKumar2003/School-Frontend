
import React, { useEffect, useState } from "react";

import axios from "axios";

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
  TrashIcon,
  PencilSquareIcon,
  BellIcon,
} from "@heroicons/react/24/solid";

const SchoolAdminNotification = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [recipientType, setRecipientType] =
    useState("ALL");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [teacherId, setTeacherId] =
    useState("");

  const [hodId, setHodId] =
    useState("");

  const [classId, setClassId] =
    useState("");

  const [classes, setClasses] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [teachers, setTeachers] =
    useState([]);

  const [hods, setHods] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(false);

  const [myNotices, setMyNotices] =
    useState([]);

  const [editingNotice, setEditingNotice] =
    useState(null);

  const [showForm, setShowForm] =
    useState(false);

  // =====================================================
  // ADMIN DATA
  // =====================================================

  const adminData =
    JSON.parse(
      localStorage.getItem(
        "schoolAdminData"
      )
    );

  const adminId =
    adminData?.id ||
    adminData?.schoolAdminId;

  const schoolId =
    adminData?.school?.id ||
    adminData?.schoolId;

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {

    if (!schoolId) return;

    loadClasses();

    loadTeachers();

    loadHods();

    loadMyNotices();

  }, [schoolId]);

  // =====================================================
  // LOAD CLASSES
  // =====================================================

  const loadClasses = async () => {

    try {

      const res = await axios.get(
        `http://localhost:8080/api/classes/by-school/${schoolId}`
      );

      setClasses(res.data || []);

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================================
  // LOAD TEACHERS
  // =====================================================

  const loadTeachers = async () => {

    try {

      const res = await axios.get(
        `http://localhost:8080/api/professors/by-school/${schoolId}`
      );

      setTeachers(res.data || []);

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================================
  // LOAD HODS
  // =====================================================

  const loadHods = async () => {

    try {

      const res = await axios.get(
        `http://localhost:8080/api/hods/school/${schoolId}`
      );

      setHods(res.data || []);

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  const loadStudents = async (
    selectedClassId
  ) => {

    try {

      const res = await axios.get(
        `http://localhost:8080/api/students/school/${schoolId}/class/${selectedClassId}`
      );

      setStudents(res.data || []);

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================================
  // LOAD MY NOTICES
  // =====================================================

  const loadMyNotices = async () => {

    try {

      const res = await axios.get(

        `http://localhost:8080/api/notifications/my/${adminId}/ADMIN`

      );

      setMyNotices(
        res.data || []
      );

    } catch (err) {

      console.log(err);
    }
  };

  // =====================================================
  // RESET FORM
  // =====================================================

  const resetForm = () => {

    setTitle("");

    setSubject("");

    setMessage("");

    setStudentId("");

    setTeacherId("");

    setHodId("");

    setClassId("");

    setStudents([]);

    setRecipientType("ALL");

    setEditingNotice(null);
  };

  // =====================================================
  // EDIT NOTICE
  // =====================================================

  const editNotice = (notice) => {
    setShowForm(true);
    setEditingNotice(
      notice
    );

    setTitle(
      notice.title
    );

    setSubject(
      notice.subject
    );

    setMessage(
      notice.message
    );

    setRecipientType(
      notice.recipientType
    );
  };

  // =====================================================
  // DELETE NOTICE
  // =====================================================

  const deleteNotice = async (
    noticeId
  ) => {

    const confirmDelete =
      window.confirm(
        "Delete this notice?"
      );

    if (!confirmDelete) return;

    try {

      await axios.delete(

        `http://localhost:8080/api/notifications/delete-notice/${noticeId}/${adminId}/ADMIN`

      );

      alert(
        "✅ Notice Deleted"
      );

      loadMyNotices();

    } catch (err) {

      console.log(err);

      alert(
        "❌ Delete failed"
      );
    }
  };

  // =====================================================
  // SEND / UPDATE
  // =====================================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setIsLoading(true);

      const data = {

        title,

        subject,

        message,

        sender:
          adminData?.name ||
          "School Admin",

        senderType:
          "ADMIN",

        senderId:
          adminId,

        schoolId,

        recipientType,

        studentId:

          recipientType ===
          "SINGLE_STUDENT"

            ? Number(studentId)

            : null,

        teacherId:

          recipientType ===
          "SINGLE_TEACHER"

            ? Number(teacherId)

            : null,

        recipientId:

          recipientType ===
          "SINGLE_HOD"

            ? Number(hodId)

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

      let res;

      // UPDATE

      if (editingNotice) {

        res = await axios.put(

          `http://localhost:8080/api/notifications/update/${editingNotice.id}`,

          data
        );

      }

      // CREATE

      else {

        res = await axios.post(

          "http://localhost:8080/api/notifications/send",

          data
        );
      }

      if (
        res.status === 200
      ) {

        alert(

          editingNotice

            ? "✅ Notice Updated"

            : "✅ Notice Sent Successfully"
        );

        resetForm();

        loadMyNotices();
      }

    } catch (err) {

      console.log(err);

      alert(
        "❌ Operation Failed"
      );

    } finally {

      setIsLoading(false);
    }
  };

  return (

    <div className="
    min-h-screen
    bg-gradient-to-br
    from-slate-100
    via-blue-50
    to-indigo-100
    p-6
    ">

      {/* HEADER */}

      <div className="
      flex
      justify-between
      items-center
      mb-10
      ">

        <div>

          <h1 className="
          text-4xl
          font-bold
          text-gray-800
          flex
          items-center
          gap-3
          ">

            <BellIcon className="
            h-10
            w-10
            text-indigo-600
            " />

            School Notifications

          </h1>

          <p className="
          text-gray-500
          mt-2
          ">
            Send professional notices
            to students, teachers & HODs
          </p>
          <div className="mt-5">

  <Button

    onClick={() =>
      setShowForm(!showForm)
    }

    className="
    bg-gradient-to-r
    from-blue-600
    to-indigo-600
    rounded-xl
    "
  >

    {
      showForm

      ? "Close Form"

      : "Create Notice"
    }

  </Button>

</div>

        </div>

      </div>

      {/* ================================================= */}
      {/* FORM */}
      {/* ================================================= */}

     {
     showForm && (

      <Card className="
      rounded-3xl
      shadow-2xl
      border
      border-gray-100
      mb-12
      ">

        <CardHeader
          floated={false}
          shadow={false}
          className="
          rounded-t-3xl
          bg-gradient-to-r
          from-indigo-600
          to-blue-600
          p-8
          "
        >

          <Typography
            variant="h3"
            color="white"
            className="
            font-bold
            "
          >

            {
              editingNotice

                ? "Update Notice"

                : "Create New Notice"
            }

          </Typography>

        </CardHeader>

        <CardBody className="
        space-y-8
        ">

          {/* RECIPIENT */}

          <div>

            <Typography
              variant="small"
              className="
              mb-2
              font-bold
              "
            >
              Recipient Type
            </Typography>

            <Select
              value={recipientType}
              onChange={(val) =>
                setRecipientType(val)
              }
            >

              <Option value="ALL">
                ALL USERS
              </Option>

              <Option value="ALL_STUDENTS">
                ALL STUDENTS
              </Option>

              <Option value="ALL_TEACHERS">
                ALL TEACHERS
              </Option>

              <Option value="CLASS_STUDENTS">
                CLASS STUDENTS
              </Option>

              <Option value="SINGLE_STUDENT">
                SINGLE STUDENT
              </Option>

              <Option value="SINGLE_TEACHER">
                SINGLE TEACHER
              </Option>

              <Option value="SINGLE_HOD">
                SINGLE HOD
              </Option>

            </Select>

          </div>

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

                {classes.map((cls) => (

                  <Option
                    key={cls.id}
                    value={cls.id.toString()}
                  >
                    {cls.className}
                  </Option>

                ))}

              </Select>
            )
          }

          {/* STUDENT */}

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

                {students.map((s) => (

                  <Option
                    key={s.id}
                    value={s.id.toString()}
                  >
                    {s.studfirstName}{" "}
                    {s.studlastName}
                  </Option>

                ))}

              </Select>
            )
          }

          {/* TEACHER */}

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

                {teachers.map((t) => (

                  <Option
                    key={t.id}
                    value={t.id.toString()}
                  >
                    {t.name}
                  </Option>

                ))}

              </Select>
            )
          }

          {/* HOD */}

          {
            recipientType ===
            "SINGLE_HOD"

            && (

              <Select
                value={hodId}
                onChange={(val) =>
                  setHodId(val)
                }
              >

                {hods.map((h) => (

                  <Option
                    key={h.id}
                    value={h.id.toString()}
                  >
                    {h.name}
                  </Option>

                ))}

              </Select>
            )
          }

          {/* TITLE */}

          <Input
            label="Notice Title"
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
            rows="6"
            className="
            w-full
            border
            border-gray-300
            rounded-2xl
            p-5
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            "
            placeholder="
            Write your school notice...
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
            from-indigo-600
            to-blue-600
            py-4
            rounded-2xl
            text-lg
            "
          >

            {
              isLoading

                ? (

                  <div className="
                  flex
                  justify-center
                  ">

                    <Spinner
                      className="
                      h-5
                      w-5
                      "
                    />

                  </div>

                )

                : editingNotice

                ? "UPDATE NOTICE"

                : "SEND NOTICE"
            }

          </Button>

        </CardBody>

      </Card>
      )
      }

      {/* ================================================= */}
      {/* MY NOTICES */}
      {/* ================================================= */}

      <div>

        <h2 className="
        text-3xl
        font-bold
        mb-8
        text-gray-800
        ">
          My Notices
        </h2>

        <div className="
        grid
        md:grid-cols-2
        lg:grid-cols-3
        gap-8
        ">

          {myNotices.map((notice) => (

            <Card
              key={notice.id}
              className="
              rounded-3xl
              shadow-xl
              border
              border-gray-100
              hover:scale-105
              transition
              duration-300
              "
            >

              <CardBody>

                <div className="
                flex
                justify-between
                items-start
                mb-4
                ">

                  <Typography
                    variant="h5"
                    className="
                    font-bold
                    "
                  >
                    {notice.title}
                  </Typography>

                  <Chip
                    value={
                      notice.recipientType
                    }
                    color="blue"
                  />

                </div>

                <Typography
                  className="
                  text-sm
                  text-gray-500
                  mb-3
                  "
                >
                  {notice.subject}
                </Typography>

                <Typography
                  className="
                  text-gray-700
                  mb-5
                  "
                >
                  {notice.message}
                </Typography>

                <div className="
                flex
                justify-between
                items-center
                ">

                  <Button
                    color="blue"
                    size="sm"
                    className="
                    flex
                    items-center
                    gap-2
                    rounded-xl
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
                    flex
                    items-center
                    gap-2
                    rounded-xl
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

          ))}

        </div>

      </div>

    </div>
  );
};

export default SchoolAdminNotification;