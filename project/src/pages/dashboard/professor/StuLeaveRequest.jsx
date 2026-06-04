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
  const [myLeaves, setMyLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaveTypes, setLeaveTypes] =
  useState([]);
  const [showRejectModal, setShowRejectModal] =
  useState(false);
  const [selectedLeaveId, setSelectedLeaveId] =
  useState(null);
  const [rejectReason, setRejectReason] =useState("");
  const [showLeaveModal, setShowLeaveModal] =
  useState(false);

  

  // ✅ PROFESSOR DATA
  const professor = JSON.parse(
    localStorage.getItem("professorData")
  );

  const teacherId = professor?.id;

  const [teacherLeaveData, setTeacherLeaveData] =
  useState({

  senderType: "TEACHER",

  senderId: teacherId,

  sendTo: "HOD",

  reason: "",

  fromDate: "",

  toDate: "",

  leaveType: "CASUAL"
 
  });

  // ================= LOAD =================

  useEffect(() => {
  if (teacherId) {

    fetchLeaves();

    fetchMyLeaves();

    fetchLeaveTypes();
  }
  }, [teacherId]);

  // ================= FETCH LEAVES =================
  const fetchLeaves = async () => {

    try {

    setLoading(true);
    const schoolId =
    professor?.school?.id;
    const res = await axios.get(
     `http://localhost:8080/api/leave/teacher/${teacherId}/${schoolId}`
    );
    setLeaves(res.data || []);

    } catch (err) {

      console.log(err);
      setLeaves([]);

    } finally {

      setLoading(false);
    }
  };








  // ================= MY LEAVES =================

  const fetchMyLeaves = async () => {

  try {

    const res = await axios.get(

      `http://localhost:8080/api/leave/my/${teacherId}/TEACHER`

    );

    setMyLeaves(res.data || []);

  } catch (err) {

    console.log(err);
  }
  };




  // ================= LEAVE TYPES =================

  const fetchLeaveTypes = async () => {

  try {

    const res = await axios.get(
      "http://localhost:8080/api/leave/types"
    );

    setLeaveTypes(res.data || []);

  } catch (err) {

    console.log(err);
  }
  };

  // ================= UPDATE STATUS =================
  // ================= APPROVE =================

  const approveLeave = async (id) => {

  try {

    await axios.put(
      `http://localhost:8080/api/leave/approve/${id}/${teacherId}/TEACHER`,
      {},
      {
        params: {
          responseMessage: ""
        }
      }
    );

    alert("✅ Leave Approved");

    fetchLeaves();

  } catch (err) {

    console.log(err);

    alert("❌ Something went wrong");
  }
};

// ================= OPEN REJECT MODAL =================

const openRejectModal = (id) => {

  setSelectedLeaveId(id);

  setShowRejectModal(true);
};

// ================= FINAL REJECT =================

const rejectLeave = async () => {

  try {

    if (!rejectReason) {

      alert("Enter reject reason");

      return;
    }

    await axios.put(

      `http://localhost:8080/api/leave/reject/${selectedLeaveId}/${teacherId}/TEACHER`,

      {},

      {
        params: {

          responseMessage: rejectReason

        }
      }

    );

    alert("❌ Leave Rejected");

    setShowRejectModal(false);

    setRejectReason("");

    fetchLeaves();

  } catch (err) {

    console.log(err);

    alert("❌ Something went wrong");
  }
  };






  const applyTeacherLeave = async () => {

  try {

    await axios.post(

      "http://localhost:8080/api/leave/apply",

      teacherLeaveData

    );

    alert("✅ Leave Applied");

    setShowLeaveModal(false);

    setTeacherLeaveData({

      senderType: "TEACHER",

      senderId: teacherId,

      sendTo: "HOD",

      reason: "",

      fromDate: "",

      toDate: "",

      leaveType: "CASUAL"

    });

  } catch (err) {

    console.log(err);

    alert("❌ Failed");
  }
  };

  return (

    <div className="min-h-screen p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-8"> <div>
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

  <Button
    color="blue"
    className="rounded-xl"
    onClick={() =>
      setShowLeaveModal(true)
    }
  >
    Apply My Leave
  </Button>

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
               leave.student?.profileImage
                ? `http://localhost:8080/api/students/image/get/${leave.student.id}`
                : `https://ui-avatars.com/api/?name=${leave.student?.studfirstName}`
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
               `https://ui-avatars.com/api/?name=${leave.student?.studfirstName}`;

               }}
               />
                  {/* STUDENT INFO */}
                  <div>
                    <Typography
                    variant="h5"
                    className="text-white font-bold"
                    >
                    {leave.student?.studfirstName}
                    {" "}
                    {leave.student?.studlastName}
                    </Typography>
                    <Typography className="text-blue-100 text-sm">
                      🎓 Class :
                      {" "}
                     {leave.className}

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
                      approveLeave(leave.id)
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
                     openRejectModal(leave.id)
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




      {/* ================= REJECT MODAL ================= */}

     {showRejectModal && (

    <div className="
    fixed inset-0
    bg-black/40
    flex justify-center items-center
    z-50
    ">

  <div className="
  bg-white
  rounded-2xl
  p-6
  w-[400px]
  shadow-2xl
  ">

    <h2 className="
    text-xl
    font-bold
    mb-4
    ">
      Reject Leave
    </h2>

    <textarea
      value={rejectReason}
      onChange={(e) =>
        setRejectReason(e.target.value)
      }
      placeholder="Enter reject reason..."
      className="
      w-full
      border
      rounded-xl
      p-3
      h-32
      outline-none
      "
    />

    <div className="
    flex justify-end gap-3 mt-5
    ">

      <button
        onClick={() =>
          setShowRejectModal(false)
        }
        className="
        px-5 py-2
        rounded-xl
        border
        "
      >
        Cancel
      </button>

      <button
        onClick={rejectLeave}
        className="
        px-5 py-2
        rounded-xl
        bg-red-600
        text-white
        "
      >
        Reject
      </button>

    </div>

  </div>

  </div>
  )}


  {/* ================= TEACHER LEAVE MODAL ================= */}

  {showLeaveModal && (

  <div className="
  fixed inset-0
  bg-black/40
  flex justify-center items-center
  z-50
  ">

  <div className="
  bg-white
  rounded-3xl
  p-6
  w-[450px]
  shadow-2xl
  ">
    <h2 className="
    text-2xl
    font-bold
    mb-5
    ">
      Apply Leave
    </h2>

    <select

value={teacherLeaveData.sendTo}

onChange={(e) =>

setTeacherLeaveData({

...teacherLeaveData,

sendTo: e.target.value

})

}

className="
w-full border
p-3 rounded-xl
mb-4
"
>

<option value="HOD">
HOD
</option>

<option value="ADMIN">
School Admin
</option>

</select>

    <select

      value={teacherLeaveData.leaveType}

      onChange={(e) =>

        setTeacherLeaveData({

          ...teacherLeaveData,

          leaveType: e.target.value

        })

      }

      className="
      w-full border
      p-3 rounded-xl
      mb-4
      "
    >
    {leaveTypes.map((type) => (

     <option
     key={type}
     value={type}
    >

    {type.replaceAll("_", " ")}

    </option>

    ))}
    </select>

    <textarea

      placeholder="Enter reason"

      value={teacherLeaveData.reason}

      onChange={(e) =>

        setTeacherLeaveData({

          ...teacherLeaveData,

          reason: e.target.value

        })

      }

      className="
      w-full border
      p-3 rounded-xl
      h-28 mb-4
      "
    />

    <div className="grid grid-cols-2 gap-3 mb-5">

      <input
        type="date"

        value={teacherLeaveData.fromDate}

        onChange={(e) =>

          setTeacherLeaveData({

            ...teacherLeaveData,

            fromDate: e.target.value

          })

        }

        className="
        border p-3 rounded-xl
        "
      />

      <input
        type="date"

        value={teacherLeaveData.toDate}

        onChange={(e) =>

          setTeacherLeaveData({

            ...teacherLeaveData,

            toDate: e.target.value

          })

        }

        className="
        border p-3 rounded-xl
        "
      />

    </div>

    <div className="
    flex justify-end gap-3
    ">

      <button

        onClick={() =>
          setShowLeaveModal(false)
        }

        className="
        px-5 py-2
        border rounded-xl
        "
      >
        Cancel
      </button>

      <button

        onClick={applyTeacherLeave}

        className="
        px-5 py-2
        bg-blue-600
        text-white
        rounded-xl
        "
      >
        Apply
      </button>

    </div>
  </div>

 </div>
 )}



{/* ================= MY LEAVES ================= */}

<div className="mt-12">

  <Typography
    variant="h4"
    className="font-bold mb-6"
  >
    📄 My Leave Requests
  </Typography>

  <div className="
  grid md:grid-cols-2
  xl:grid-cols-3
  gap-6
  ">

    {myLeaves.map((leave) => (

      <Card
        key={leave.id}
        className="rounded-3xl shadow-lg"
      >

        <CardBody>

          <Typography
            variant="h5"
            className="mb-3"
          >
            {leave.leaveType}
          </Typography>

          <Typography color="gray">
            {leave.reason}
          </Typography>

          <Typography
            className="mt-3"
          >
            📅 {leave.fromDate}
            {" "}→{" "}
            {leave.toDate}
          </Typography>

          <Typography
            className="mt-3"
          >
            📨 Sent To :
            {" "}
            {leave.sendTo}
          </Typography>

          <div className="mt-4">

            {leave.status === "PENDING" && (
              <span className="
              bg-yellow-100
              text-yellow-700
              px-3 py-1
              rounded-full
              text-sm
              ">
                Pending
              </span>
            )}

            {leave.status === "APPROVED" && (
              <span className="
              bg-green-100
              text-green-700
              px-3 py-1
              rounded-full
              text-sm
              ">
                Approved
              </span>
            )}

            {leave.status === "REJECTED" && (
              <span className="
              bg-red-100
              text-red-700
              px-3 py-1
              rounded-full
              text-sm
              ">
                Rejected
              </span>
            )}

          </div>

          {leave.responseMessage && (

            <div className="
            mt-4
            bg-gray-50
            p-3
            rounded-xl
            ">

              <Typography
                variant="small"
                className="font-bold"
              >
                Response
              </Typography>

              <Typography
                color="gray"
              >
                {leave.responseMessage}
              </Typography>

            </div>
          )}

        </CardBody>

      </Card>
    ))}

  </div>

</div>



  </div>
  );
};

export default StuLeaveRequest;