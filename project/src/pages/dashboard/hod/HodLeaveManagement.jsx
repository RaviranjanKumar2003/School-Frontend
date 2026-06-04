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

const HodLeaveManagement = () => {

  // =====================================================
  // STATES
  // =====================================================

  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState("ALL");

  const [teachers, setTeachers] = useState([]);
  const [myLeaves, setMyLeaves] = useState([]);

  // REJECT MODAL

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [leaveTypes, setLeaveTypes] = useState([]);
  const [leaveData, setLeaveData] = useState({
  senderType: "HOD",
  senderId: null,
  sendTo: "ADMIN",
  reason: "",
  fromDate: "",
  toDate: "",
  leaveType: "CASUAL",
  });

  // =====================================================
  // HOD DATA
  // =====================================================

  const hodData = JSON.parse(
    localStorage.getItem("hodData")
  );

  const hodId = hodData?.id;
  useEffect(() => {

  if (hodId) {

  setLeaveData((prev) => ({
   ...prev,
   senderId: hodId,

   }));
   }

  }, [hodId]);

  const schoolId =
  hodData?.school?.id;

  // =====================================================
  // LOAD LEAVES
  // =====================================================

  useEffect(() => {

    if (schoolId) {
      fetchLeaves();
      fetchTeachers();
      fetchLeaveTypes();
      fetchMyLeaves();
    }

  }, [schoolId]);

  // =====================================================
  // FETCH
  // =====================================================

  const fetchLeaves = async () => {

    try {

      setLoading(true);

      const res = await axios.get(

        `http://localhost:8080/api/leave/hod/${schoolId}`

      );

      setLeaves(res.data || []);

    } catch (err) {

      console.log(err);

      setLeaves([]);

    } finally {

      setLoading(false);
    }
  };









   // =====================================================
   // FETCH TEACHERS
   // =====================================================

   const fetchTeachers = async () => {

   try {

    const res = await axios.get(
      `http://localhost:8080/api/professors/by-school/${schoolId}`
    );

    setTeachers(res.data || []);

    } catch (err) {

    console.log(err);
    }
    };


   // =====================================================
   // GET TEACHER NAME
   // =====================================================

  const getTeacherName = (id) => {

  const teacher = teachers.find(
    (t) => t.id === id
  );

  return teacher
    ? teacher.name
    : "Teacher";
  };







    // =====================================================
    // FETCH LEAVE TYPES
    // =====================================================

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










   // =====================================================
   // MY LEAVES
   // =====================================================
   const fetchMyLeaves = async () => {
   try {
    const res = await axios.get(
    `http://localhost:8080/api/leave/my/${hodId}/HOD`
    );

    setMyLeaves(res.data || []);

    } catch (err) {

    console.log(err);
    }
    };






  // =====================================================
  // APPROVE
  // =====================================================

  const approveLeave = async (leaveId) => {

    try {

      await axios.put(

        `http://localhost:8080/api/leave/approve/${leaveId}/${hodId}/HOD`,

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

      alert("❌ Failed");
    }
  };

  // =====================================================
  // OPEN REJECT MODAL
  // =====================================================

  const openRejectModal = (leaveId) => {

    setSelectedLeaveId(leaveId);

    setShowRejectModal(true);
  };

  // =====================================================
  // FINAL REJECT
  // =====================================================

  const rejectLeave = async () => {

    try {

      if (!rejectReason) {

        return alert(
          "Enter reject reason"
        );
      }

      await axios.put(

        `http://localhost:8080/api/leave/reject/${selectedLeaveId}/${hodId}/HOD`,

        {},

        {
          params: {

            responseMessage:
            rejectReason
          }
        }
      );

      alert("❌ Leave Rejected");

      setShowRejectModal(false);

      setRejectReason("");

      fetchLeaves();

    } catch (err) {

      console.log(err);

      alert("❌ Failed");
    }
  };







   // =====================================================
   // APPLY LEAVE
   // =====================================================

   const applyLeave = async () => {

   try {

   await axios.post(

    "http://localhost:8080/api/leave/apply",

    leaveData

    );

    alert("✅ Leave Applied");

    setShowApplyModal(false);

    setLeaveData({

    senderType: "HOD",

   senderId: hodId,

   sendTo: "ADMIN",

   reason: "",

  fromDate: "",

  toDate: "",

  leaveType: "CASUAL",

  });

  fetchLeaves();
  fetchMyLeaves();

  } catch (err) {

  console.log(err);

  alert("❌ Failed");
  }
  };







  // =====================================================
  // FILTER
  // =====================================================

  const filteredLeaves =
  activeTab === "ALL"

  ? leaves

  : leaves.filter(

      (l) =>
      l.status === activeTab
    );

  // =====================================================
  // STATUS COLOR
  // =====================================================

  const getStatusColor = (status) => {

    if (status === "APPROVED") {

      return `
      bg-green-100
      text-green-700
      `;
    }

    if (status === "REJECTED") {

      return `
      bg-red-100
      text-red-700
      `;
    }

    return `
    bg-yellow-100
    text-yellow-700
    `;
  };

  // =====================================================
  // RETURN
  // =====================================================

    return (

    <div className="
    min-h-screen
    p-6
    bg-gradient-to-br
    from-blue-50
    via-indigo-50
    to-purple-100
    ">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="
      flex flex-col
      md:flex-row
      md:items-center
      md:justify-between
      gap-4
      mb-8
      ">

        <div>

          <Typography
            variant="h3"
            className="
            font-bold
            text-blue-gray-900
            "
          >
            🏢 HOD Leave Management
          </Typography>

          <Typography
            color="gray"
            className="mt-2"
          >
            Manage students and teachers
            leave requests professionally
          </Typography>

        </div>

        <Button

        onClick={() =>
        setShowApplyModal(true)
        }

        className="
        rounded-xl
       bg-indigo-600">
        + Apply Leave
       </Button>

        {/* FILTERS */}

        <div className="
        flex gap-3
        flex-wrap
        ">

          {[
            "ALL",
            "PENDING",
            "APPROVED",
            "REJECTED"
          ].map((tab) => (

            <Button
              key={tab}

              size="sm"

              onClick={() =>
                setActiveTab(tab)
              }

              className={`
              rounded-full

              ${
                activeTab === tab

                ? "bg-blue-600"

                : "bg-white text-black"
              }
              `}
            >
              {tab}
            </Button>

          ))}

        </div>

      </div>

      {/* ================================================= */}
      {/* LOADING */}
      {/* ================================================= */}

      {loading && (

        <div className="
        flex justify-center
        items-center
        h-[300px]
        ">

          <Spinner
            className="
            h-14 w-14
            text-blue-600
            "
          />

        </div>
      )}

      {/* ================================================= */}
      {/* EMPTY */}
      {/* ================================================= */}

      {!loading &&
      filteredLeaves.length === 0 && (

        <Card className="
        rounded-3xl
        shadow-lg
        ">

          <CardBody className="
          py-20 text-center
          ">

            <Typography
              variant="h4"
            >
              No Leave Requests
            </Typography>

            <Typography
              color="gray"
              className="mt-2"
            >
              Leave requests will appear here
            </Typography>

          </CardBody>

        </Card>
      )}

      {/* ================================================= */}
      {/* LEAVE CARDS */}
      {/* ================================================= */}

      {!loading &&
      filteredLeaves.length > 0 && (

        <div className="
        grid
        md:grid-cols-2
        xl:grid-cols-3
        gap-7
        ">

          {filteredLeaves.map((leave) => (

            <Card
              key={leave.id}
              className="
              rounded-3xl
              shadow-lg
              hover:shadow-2xl
              hover:-translate-y-2
              transition-all
              duration-300
              overflow-hidden
              "
            >

              {/* TOP */}

              <div className="
              bg-gradient-to-r
              from-indigo-600
              to-blue-600
              p-5
              ">

                <div className="
                flex items-center
                gap-4
                ">

                  {/* IMAGE */}

                  <img
                    src={
                      leave.student?.profileImage

                      ? `http://localhost:8080/api/students/image/get/${leave.student.id}`

                      : `https://ui-avatars.com/api/?name=${leave.student?.studfirstName || leave.senderType}`
                    }

                    alt="profile"

                    className="
                    w-16 h-16
                    rounded-full
                    object-cover
                    border-4 border-white
                    "
                  />

                  {/* INFO */}

                  <div>

                  <div className="flex items-center gap-2">

<span className="
bg-white/20
text-white
text-xs
px-2 py-1
rounded-full
font-semibold
">

{
leave.senderType === "TEACHER"
? "👨‍🏫 TEACHER"
: "👨‍🎓 STUDENT"
}

</span>

</div>

<Typography
variant="h5"
className="
text-white
font-bold
mt-2
"
>

{
leave.senderType === "TEACHER"

? getTeacherName(
leave.senderId
)

: `${leave.student?.studfirstName || ""}
   ${leave.student?.studlastName || ""}`
}

</Typography>

                    <Typography
                      className="
                      text-blue-100
                      text-sm
                      "
                    >

                        {
leave.senderType === "STUDENT" && (

<Typography
className="
text-blue-100
text-sm
"
>
Class :{leave.className ||leave.student?.section || "-"}
</Typography>

)
}

                    </Typography>

                  </div>

                </div>

              </div>

              {/* BODY */}

              <CardBody>

                {/* TYPE */}

                <div className="mb-4">

                  <Typography
                    variant="small"
                    className="
                    font-bold
                    uppercase
                    "
                  >
                    Leave Type
                  </Typography>

                  <Typography
                    color="blue"
                    className="mt-1"
                  >
                    {leave.leaveType}
                  </Typography>

                </div>

                {/* REASON */}

                <div className="mb-4">

                  <Typography
                    variant="small"
                    className="
                    font-bold
                    uppercase
                    "
                  >
                    Reason
                  </Typography>

                  <Typography
                    color="gray"
                    className="mt-1"
                  >
                    {leave.reason}
                  </Typography>

                </div>

                {/* DATES */}

                <div className="
                grid grid-cols-2
                gap-3 mb-5
                ">

                  <div className="
                  bg-blue-50
                  rounded-2xl
                  p-4
                  ">

                    <Typography
                      variant="small"
                      color="gray"
                    >
                      From
                    </Typography>

                    <Typography
                      className="
                      font-semibold
                      mt-1
                      "
                    >
                      {leave.fromDate}
                    </Typography>

                  </div>

                  <div className="
                  bg-purple-50
                  rounded-2xl
                  p-4
                  ">

                    <Typography
                      variant="small"
                      color="gray"
                    >
                      To
                    </Typography>

                    <Typography
                      className="
                      font-semibold
                      mt-1
                      "
                    >
                      {leave.toDate}
                    </Typography>

                  </div>

                </div>

                {/* STATUS */}

                <div className="mb-5">

                  <span className={`
                  px-4 py-2
                  rounded-full
                  text-sm font-bold

                  ${getStatusColor(
                    leave.status
                  )}
                  `}>

                    {leave.status ===
                    "PENDING"

                    && "⏳ Pending"}

                    {leave.status ===
                    "APPROVED"

                    && "✅ Approved"}

                    {leave.status ===
                    "REJECTED"

                    && "❌ Rejected"}

                  </span>

                </div>

                {/* RESPONSE */}

                {leave.responseMessage && (

                  <div className="
                  bg-gray-50
                  rounded-2xl
                  p-4 mb-5
                  ">

                    <Typography
                      variant="small"
                      className="
                      font-bold
                      "
                    >
                      Response Message
                    </Typography>

                    <Typography
                      color="gray"
                      className="mt-1"
                    >
                      {leave.responseMessage}
                    </Typography>

                  </div>
                )}

                {/* ACTIONS */}

                {leave.status ===
                "PENDING" && (

                  <div className="
                  flex gap-3
                  ">

                    <Button

                      color="green"

                      fullWidth

                      className="
                      rounded-xl
                      "

                      onClick={() =>
                        approveLeave(
                          leave.id
                        )
                      }
                    >
                      Approve
                    </Button>

                    <Button

                      color="red"

                      fullWidth

                      className="
                      rounded-xl
                      "

                      onClick={() =>
                        openRejectModal(
                          leave.id
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






         {/* ================================================= */}
{/* MY LEAVES */}
{/* ================================================= */}

<div className="mt-16">

<Typography
variant="h4"
className="
font-bold
mb-6
text-blue-gray-900
"
>
📄 My Leave Requests
</Typography>

<div className="
grid
md:grid-cols-2
xl:grid-cols-3
gap-6
">

{myLeaves.map((leave) => (

<Card
key={leave.id}
className="
rounded-3xl
shadow-lg
"
>

<CardBody>

<Typography
variant="h6"
className="font-bold"
>

{leave.leaveType}

</Typography>

<Typography
color="gray"
className="mt-2"
>

{leave.reason}

</Typography>

<div className="
flex justify-between
mt-5
text-sm
">

<span>
{leave.fromDate}
</span>

<span>
{leave.toDate}
</span>

</div>

<div className="mt-5">

<span className={`
px-4 py-2
rounded-full
text-sm font-bold

${getStatusColor(
leave.status
)}
`}>

{leave.status}

</span>

</div>

{leave.responseMessage && (

<div className="
bg-gray-50
rounded-xl
p-3 mt-5
">

<Typography
variant="small"
className="font-bold"
>

Response

</Typography>

<Typography
color="gray"
className="mt-1"
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





      {/* ================================================= */}
      {/* REJECT MODAL */}
      {/* ================================================= */}

      {showRejectModal && (

        <div className="
        fixed inset-0
        bg-black/40
        flex justify-center
        items-center
        z-50
        ">

          <div className="
          bg-white
          rounded-3xl
          p-6
          w-[420px]
          shadow-2xl
          ">

            <Typography
              variant="h4"
              className="
              font-bold
              mb-5
              "
            >
              Reject Leave
            </Typography>

            <textarea

              value={rejectReason}

              onChange={(e) =>
                setRejectReason(
                  e.target.value
                )
              }

              placeholder="
              Enter reject reason...
              "

              className="
              w-full
              border
              rounded-2xl
              p-4
              h-36
              outline-none
              "
            />

            <div className="
            flex justify-end
            gap-3 mt-5
            ">

              <Button

                variant="outlined"

                onClick={() =>
                  setShowRejectModal(
                    false
                  )
                }
              >
                Cancel
              </Button>

              <Button
                color="red"

                onClick={rejectLeave}
              >
                Reject
              </Button>

            </div>

          </div>

        </div>
      )}





      {/* ================================================= */}
{/* APPLY LEAVE MODAL */}
{/* ================================================= */}

{showApplyModal && (

<div className="
fixed inset-0
bg-black/40
flex justify-center
items-center
z-50
">

<div className="
bg-white
rounded-3xl
p-6
w-[420px]
shadow-2xl
">

<Typography
variant="h4"
className="
font-bold
mb-5
"
>
Apply Leave
</Typography>

<div className="space-y-4">

<select

value={leaveData.leaveType}

onChange={(e) =>
setLeaveData({
...leaveData,
leaveType: e.target.value
})
}

className="
w-full
border
rounded-xl
p-3
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

placeholder="Reason"

value={leaveData.reason}

onChange={(e) =>
setLeaveData({
...leaveData,
reason: e.target.value
})
}

className="
w-full
border
rounded-xl
p-3
h-28
"
/>

<input

type="date"

value={leaveData.fromDate}

onChange={(e) =>
setLeaveData({
...leaveData,
fromDate: e.target.value
})
}

className="
w-full
border
rounded-xl
p-3
"
/>

<input

type="date"

value={leaveData.toDate}

onChange={(e) =>
setLeaveData({
...leaveData,
toDate: e.target.value
})
}

className="
w-full
border
rounded-xl
p-3
"
/>

<div className="
flex justify-end
gap-3
">

<Button
variant="outlined"

onClick={() =>
setShowApplyModal(false)
}
>
Cancel
</Button>

<Button
color="blue"

onClick={applyLeave}
>
Apply
</Button>

</div>

</div>

</div>

</div>

)}

    </div>
  );
};

export default HodLeaveManagement;