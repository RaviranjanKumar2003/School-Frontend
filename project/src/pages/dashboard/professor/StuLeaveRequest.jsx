import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Spinner,
} from "@material-tailwind/react";

import {
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
} from "@heroicons/react/24/solid";

const StuLeaveRequest = () => {

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ PROFESSOR DATA
  const professor = JSON.parse(
    localStorage.getItem("professorData")
  );

  const teacherId = professor?.id;

  // ================= LOAD =================
  useEffect(() => {

    if (teacherId) {
      fetchLeaves();
    }

  }, [teacherId]);

  // ================= FETCH LEAVES =================
  const fetchLeaves = async () => {

    try {

      setLoading(true);

      console.log("Teacher ID =", teacherId);

      const res = await axios.get(
        `http://localhost:8080/api/leave/teacher/${teacherId}`
      );

      console.log("Leaves =", res.data);

      setLeaves(res.data || []);

    } catch (err) {

      console.log(err);
      setLeaves([]);

    } finally {

      setLoading(false);
    }
  };

  // ================= UPDATE STATUS =================
  const updateStatus = async (id, type) => {

    try {

      await axios.put(
        `http://localhost:8080/api/leave/${type}/${id}`
      );

      alert(
        type === "approve"
          ? "✅ Leave Approved"
          : "❌ Leave Rejected"
      );

      fetchLeaves();

    } catch (err) {

      console.log(err);
      alert("❌ Something went wrong");
    }
  };

  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">

      {/* ================= HEADER ================= */}
      <div className="mb-8">

        <Typography
          variant="h3"
          color="blue-gray"
          className="font-bold"
        >
          📩 Student Leave Requests
        </Typography>

        <Typography
          color="gray"
          className="mt-2"
        >
          Manage students leave requests professionally
        </Typography>

      </div>

      {/* ================= LOADING ================= */}
      {loading && (

        <div className="flex justify-center items-center h-[400px]">

          <Spinner className="h-14 w-14 text-blue-600" />

        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && leaves.length === 0 && (

        <Card className="shadow-xl rounded-3xl border border-blue-gray-50">

          <CardBody className="py-24 text-center">

            <Typography
              variant="h4"
              color="blue-gray"
            >
              No Leave Requests
            </Typography>

            <Typography
              color="gray"
              className="mt-2"
            >
              Students leave requests will appear here
            </Typography>

          </CardBody>
        </Card>
      )}

      {/* ================= LEAVES ================= */}
      {!loading && leaves.length > 0 && (

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

          {leaves.map((leave) => (

            <Card
              key={leave.id}
              className="
              rounded-3xl
              shadow-lg
              border border-gray-100
              hover:shadow-2xl
              hover:-translate-y-2
              hover:scale-[1.02]
              transition-all
              duration-300
              overflow-hidden
              bg-white
              "
            >

              {/* TOP SECTION */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5">

                <div className="flex items-center gap-4">

                  {/* IMAGE */}
                 <img
  src={
    leave.student?.imageUrl
      ? `http://localhost:8080/api/students/image/get/${leave.student.id}`
      : `https://ui-avatars.com/api/?name=${leave.student?.studName}`
  }
  alt="student"
  className="
  w-16 h-16
  rounded-full
  object-cover
  border-4 border-white
  shadow-md
  "
  onError={(e) => {
    e.target.src =
      `https://ui-avatars.com/api/?name=${leave.student?.studName}`;
  }}
/>
                  {/* STUDENT INFO */}
                  <div>

                    <Typography
                      variant="h5"
                      className="text-white font-bold"
                    >
                     {leave.student?.studName} {leave.student?.studLastName}
                    </Typography>

                    <Typography className="text-blue-100 text-sm">

                      🎓 Class :
                      {" "}
                      {leave.student?.className || "-"}

                    </Typography>

                    <Typography className="text-blue-100 text-sm">

                      📧 {leave.student?.email || "-"}

                    </Typography>

                  </div>
                </div>
              </div>

              {/* BODY */}
              <CardBody>

                {/* REASON */}
                <div className="mb-5">

                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-bold uppercase"
                  >
                    Reason
                  </Typography>

                  <Typography
                    color="gray"
                    className="mt-1 leading-relaxed"
                  >
                    {leave.reason}
                  </Typography>

                </div>

                {/* DATE SECTION */}
                <div className="grid grid-cols-2 gap-3 mb-5">

                  <div className="bg-blue-50 rounded-2xl p-4">

                    <Typography
                      variant="small"
                      color="gray"
                    >
                      From Date
                    </Typography>

                    <Typography
                      className="font-semibold mt-1"
                    >
                      {leave.fromDate}
                    </Typography>

                  </div>

                  <div className="bg-purple-50 rounded-2xl p-4">

                    <Typography
                      variant="small"
                      color="gray"
                    >
                      To Date
                    </Typography>

                    <Typography
                      className="font-semibold mt-1"
                    >
                      {leave.toDate}
                    </Typography>

                  </div>
                </div>

                {/* STATUS */}
                <div className="mb-6">

                  {leave.status === "PENDING" && (

                    <div className="
                    flex items-center gap-2
                    bg-yellow-100
                    text-yellow-700
                    px-4 py-2
                    rounded-full
                    w-fit
                    text-sm font-semibold
                    ">

                      <ClockIcon className="w-5 h-5" />

                      Pending

                    </div>
                  )}

                  {leave.status === "APPROVED" && (

                    <div className="
                    flex items-center gap-2
                    bg-green-100
                    text-green-700
                    px-4 py-2
                    rounded-full
                    w-fit
                    text-sm font-semibold
                    ">

                      <CheckCircleIcon className="w-5 h-5" />

                      Approved

                    </div>
                  )}

                  {leave.status === "REJECTED" && (

                    <div className="
                    flex items-center gap-2
                    bg-red-100
                    text-red-700
                    px-4 py-2
                    rounded-full
                    w-fit
                    text-sm font-semibold
                    ">

                      <XCircleIcon className="w-5 h-5" />

                      Rejected

                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS */}
                {leave.status === "PENDING" && (

                  <div className="flex gap-3">

                    <Button
                      color="green"
                      fullWidth
                      ripple={true}
                      className="
                      rounded-xl
                      shadow-md
                      hover:shadow-xl
                      hover:scale-105
                      transition-all
                      duration-300
                      "
                      onClick={() =>
                        updateStatus(
                          leave.id,
                          "approve"
                        )
                      }
                    >
                      Approve
                    </Button>

                    <Button
                      color="red"
                      fullWidth
                      ripple={true}
                      className="
                      rounded-xl
                      shadow-md
                      hover:shadow-xl
                      hover:scale-105
                      transition-all
                      duration-300
                      "
                      onClick={() =>
                        updateStatus(
                          leave.id,
                          "reject"
                        )
                      }
                    >
                      Reject
                    </Button>

                  </div>
                )}

              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default StuLeaveRequest;