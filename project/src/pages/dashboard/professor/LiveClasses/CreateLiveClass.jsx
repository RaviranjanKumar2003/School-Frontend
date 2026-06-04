import React, {
  useState,
  useEffect,
} from "react";

import axios from "axios";

import {
  VideoCameraIcon,
  CalendarDaysIcon,
  ClockIcon,
  LinkIcon,
  UserGroupIcon,
  AcademicCapIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

const LIVE_CLASS_API =
  "http://localhost:8080/api/live-class";

const CLASS_API =
  "http://localhost:8080/api/classes";

function CreateLiveClass({
  onSuccess,
}) {
  const [loading, setLoading] =
    useState(false);

  const [classLoading, setClassLoading] =
    useState(false);

  const [classes, setClasses] =
    useState([]);

  const schoolId =
    localStorage.getItem("schoolId") || "";

  const professorId =
    localStorage.getItem("professorId") || "";  // payload 

  const [form, setForm] = useState({ 
    schoolId,
    professorId,

    classId: "",

    topic: "",
    description: "",

    meetingProvider:
      "Google Meet",

    meetingLink: "",

    meetingId: "",
    meetingPassword: "",

    scheduledDate: "",
    scheduledTime: "",

    recordingEnabled: true,
    notifyStudents: true,
  });

  // ================= FETCH CLASSES =================

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses =
    async () => {
      try {
        setClassLoading(true);

        const res =
          await axios.get(
            `${CLASS_API}/by-school/${schoolId}`
          );
          console.log("Classes API =>", res.data);

        setClasses(
          res.data || []
        );
      } catch (error) {
        console.log(error);
      } finally {
        setClassLoading(false);
      }
    };

  // ================= HANDLE CHANGE =================

  const handleChange = (e) => {
  const {
    name,
    value,
    type,
    checked,
  } = e.target;

  console.log(
    "Changed =>",
    name,
    value
  );

  setForm((prev) => ({
    ...prev,
    [name]:
      type === "checkbox"
        ? checked
        : value,
  }));
};

  // ================= SUBMIT =================
  console.log(
  "Form Before Submit =>",
  form
);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (
    !form.topic ||
    !form.classId ||
    !form.meetingLink ||
    !form.scheduledDate ||
    !form.scheduledTime
  ) {
    alert("Please fill all required fields");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      ...form,
      schoolId: Number(form.schoolId),
      professorId: Number(form.professorId),
      classId: Number(form.classId),
    };

    console.log("Payload =>", payload);

    await axios.post(
      LIVE_CLASS_API,
      payload
    );

    alert(
      "Live Class Created Successfully"
    );

    setForm((prev) => ({
      ...prev,
      classId: "",
      topic: "",
      description: "",
      meetingLink: "",
      meetingId: "",
      meetingPassword: "",
      scheduledDate: "",
      scheduledTime: "",
    }));

    onSuccess?.();

  } catch (error) {

    console.log(
      "Backend Response =>",
      error.response?.data
    );

    alert(
      error.response?.data ||
      "Failed To Create Live Class"
    );

  } finally {
    setLoading(false);
  }
};

  return (
    <div className="max-w-6xl mx-auto">

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">

        {/* HEADER */}

        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8">

          <div className="flex items-center gap-4">

            <div className="bg-white/20 p-3 rounded-2xl">

              <VideoCameraIcon className="h-8 w-8 text-white" />

            </div>

            <div>

              <h2 className="text-3xl font-bold text-white">
                Create Live Class
              </h2>

              <p className="text-blue-100 mt-1">
                Schedule and manage
                online learning
                sessions
              </p>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8"
        >
          <div className="grid lg:grid-cols-2 gap-6">

            {/* TOPIC */}

            <div>

              <label className="block font-semibold mb-2 text-slate-700">

                Topic *
              </label>

              <input
                type="text"
                name="topic"
                value={
                  form.topic
                }
                onChange={
                  handleChange
                }
                placeholder="React Hooks & State Management"
                className="w-full border border-slate-300 rounded-2xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {/* CLASS */}

            <div>

              <label className="block font-semibold mb-2 text-slate-700">

                Select Class *
              </label>

              <div className="relative">

                <AcademicCapIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <select
                className="w-full border border-slate-300 rounded-2xl pl-10 p-3 focus:ring-2 focus:ring-blue-500 outline-none"
  name="classId"
  value={form.classId}
  onChange={handleChange}
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
            </div>

            {/* PROVIDER */}

            <div>

              <label className="block font-semibold mb-2 text-slate-700">

                Meeting Provider
              </label>

              <select
                name="meetingProvider"
                value={
                  form.meetingProvider
                }
                onChange={
                  handleChange
                }
                className="w-full border border-slate-300 rounded-2xl p-3"
              >
                <option>
                  Google Meet
                </option>

                <option>
                  Zoom
                </option>

                <option>
                  Microsoft Teams
                </option>
              </select>
            </div>

            {/* DATE */}

            <div>

              <label className="block font-semibold mb-2 text-slate-700">

                Scheduled Date *
              </label>

              <div className="relative">

                <CalendarDaysIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <input
                  type="date"
                  name="scheduledDate"
                  value={
                    form.scheduledDate
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border border-slate-300 rounded-2xl pl-10 p-3"
                />
              </div>
            </div>

            {/* TIME */}

            <div>

              <label className="block font-semibold mb-2 text-slate-700">

                Scheduled Time *
              </label>

              <div className="relative">

                <ClockIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <input
                  type="time"
                  name="scheduledTime"
                  value={
                    form.scheduledTime
                  }
                  onChange={
                    handleChange
                  }
                  className="w-full border border-slate-300 rounded-2xl pl-10 p-3"
                />
              </div>
            </div>

            {/* MEETING ID */}

            <div>

              <label className="block font-semibold mb-2 text-slate-700">

                Meeting ID
              </label>

              <input
                type="text"
                name="meetingId"
                value={
                  form.meetingId
                }
                onChange={
                  handleChange
                }
                className="w-full border border-slate-300 rounded-2xl p-3"
              />
            </div>

            {/* PASSWORD */}

            <div>

              <label className="block font-semibold mb-2 text-slate-700">

                Meeting Password
              </label>

              <input
                type="text"
                name="meetingPassword"
                value={
                  form.meetingPassword
                }
                onChange={
                  handleChange
                }
                className="w-full border border-slate-300 rounded-2xl p-3"
              />
            </div>

            {/* LINK */}

            <div className="lg:col-span-2">

              <label className="block font-semibold mb-2 text-slate-700">

                Meeting Link *
              </label>

              <div className="relative">

                <LinkIcon className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />

                <input
                  type="url"
                  name="meetingLink"
                  value={
                    form.meetingLink
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="https://meet.google.com/..."
                  className="w-full border border-slate-300 rounded-2xl pl-10 p-3"
                />
              </div>
            </div>

            {/* DESCRIPTION */}

            <div className="lg:col-span-2">

              <label className="block font-semibold mb-2 text-slate-700">

                Description
              </label>

              <textarea
                rows={4}
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                placeholder="Enter class description..."
                className="w-full border border-slate-300 rounded-2xl p-3"
              />
            </div>

            {/* SETTINGS */}

            <div className="lg:col-span-2">

              <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6">

                <h3 className="font-bold text-lg flex items-center gap-2 mb-5">

                  <UserGroupIcon className="h-6 w-6" />

                  Session Settings
                </h3>

                <div className="grid md:grid-cols-2 gap-4">

                  <label className="flex items-center gap-3 bg-white rounded-xl p-4 border">

                    <input
                      type="checkbox"
                      name="notifyStudents"
                      checked={
                        form.notifyStudents
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Notify Students
                  </label>

                  <label className="flex items-center gap-3 bg-white rounded-xl p-4 border">

                    <input
                      type="checkbox"
                      name="recordingEnabled"
                      checked={
                        form.recordingEnabled
                      }
                      onChange={
                        handleChange
                      }
                    />

                    Enable Recording
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* BUTTON */}

          <div className="mt-8 flex justify-end">

            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-2xl font-semibold shadow-lg hover:scale-105 transition disabled:opacity-50"
            >
              <PlusCircleIcon className="h-5 w-5" />

              {loading
                ? "Creating..."
                : "Create Live Class"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateLiveClass;