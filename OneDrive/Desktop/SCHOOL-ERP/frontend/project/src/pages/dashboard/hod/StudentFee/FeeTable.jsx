export default function FeeTable({
  students,
  classMap,
  onAdd,
  onEdit,
  onHistory,
  onReminder
}) {

  const getStatusBadge = (status) => {
    if (status === "PAID") {
      return (
        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
          ✅ Paid
        </span>
      );
    }

    if (status === "PENDING") {
      return (
        <span className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs">
          ❌ Pending
        </span>
      );
    }

    return (
      <span className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs">
        ⚪ Not Assigned
      </span>
    );
  };

  return (
    <div className="hidden md:block bg-white shadow rounded overflow-x-auto">

      <table className="w-full text-center">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Class</th>
            <th className="p-2">Total</th>
            <th className="p-2">Paid</th>
            <th className="p-2">Pending</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => {

            const fee = s.fee || null;
            const status = fee?.status || "NOT_ASSIGNED";

            const total = fee?.totalFee ?? 0;
            const paid = fee?.paidAmount ?? 0;
            const pending = fee?.pendingAmount ?? 0;

            return (
              <tr key={s.studentId} className="border-b hover:bg-gray-50">

                {/* 👤 NAME */}
                <td className="p-2 font-medium">
                  {s.studName} {s.studLastName}
                </td>

                {/* 🎓 CLASS */}
                <td className="p-2">
                  {classMap[s.classNumber] || "N/A"}
                </td>

                {/* 💰 TOTAL */}
                <td className="p-2 text-blue-600 font-semibold">
                  ₹{total}
                </td>

                {/* 💵 PAID */}
                <td className="p-2 text-green-600 font-semibold">
                  ₹{paid}
                </td>

                {/* ⚠️ PENDING */}
                <td className="p-2 text-red-500 font-semibold">
                  ₹{pending}
                </td>

                {/* 📊 STATUS */}
                <td className="p-2">
                  {getStatusBadge(status)}
                </td>

                {/* 🎯 ACTIONS */}
                <td className="p-2">
                  <div className="flex gap-2 justify-center flex-wrap">

                    {/* 🔵 NOT ASSIGNED */}
                    {status === "NOT_ASSIGNED" && (
                      <>
                        <button
                          onClick={() => onAdd(s)}
                          className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Add Fee
                        </button>

                        <button
                          onClick={() => onHistory(s.studentId)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-sm"
                        >
                          History
                        </button>
                      </>
                    )}

                    {/* 🔴 PENDING */}
                    {status === "PENDING" && pending > 0 && (
                      <>
                        <button
                          onClick={() => onEdit(s)}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-2 py-1 rounded text-sm"
                        >
                          Edit Fee
                        </button>

                        <button
                          onClick={() => onHistory(s.studentId)}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-sm"
                        >
                          History
                        </button>

                        <button
                          onClick={() => onReminder?.(s.studentId)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-sm"
                        >
                          🔔 Reminder
                        </button>
                      </>
                    )}

                    {/* 🟢 PAID */}
                    {status === "PAID" && (
                      <button
                        onClick={() => onHistory(s.studentId)}
                        className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                      >
                        View History
                      </button>
                    )}

                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>

    </div>
  );
}