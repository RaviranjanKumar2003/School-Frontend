export default function FeeModal({
  show,
  onClose,
  feeItems,
  setFeeItems,
  onSave,
  isEditMode
}) {

  if (!show) return null;

  const addItem = () => {
    setFeeItems([
      ...feeItems,
      { title: "", description: "", amount: "" } // 🔥 updated
    ]);
  };

  const handleChange = (index, field, value) => {
    const updated = [...feeItems];
    updated[index][field] = value;
    setFeeItems(updated);
  };

  const deleteItem = (index) => {
    if (feeItems.length === 1) return;
    const updated = [...feeItems];
    updated.splice(index, 1);
    setFeeItems(updated);
  };

  const totalAmount = feeItems.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">

      <div className="bg-white p-5 rounded w-[420px]">

        <h2 className="text-lg font-bold mb-3">
          {isEditMode ? "Update Fee" : "Add Fee"}
        </h2>

        {feeItems.map((item, i) => (
            
          <div key={i} className="mb-3 border p-2 rounded">
            
            <input
              placeholder="Title (e.g. Tuition Fee)"
              value={item.title}
              onChange={(e) =>
                handleChange(i, "title", e.target.value)
              }
              className="border p-2 w-full mb-2"
            />

            <input
              placeholder="Description (optional)"
              value={item.description}
              onChange={(e) =>
                handleChange(i, "description", e.target.value)
              }
              className="border p-2 w-full mb-2"
            />

            <div className="flex gap-2">
              <input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) =>
                  handleChange(i, "amount", e.target.value)
                }
                className="border p-2 w-full"
              />

              <button
                onClick={() => deleteItem(i)}
                className="text-red-500"
              >
                🗑
              </button>
            </div>

          </div>
        ))}

        <button
          onClick={addItem}
          className="bg-gray-500 text-white px-3 py-1 rounded mb-3"
        >
          + Add Item
        </button>

        <p className="font-semibold mb-3">
          Total: ₹{totalAmount}
        </p>

        <div className="flex gap-2">

          <button
            onClick={onSave}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            {isEditMode ? "Update" : "Save"}
          </button>

          <button
            onClick={onClose}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
}