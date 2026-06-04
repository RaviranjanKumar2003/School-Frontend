import React, {
  useEffect,
  useState,
} from "react";

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
  BellIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const TeacherNotification = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [activeTab, setActiveTab] =
    useState("RECEIVED");

  const [recipientType, setRecipientType] =
    useState("CLASS_STUDENTS");

  const [title, setTitle] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [studentId, setStudentId] =
    useState("");

  const [classId, setClassId] =
    useState("");

  const [classes, setClasses] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [notifications, setNotifications] =
    useState([]);

  const [myNotices, setMyNotices] =
    useState([]);

  const [editingNotice, setEditingNotice] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(false);

  // =====================================================
  // TEACHER DATA
  // =====================================================

  const teacherData =
    JSON.parse(
      localStorage.getItem(
        "professorData"
      )
    );

  const teacherId =
    teacherData?.id;

  const schoolId =
    teacherData?.school?.id;

  // =====================================================
  // LOAD CLASSES
  // =====================================================

  useEffect(() => {

    if (!schoolId) return;

    loadClasses();

    loadNotifications();

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
  // RECEIVED
  // =====================================================

  const loadNotifications = async () => {

    try {

      const res = await axios.get(

        `http://localhost:8080/api/notifications/professor/${teacherId}`

      );

      setNotifications(
        res.data || []
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =====================================================
  // MY NOTICES
  // =====================================================

  const loadMyNotices = async () => {

    try {

      const res = await axios.get(

        `http://localhost:8080/api/notifications/my/${teacherId}/TEACHER`

      );

      setMyNotices(
        res.data || []
      );

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

      setStudents(
        res.data || []
      );

    } catch (err) {

      console.log(err);

    }
  };

  // =====================================================
  // RESET
  // =====================================================

  const resetForm = () => {

    setTitle("");

    setSubject("");

    setMessage("");

    setStudentId("");

    setClassId("");

    setStudents([]);

    setRecipientType(
      "CLASS_STUDENTS"
    );

    setEditingNotice(null);
  };

  // =====================================================
  // EDIT
  // =====================================================

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

  // =====================================================
  // DELETE
  // =====================================================

  const deleteNotice = async (
    noticeId
  ) => {

    const ok =
      window.confirm(
        "Delete Notice?"
      );

    if (!ok) return;

    try {

      await axios.delete(

        `http://localhost:8080/api/notifications/delete-notice/${noticeId}/${teacherId}/TEACHER`

      );

      alert(
        "✅ Deleted"
      );

      loadMyNotices();

    } catch (err) {

      console.log(err);

    }
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setIsLoading(true);

      const data = {

        title,

        subject,

        message,

        sender:
          teacherData?.name,

        senderType:
          "TEACHER",

        senderId:
          teacherId,

        schoolId,

        recipientType,

        studentId:

          recipientType ===
          "SINGLE_STUDENT"

            ?

            Number(studentId)

            :

            null,

        classId:

          recipientType ===
            "CLASS_STUDENTS"

          ||

          recipientType ===
            "SINGLE_STUDENT"

            ?

            Number(classId)

            :

            null,
      };

      // UPDATE

      if (editingNotice) {

        await axios.put(

          `http://localhost:8080/api/notifications/update/${editingNotice.id}`,

          data
        );

        alert(
          "✅ Updated"
        );
      }

      // CREATE

      else {

        await axios.post(

          "http://localhost:8080/api/notifications/send",

          data
        );

        alert(
          "✅ Notice Sent"
        );
      }

      resetForm();

      loadNotifications();

      loadMyNotices();

      setActiveTab("MY");

    } catch (err) {

      console.log(err);

      alert("❌ Failed");

    } finally {

      setIsLoading(false);

    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (

    <div className="
    min-h-screen
    bg-gradient-to-br
    from-green-50
    via-emerald-50
    to-teal-100
    p-6
    ">

      <div className="
      max-w-7xl
      mx-auto
      ">

        {/* HEADER */}

        <div className="
        flex
        items-center
        gap-5
        mb-10
        ">

          <div className="
          bg-gradient-to-r
          from-green-600
          to-emerald-600
          p-4
          rounded-2xl
          shadow-xl
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
              Teacher Notifications
            </h1>

            <p className="
            text-gray-500
            mt-1
            ">
              Professional School Notification System
            </p>

          </div>

        </div>

        {/* TABS */}

        <div className="
        flex
        gap-4
        flex-wrap
        mb-10
        ">

          <Button

            onClick={() =>
              setActiveTab("MY")
            }

            className={

              activeTab === "MY"

              ?

              "bg-green-600 rounded-2xl shadow-lg"

              :

              "bg-white text-black rounded-2xl"
            }
          >
            My Notices
          </Button>

          <Button

            onClick={() =>
              setActiveTab("RECEIVED")
            }

            className={

              activeTab ===
              "RECEIVED"

              ?

              "bg-emerald-600 rounded-2xl shadow-lg"

              :

              "bg-white text-black rounded-2xl"
            }
          >
            Received Notices
          </Button>

          <Button

            onClick={() =>
              setActiveTab("CREATE")
            }

            className={

              activeTab ===
              "CREATE"

              ?

              "bg-teal-600 rounded-2xl shadow-lg"

              :

              "bg-white text-black rounded-2xl"
            }
          >
            Create Notice
          </Button>

        </div>

        {/* CREATE */}

        {
          activeTab ===
          "CREATE"

          && (

            <Card className="
            rounded-3xl
            shadow-2xl
            mb-10
            ">

              <CardHeader
                floated={false}
                className="
                bg-gradient-to-r
                from-green-600
                to-emerald-600
                rounded-t-3xl
                p-6
                "
              >

                <Typography
                  variant="h4"
                  color="white"
                >

                  {
                    editingNotice

                    ?

                    "Update Notice"

                    :

                    "Create Notice"
                  }

                </Typography>

              </CardHeader>

              <CardBody className="
              space-y-6
              ">

                <Select
                  value={recipientType}
                  onChange={(val) =>
                    setRecipientType(val)
                  }
                >

                  <Option value="CLASS_STUDENTS">
                    One Class
                  </Option>

                  <Option value="SINGLE_STUDENT">
                    Single Student
                  </Option>

                </Select>

                {/* CLASS */}

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

                <Input
                  label="Title"
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                />

                <Input
                  label="Subject"
                  value={subject}
                  onChange={(e) =>
                    setSubject(e.target.value)
                  }
                />

                <textarea
                  rows="6"
                  placeholder="Write notice..."
                  className="
                  w-full
                  border
                  border-gray-300
                  rounded-2xl
                  p-5
                  "
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                />

                <Button
                  fullWidth
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className="
                  bg-gradient-to-r
                  from-green-600
                  to-emerald-600
                  py-4
                  rounded-2xl
                  text-lg
                  "
                >

                  {
                    isLoading

                    ?

                    <Spinner className="
                    h-5
                    w-5
                    mx-auto
                    " />

                    :

                    editingNotice

                    ?

                    "UPDATE NOTICE"

                    :

                    "SEND NOTICE"
                  }

                </Button>

              </CardBody>

            </Card>
          )
        }

        {/* MY NOTICES */}

        {
          activeTab === "MY"

          && (

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
              gap-8
              ">

                {
                  myNotices.map((notice) => (

                    <Card
                      key={notice.id}
                      className="
                      rounded-3xl
                      shadow-xl
                      "
                    >

                      <CardBody>

                        <div className="
                        flex
                        justify-between
                        mb-5
                        ">

                          <div>

                            <h2 className="
                            text-2xl
                            font-bold
                            ">
                              {notice.title}
                            </h2>

                            <p className="
                            text-green-600
                            mt-1
                            ">
                              {
                                notice.recipientType
                              }
                            </p>

                          </div>

                          <Chip
                            value="MY NOTICE"
                            color="green"
                          />

                        </div>

                        <p className="
                        text-gray-600
                        min-h-[80px]
                        ">
                          {notice.message}
                        </p>

                        <div className="
                        flex
                        justify-between
                        mt-8
                        ">

                          <Button
                            size="sm"
                            color="blue"
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

                            <PencilSquareIcon className="
                            h-4
                            w-4
                            " />

                            Edit

                          </Button>

                          <Button
                            size="sm"
                            color="red"
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

                            <TrashIcon className="
                            h-4
                            w-4
                            " />

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

        {/* RECEIVED */}

        {
          activeTab ===
          "RECEIVED"

          && (

            <div>

              <h2 className="
              text-3xl
              font-bold
              mb-8
              text-gray-800
              ">
                Received Notifications
              </h2>

              <div className="
              grid
              md:grid-cols-2
              xl:grid-cols-3
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
                      "
                    >

                      <CardBody>

                        <div className="
                        flex
                        justify-between
                        items-start
                        ">

                          <div>

                            <Typography
                              variant="h5"
                              className="
                              font-bold
                              "
                            >
                              {notice.title}
                            </Typography>

                            <p className="
                            text-green-600
                            mt-1
                            font-semibold
                            ">
                              {notice.sender}
                            </p>

                          </div>

                          <Chip
                            value="NOTICE"
                            color="green"
                          />

                        </div>

                        <p className="
                        text-gray-600
                        mt-5
                        min-h-[90px]
                        ">
                          {notice.message}
                        </p>

                        <p className="
                        text-xs
                        text-gray-400
                        mt-6
                        ">
                          {
                            new Date(
                              notice.sentAt
                            ).toLocaleString()
                          }
                        </p>

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

export default TeacherNotification;