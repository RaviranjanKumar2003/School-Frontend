export default function SummaryCards({ summary }) {

  // 🔥 SAFE FALLBACK (undefined crash avoid)
  const {
    totalStudents = 0,
    paidStudents = 0,
    pendingStudents = 0,
    totalCollectionAmount = 0,
    totalPendingAmount = 0,
    totalFeeAmount = 0
  } = summary || {};

  return (
    <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">

      {/* 👨‍🎓 TOTAL STUDENTS */}
      <Card
        title="Students"
        value={totalStudents}
        color="bg-blue-500"
      />

      {/* 💰 TOTAL FEE */}
      <Card
        title="Total Fee"
        value={`₹${totalFeeAmount}`}
        color="bg-purple-500"
      />

      {/* ✅ PAID */}
      <Card
        title="Paid"
        value={paidStudents}
        color="bg-green-500"
      />

     <Card
        title="Pending"
        value={`₹${totalPendingAmount}`}
        color="bg-red-500"
     />

      {/* 💵 COLLECTION */}
      <Card
        title="Collection"
        value={`₹${totalCollectionAmount}`}
        color="bg-indigo-500"
      />

      {/* ⚠️ DUES */}
      <Card
        title="Dues"
        value={`₹${totalPendingAmount}`}
        color="bg-yellow-500"
      />

    </div>
  );
}


// 🔥 REUSABLE CARD COMPONENT
const Card = ({ title, value, color }) => (
  <div className={`${color} text-white p-4 rounded text-center shadow`}>

    <p className="text-sm">{title}</p>

    <p className="text-lg md:text-xl font-bold">
      {value ?? 0}
    </p>

  </div>
);