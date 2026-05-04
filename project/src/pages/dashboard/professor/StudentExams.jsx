import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";

const StudentExams = () => {

  const [classes, setClasses] = useState([]);
  const teachers = JSON.parse(localStorage.getItem("professorData"));
  const teacherId = teachers?.id; // 🔥 FIX
  const teacher = JSON.parse(localStorage.getItem("professorData"));

  const [filter, setFilter] = useState("ALL");
  
  const [exams, setExams] = useState([]);
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [id, setId] = useState(null);
  const [loading, setLoading] = useState(false);

  const [examTypes, setExamTypes] = useState([]);



  useEffect(() => {
  axios.get("http://localhost:8080/api/exam-schedule/exam-types")
    .then(res => {
      setExamTypes(res.data);
    })
    .catch(err => console.log(err));
  }, []);

  const [form, setForm] = useState({
    classId: "",
    subjectName: "",
    examDate: "",
    shift: "MORNING",
    startTime: "",
    duration: "",
    mode: "OFFLINE",
    roomNo: "",
    meetingLink: "",
    message: "",
    totalMarks: "",
    examType: "",
  });

  useEffect(() => {
  loadExams();
  loadClasses(); // 🔥 add
  }, []);



  const filteredExams = exams.filter(e => {
  if (filter === "MY") return e.teacherId === teacherId;
  if (filter === "OTHER") return e.teacherId !== teacherId;
  return true;
  });
  


  const loadClasses = async () => {
  const res = await axios.get("http://localhost:8080/api/classes");
  setClasses(res.data);
  };

  const loadExams = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/api/exam-schedule`
      );
      setExams(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // 🔥 ERROR HANDLER
  const showError = (err) => {
  let msg = "❌ Something went wrong";

  if (typeof err.response?.data === "string") {
    msg = err.response.data;
  } else if (typeof err.response?.data === "object") {
    msg = err.response.data.message;
  } else {
    msg = err.message;
  }

  alert(msg);
  };

  const resetForm = () => {
    setForm({
      classId: "",
      subjectName: "",
      examDate: "",
      shift: "MORNING",
      startTime: "",
      duration: "",
      mode: "OFFLINE",
      roomNo: "",
      meetingLink: "",
      message: "",
      totalMarks: "",
      examType: "",
    });
  };

  // ✅ CREATE
  const createExam = async () => {
    try {
      setLoading(true);

      if (!form.examType) {
       alert("Please select exam type");
       return;
      }

      await axios.post("http://localhost:8080/api/exam-schedule", {
       ...form,
       subjectName: teacher?.subject || "Unknown", // 🔥 FIX
       teacherId: teacher?.id || teacherId        // 🔥 FIX
      });

      alert("✅ Exam Created");
      setOpen(false);
      resetForm();
      loadExams();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE
  const updateExam = async () => {
    try {
      setLoading(true);

     await axios.put(
     `http://localhost:8080/api/exam-schedule/${id}`,
     {
    ...form,
    subjectName: teacher?.subject || "Unknown",
    teacherId: teacher?.id || teacherId
    }
    );

      alert("✅ Updated");
      setOpen(false);
      setIsUpdate(false);
      resetForm();
      loadExams();
    } catch (err) {
      showError(err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ CANCEL
  const cancelExam = async (id) => {
    const reason = prompt("Enter cancel reason:");
    if (!reason) return;

    try {
      await axios.put(
        `http://localhost:8080/api/exam-schedule/cancel/${id}?reason=${reason}`
      );
      alert("❌ Cancelled");
      loadExams();
    } catch (err) {
      showError(err);
    }
  };

  // ✅ DELETE
  const deleteExam = async (id) => {
    if (!window.confirm("Delete this exam?")) return;

    try {
      await axios.delete(
        `http://localhost:8080/api/exam-schedule/${id}`
      );
      alert("🗑 Deleted");
      loadExams();
    } catch (err) {
      showError(err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-50 to-purple-100">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">📘 Exam Dashboard</Typography>

        <Button
          color="blue"
          onClick={() => {
            setOpen(true);
            setIsUpdate(false);
            resetForm();
          }}
        >
          + Create Exam
        </Button>
      </div>

     <div className="flex gap-3 mb-6 bg-white p-2 rounded-xl shadow w-fit">

  <Button
    size="sm"
    className={`px-5 rounded-lg transition ${
      filter === "ALL"
        ? "bg-blue-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
    onClick={() => setFilter("ALL")}
  >
    All
  </Button>

  <Button
    size="sm"
    className={`px-5 rounded-lg transition ${
      filter === "MY"
        ? "bg-green-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
    onClick={() => setFilter("MY")}
  >
    My Exams
  </Button>

  <Button
    size="sm"
    className={`px-5 rounded-lg transition ${
      filter === "OTHER"
        ? "bg-purple-600 text-white"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
    }`}
    onClick={() => setFilter("OTHER")}
  >
    Others
  </Button>
  </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <Card className="w-full max-w-lg shadow-2xl">
            <CardBody className="space-y-3">

              <Typography variant="h5">
                {isUpdate ? "Update Exam" : "Create Exam"}
              </Typography>

              <Select
              label="Select Class"
              value={form.classId}
              onChange={(v) => 
              setForm({ 
              ...form, 
              classId: v,
              subjectName: teacher?.subject?.trim() || ""
             })
             }
              >
              {classes.map((c) => (
              <Option key={c.id} value={c.id}>
                {c.className}
              </Option>
              ))}
              </Select>

        <Select
           label="Exam Type"
           value={form.examType}
           onChange={(v) => setForm({ ...form, examType: v })}
           >
           {examTypes.length === 0 ? (
           <Option disabled>Loading...</Option>
          ) : (
          examTypes.map(type => (
          <Option key={type} value={type}>
          {type.replace("_", " ")}
          </Option>
           ))
         )}
        </Select>

            <Input
             label="Subject"
             value={form.subjectName || "No Subject"}
             disabled
             />

              <Input type="date"
                value={form.examDate}
                onChange={(e)=>setForm({...form,examDate:e.target.value})} />

              <Input type="time"
                label="Start Time"
                value={form.startTime}
                onChange={(e)=>setForm({...form,startTime:e.target.value})} />

              <Input label="Duration (minutes)"
                value={form.duration}
                onChange={(e)=>setForm({...form,duration:e.target.value})} />

              <Input
               label="Total Marks"
               value={form.totalMarks}
               onChange={(e) =>
               setForm({ ...form, totalMarks: e.target.value })}/>

              <Select value={form.shift}
                onChange={(v)=>setForm({...form,shift:v})}>
                <Option value="MORNING">Morning</Option>
                <Option value="AFTERNOON">Afternoon</Option>
              </Select>

              <Select value={form.mode}
                onChange={(v)=>setForm({...form,mode:v})}>
                <Option value="OFFLINE">Offline</Option>
                <Option value="ONLINE">Online</Option>
              </Select>

              {form.mode === "OFFLINE" ? (
                <Input label="Room No"
                  value={form.roomNo}
                  onChange={(e)=>setForm({...form,roomNo:e.target.value})}/>
              ) : (
                <Input label="Meeting Link"
                  value={form.meetingLink}
                  onChange={(e)=>setForm({...form,meetingLink:e.target.value})}/>
              )}

              <Textarea label="Message"
                value={form.message}
                onChange={(e)=>setForm({...form,message:e.target.value})}/>

              <div className="flex gap-2">
                <Button
                  color="green"
                  onClick={isUpdate ? updateExam : createExam}
                  disabled={loading}
                  fullWidth
                >
                  {loading ? "Please wait..." : (isUpdate ? "Update" : "Create")}
                </Button>

                <Button
                  color="gray"
                  onClick={()=>setOpen(false)}
                  fullWidth
                >
                  Close
                </Button>
              </div>

            </CardBody>
          </Card>
        </div>
      )}

      {/* LIST */}
      <div className="grid md:grid-cols-3 gap-5">

        {filteredExams.map((e) => (
          <Card
            key={e.id}
            className="hover:scale-105 transition shadow-lg hover:shadow-2xl"
          >
            <CardBody>
              <Typography variant="h6" color="blue">
                Class {e.className} - Sub:- {e.subjectName}
              </Typography>
              <Typography variant="h6" color="gray">
               Teacher:-{e.teacherName}
              </Typography>
              <Typography className="text-green-600 font-semibold mt-1">
              Total Marks: {e.totalMarks}
              </Typography>
              <Typography>📅 {e.examDate}</Typography>
              <Typography>
               ⏰ {e.startTime} - {e.endTime}
              </Typography>
              <Typography>🕒 {e.shift}</Typography>

              <Typography>
                {e.mode === "ONLINE" ? "💻 Online" : "🏫 Offline"}
              </Typography>

              {e.status === "CANCELLED" && (
                <Typography color="red">
                  ❌ {e.cancelReason}
                </Typography>
              )}
              
              {e.teacherId === teacherId && (
              <div className="flex justify-between mt-4">

                <Button size="sm" color="blue"
                  onClick={()=>{
                    setOpen(true);
                    setIsUpdate(true);
                    setId(e.id);
                    setForm({...e, examType: e.examType || ""});
                  }}>
                  Update
                </Button>

                <Button size="sm" color="amber"
                  onClick={()=>cancelExam(e.id)}>
                  Cancel
                </Button>

                <Button size="sm" color="red"
                  onClick={()=>deleteExam(e.id)}>
                  Delete
                </Button>
              </div>
            )}
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StudentExams;