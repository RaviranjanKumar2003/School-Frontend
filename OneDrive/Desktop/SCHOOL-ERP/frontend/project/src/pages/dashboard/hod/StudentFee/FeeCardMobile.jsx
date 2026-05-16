export default function FeeCardMobile({
  students,
  classMap,
  onAdd,
  onEdit,
  onHistory,
  onReminder
}) {

  const getStatusUI = (fee) => {
    if (!fee) return "⚪ Not Assigned";
    if (fee.status === "PAID") return "✅ Paid";
    if (fee.status === "PENDING") return "❌ Pending";
    return "⚪ Not Assigned";
  };

  const getStatusColor = (fee) => {
    if (!fee) return "text-gray-500";
    if (fee.status === "PAID") return "text-green-600 font-semibold";
    if (fee.status === "PENDING") return "text-red-600 font-semibold";
    return "text-gray-500 font-semibold";
  };

  return (
    <div className="md:hidden space-y-4">

      {students.map(s => {

        const fee = s.fee;
        const status = fee?.status;
        const pending = fee?.pendingAmount || 0;

        return (
          <div
            key={s.studentId}
            className="bg-white p-4 rounded-xl shadow border"
          >

            {/* 👤 STUDENT INFO */}
            <p className="text-lg font-bold">
              {s.studName} {s.studLastName}
            </p>

            <p className="text-sm text-gray-600 mb-2">
              Class: {classMap[s.classNumber] || "N/A"}
            </p>

            {/* 💰 FEE INFO */}
            <div className="grid grid-cols-3 gap-2 text-center text-sm mb-2">

              <div className="bg-blue-100 p-2 rounded">
                <p>Total</p>
                <p className="font-bold">₹{fee?.totalFee ?? 0}</p>
              </div>

              <div className="bg-green-100 p-2 rounded">
                <p>Paid</p>
                <p className="font-bold">₹{fee?.paidAmount ?? 0}</p>
              </div>

              <div className="bg-red-100 p-2 rounded">
                <p>Pending</p>
                <p className="font-bold">₹{pending}</p>
              </div>

            </div>

            {/* 📊 STATUS */}
            <p className={`mb-3 ${getStatusColor(fee)}`}>
              {getStatusUI(fee)}
            </p>

            {/* 🎯 ACTION BUTTONS */}
            <div className="flex flex-wrap gap-2">

              {/* 🔵 NOT ASSIGNED */}
              {(!fee || status === "NOT_ASSIGNED") && (
                <>
                  <button
                    onClick={() => onAdd?.(s)}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Add Fee
                  </button>

                  <button
                    onClick={() => onHistory?.(s.studentId)}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                  >
                    History
                  </button>
                </>
              )}

              {/* 🔴 PENDING */}
              {status === "PENDING" && pending > 0 && (
                <>
                  <button
                    onClick={() => onEdit?.(s)}
                    className="bg-orange-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onHistory?.(s.studentId)}
                    className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                  >
                    History
                  </button>

                  {/* 🔥 SAFE CALL */}
                  <button
                    onClick={() => onReminder?.(s.studentId)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Reminder
                  </button>
                </>
              )}

              {/* 🟢 PAID */}
              {status === "PAID" && (
                <button
                  onClick={() => onHistory?.(s.studentId)}
                  className="bg-purple-500 text-white px-3 py-1 rounded text-sm"
                >
                  View History
                </button>
              )}

            </div>

          </div>
        );
      })}

    </div>
  );
}