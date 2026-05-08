import { useEffect, useState } from "react";
import {
  getStudents,
  getStudentsByClass,
  getClasses,
  getSummary,
  addFee,
  getHistory,
  sendReminder   // ✅ ADD THIS
} from "../hod/StudentFee/feeService";

import SummaryCards from "../hod/StudentFee/SummaryCards";
import FeeTable from "../hod/StudentFee/FeeTable";
import FeeCardMobile from "../hod/StudentFee/FeeCardMobile";
import FeeModal from "../hod/StudentFee/FeeModal";
import HistoryModal from "../hod/StudentFee/HistoryModal";

export default function StudentFees() {

  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedClass, setSelectedClass] = useState("ALL");

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [showFeeModal, setShowFeeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const [feeItems, setFeeItems] = useState([
    { title: "", description: "", amount: "" }
  ]);

  const [history, setHistory] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const classMap = Object.fromEntries(
    classes.map(c => [Number(c.id), c.className])
  );

  // ================= FETCH =================

  const fetchStudentsData = async () => {
    const res = await getStudents();
    setStudents(res.data);
  };

  const fetchClassesData = async () => {
    const res = await getClasses();
    setClasses(res.data);
  };

  const fetchSummaryData = async (classId = null) => {
    const res = await getSummary(classId);
    setSummary(res.data);
  };

  useEffect(() => {
    fetchStudentsData();
    fetchClassesData();
    fetchSummaryData(); // ALL
  }, []);

  // ================= CLASS FILTER =================

  const handleClassChange = async (value) => {
    setSelectedClass(value);

    if (value === "ALL") {
      fetchStudentsData();
      fetchSummaryData();
    } else {
      const res = await getStudentsByClass(value);
      setStudents(res.data);

      fetchSummaryData(value);
    }
  };

  // ================= MODALS =================

  const openAdd = (student) => {
    setSelectedStudent(student);
    setFeeItems([{ title: "", description: "", amount: "" }]);
    setIsEditMode(false);
    setShowFeeModal(true);
  };

  const openEdit = async (student) => {
    setSelectedStudent(student);
    setIsEditMode(true);

    const res = await getHistory(student.studentId);
    const fees = res.data;

    if (fees.length) {
      const latest = fees[fees.length - 1];

      setFeeItems(
        latest.feeItems?.length
          ? latest.feeItems.map(item => ({
              title: item.title || "",
              description: item.description || "",
              amount: item.amount || ""
            }))
          : [{ title: "", description: "", amount: "" }]
      );
    }

    setShowFeeModal(true);
  };

  const openHistory = async (studentId) => {
    const res = await getHistory(studentId);
    setHistory(res.data);
    setShowHistoryModal(true);
  };

  // ================= 🔔 REMINDER =================

  const handleReminder = async (studentId) => {
    try {
      await sendReminder(studentId);
      alert("✅ Reminder sent successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send reminder");
    }
  };

  // ================= SAVE =================

  const saveFeeData = async () => {

    const payload = {
      studentId: selectedStudent.studentId,
      studentName: selectedStudent.studName,
      classNumber: selectedStudent.classNumber,
      feeItems: feeItems.map(i => ({
        title: i.title,
        description: i.description,
        amount: Number(i.amount)
      }))
    };

    await addFee(payload);

    setShowFeeModal(false);
    fetchStudentsData();
    fetchSummaryData(selectedClass === "ALL" ? null : selectedClass);
  };

  return (
    <div className="p-4 md:p-6">

      <h2 className="text-xl md:text-2xl font-bold mb-4">
        💰 Student Fees Dashboard
      </h2>

      {/* CLASS FILTER */}
      <select
        value={selectedClass}
        onChange={(e) => handleClassChange(e.target.value)}
        className="border p-2 rounded mb-4"
      >
        <option value="ALL">All Classes</option>
        {classes.map(c => (
          <option key={c.id} value={c.id}>
            {c.className}
          </option>
        ))}
      </select>

      {/* SUMMARY */}
      <SummaryCards summary={summary} />

      {/* MOBILE */}
      <FeeCardMobile
        students={students}
        classMap={classMap}
        onAdd={openAdd}
        onEdit={openEdit}
        onHistory={openHistory}
        onReminder={handleReminder}   // ✅ FIX
      />

      {/* DESKTOP */}
      <FeeTable
        students={students}
        classMap={classMap}
        onAdd={openAdd}
        onEdit={openEdit}
        onHistory={openHistory}
        onReminder={handleReminder}   // ✅ FIX
      />

      {/* MODALS */}
      <FeeModal
        show={showFeeModal}
        onClose={() => setShowFeeModal(false)}
        feeItems={feeItems}
        setFeeItems={setFeeItems}
        onSave={saveFeeData}
        isEditMode={isEditMode}
      />

      <HistoryModal
        show={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        history={history}
      />

    </div>
  );
}