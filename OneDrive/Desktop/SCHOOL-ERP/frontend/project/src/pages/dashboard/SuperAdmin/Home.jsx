import { useEffect, useState } from "react";

export default function SuperAdminHome() {

  const [adminName, setAdminName] = useState("");

  useEffect(() => {

    const adminData = JSON.parse(
      localStorage.getItem("adminData")
    );

    console.log("ADMIN DATA:", adminData);

    if (adminData) {
      setAdminName(adminData.name);
    }

  }, []);

  return (

    <div className="p-6">

      {/* ================= TITLE ================= */}

      <h1 className="text-3xl font-bold mb-2">
        Super Admin Dashboard
      </h1>

      {/* ================= NAME ================= */}

      <p className="text-gray-600 mb-6 text-lg">
        Welcome, <span className="font-bold">{adminName}</span>
      </p>

      {/* ================= CARDS ================= */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-gray-500">
            Total Schools
          </h2>

          <p className="text-2xl font-bold">
            12
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-gray-500">
            School Admins
          </h2>

          <p className="text-2xl font-bold">
            8
          </p>
        </div>

        <div className="bg-white shadow rounded-xl p-5">
          <h2 className="text-gray-500">
            Total HODs
          </h2>

          <p className="text-2xl font-bold">
            25
          </p>
        </div>

      </div>

    </div>

  );
}