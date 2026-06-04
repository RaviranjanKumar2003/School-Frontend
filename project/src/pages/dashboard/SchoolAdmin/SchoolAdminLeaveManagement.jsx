import React, {
useEffect,
useState,
} from "react";

import axios from "axios";

import {
Card,
CardBody,
Typography,
Button,
Spinner,
} from "@material-tailwind/react";

const SchoolAdminLeaveManagement = () => {

const [leaves, setLeaves] =
useState([]);

const [loading, setLoading] =
useState(false);

const [activeTab, setActiveTab] =
useState("ALL");

const [showRejectModal,
setShowRejectModal] =
useState(false);

const [selectedLeaveId,
setSelectedLeaveId] =
useState(null);

const [rejectReason,
setRejectReason] =
useState("");

const [hods, setHods] =
useState([]);

const [teachers,
setTeachers] =
useState([]);



// =========================================
// ADMIN DATA
// =========================================

const adminData = JSON.parse(
localStorage.getItem(
"schoolAdminData"
)
);

const adminId =
adminData?.id;

const schoolId =
adminData?.schoolId;



// =========================================
// LOAD DATA
// =========================================

useEffect(() => {

if (schoolId) {

fetchLeaves();

fetchTeachers();

fetchHods();

}

}, [schoolId]);



// =========================================
// FETCH LEAVES
// =========================================

const fetchLeaves = async () => {

try {

setLoading(true);

const res = await axios.get(

`http://localhost:8080/api/leave/admin/${schoolId}`

);

setLeaves(res.data || []);

} catch (err) {

console.log(err);

} finally {

setLoading(false);
}
};







const getHod = (id) => {

return hods.find(
(h) => h.id === id
);
};

const getTeacher = (id) => {

return teachers.find(
(t) => t.id === id
);
};



// =========================================
// FETCH TEACHERS
// =========================================

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



// =========================================
// FETCH HODS
// =========================================

const fetchHods = async () => {

try {

const res = await axios.get(

`http://localhost:8080/api/hods/school/${schoolId}`

);

setHods(res.data || []);

} catch (err) {

console.log(err);
}
};



// =========================================
// GET TEACHER NAME
// =========================================

const getTeacherName = (id) => {

const teacher =
teachers.find(
(t) => t.id === id
);

return teacher
? teacher.name
: "Teacher";
};



// =========================================
// GET HOD NAME
// =========================================

const getHodName = (id) => {

const hod =
hods.find(
(h) => h.id === id
);

return hod
? hod.name
: "HOD";
};



// =========================================
// APPROVE
// =========================================

const approveLeave =
async (leaveId) => {

try {

await axios.put(

`http://localhost:8080/api/leave/approve/${leaveId}/${adminId}/ADMIN`,

{},

{
params: {
responseMessage: ""
}
}
);

alert("✅ Approved");

fetchLeaves();

} catch (err) {

console.log(err);

alert("❌ Failed");
}
};



// =========================================
// OPEN REJECT MODAL
// =========================================

const openRejectModal =
(id) => {

setSelectedLeaveId(id);

setShowRejectModal(true);
};



// =========================================
// REJECT
// =========================================

const rejectLeave =
async () => {

try {

await axios.put(

`http://localhost:8080/api/leave/reject/${selectedLeaveId}/${adminId}/ADMIN`,

{},

{
params: {
responseMessage:
rejectReason
}
}
);

alert("❌ Rejected");

setShowRejectModal(false);

setRejectReason("");

fetchLeaves();

} catch (err) {

console.log(err);
}
};



// =========================================
// FILTER
// =========================================

const filteredLeaves =

activeTab === "ALL"

? leaves

: leaves.filter(
(l) =>
l.status === activeTab
);



// =========================================
// STATUS COLOR
// =========================================

const getStatusColor =
(status) => {

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



// =========================================
// UI
// =========================================

return (

<div className="
min-h-screen
p-6
bg-gradient-to-br
from-blue-50
via-indigo-50
to-purple-100
">

{/* HEADER */}

<div className="
flex justify-between
items-center
mb-10
flex-wrap
gap-4
">

<div>

<Typography
variant="h3"
className="font-bold"
>

🏫 School Admin Leave Management

</Typography>

<Typography
color="gray"
className="mt-2"
>

Manage HOD and Teacher
leave requests professionally

</Typography>

</div>

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

className={
activeTab === tab

? "bg-blue-600 rounded-full"

: "bg-white text-black rounded-full"
}
>

{tab}

</Button>

))}

</div>

</div>



{/* LOADING */}

{loading && (

<div className="
flex justify-center
mt-20
">

<Spinner className="
h-14 w-14
text-blue-600
"/>

</div>
)}



{/* CARDS */}

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
shadow-xl
overflow-hidden
hover:-translate-y-2
transition-all
duration-300
"
>

{/* TOP */}

<div className="
bg-gradient-to-r
from-indigo-600
to-blue-500
p-5
text-white
">

<div className="
flex items-center
gap-4
">

<img

src={

leave.senderType === "HOD"

? (

getHod(leave.senderId)?.imageUrl

? `http://localhost:8080/api/hods/image/get/${leave.senderId}`

: `https://ui-avatars.com/api/?name=${
getHod(leave.senderId)?.name || "HOD"
}`
)

: leave.senderType === "TEACHER"

? (

getTeacher(leave.senderId)?.imageUrl

? `http://localhost:8080/api/professors/image/get/${leave.senderId}`

: `https://ui-avatars.com/api/?name=${
getTeacher(leave.senderId)?.name || "Teacher"
}`
)

: leave.student?.profileImage

? `http://localhost:8080/api/students/image/get/${leave.student.id}`

: `https://ui-avatars.com/api/?name=Student`
}

alt="profile"

className="
w-16 h-16
rounded-full
border-4 border-white
object-cover
"
/>

<div>

<div className="
flex items-center
gap-2
">

<span className="
bg-white/20
px-2 py-1
rounded-full
text-xs
font-bold
">

{

leave.senderType === "HOD"

? "🏢 HOD"

: leave.senderType === "TEACHER"

? "👨‍🏫 TEACHER"

: "👨‍🎓 STUDENT"

}

</span>

</div>

<Typography
variant="h5"
className="
font-bold
text-white
mt-2
"
>

{

leave.senderType === "HOD"

? getHodName(
leave.senderId
)

: leave.senderType === "TEACHER"

? getTeacherName(
leave.senderId
)

: `${leave.student?.studfirstName || ""}
${leave.student?.studlastName || ""}`
}

</Typography>



{/* CLASS */}

{leave.senderType ===
"STUDENT" && (

<Typography
className="
text-blue-100
text-sm
"
>

Class :
{leave.className || "-"}

</Typography>

)}

</div>

</div>

</div>



{/* BODY */}

<CardBody>

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



<div className="mb-5">

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



<div className="mb-5">

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
rounded-2xl
p-4 mb-5
">

<Typography
variant="small"
className="font-bold"
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



{leave.status ===
"PENDING" && (

<div className="
flex gap-3
">

<Button

color="green"

fullWidth

className="rounded-xl"

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

className="rounded-xl"

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



{/* REJECT MODAL */}

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

</div>
);
};

export default SchoolAdminLeaveManagement;