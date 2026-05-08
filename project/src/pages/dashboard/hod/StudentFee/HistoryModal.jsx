export default function HistoryModal({ show, onClose, history }) {

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div className="bg-white p-5 rounded w-[500px]">

        <h2 className="font-bold mb-3">History</h2>

        {history.map((h, i) => (
  <div
    key={i}
    className="mb-4 p-4 rounded-xl shadow-md border bg-gradient-to-r from-gray-50 to-white"
  >
    {/* HEADER */}
    <div className="flex justify-between items-center mb-2">
      <p className="text-sm text-gray-500">
        📅 {h.paymentDate || "N/A"}
      </p>

      <span
        className={`px-2 py-1 text-xs rounded-full font-semibold
          ${
            h.status === "PAID"
              ? "bg-green-100 text-green-700"
              : h.status === "PENDING"
              ? "bg-red-100 text-red-700"
              : "bg-gray-200 text-gray-700"
          }`}
      >
        {h.status}
      </span>
    </div>

    {/* TOTAL */}
    <div className="flex justify-between mb-2">
      <p className="font-semibold text-gray-700">Total</p>
      <p className="font-bold text-blue-600">₹{h.totalFee}</p>
    </div>

    {/* ITEMS */}
    <div className="mt-2 space-y-2">
      {h.feeItems?.map((item, idx) => (
        <div
          key={idx}
          className="p-2 rounded bg-gray-100 flex justify-between items-center"
        >
          <div>
            <p className="font-medium text-gray-800">
              {item.title || "No Title"}
            </p>
            <p className="text-xs text-gray-500">
              {item.description || ""}
            </p>
          </div>

          <p className="font-semibold text-indigo-600">
            ₹{item.amount}
          </p>
        </div>
      ))}
    </div>

    {/* FOOTER */}
    <div className="flex justify-between mt-3 text-sm">
      <p className="text-green-600">
        Paid: ₹{h.paidAmount || 0}
      </p>
      <p className="text-red-500">
        Pending: ₹{h.pendingAmount || 0}
      </p>
    </div>
  </div>
))}

        <button onClick={onClose} className="bg-red-500 text-white px-3 py-1 rounded">
          Close
        </button>

      </div>
    </div>
  );
}