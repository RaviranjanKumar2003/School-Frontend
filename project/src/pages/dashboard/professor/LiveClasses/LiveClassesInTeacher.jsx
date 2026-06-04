import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CreateLiveClass from "./CreateLiveClass";

import {
  VideoCameraIcon,
  PlayCircleIcon,
  StopCircleIcon,
  PlusCircleIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  LinkIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

const API = "http://localhost:8080/api/live-class";

function LiveClassesInTeacher() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editClass, setEditClass] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const [stats, setStats] = useState({
  total: 0,
  live: 0,
  upcoming: 0,
  completed: 0,
  participants: 0,
  attendance: 0,
});

  const stored = JSON.parse(localStorage.getItem("professorData"));

const professorId = stored?.id || localStorage.getItem("professorId");
  console.log("PID :",professorId);

  const [openCreateModal, setOpenCreateModal] =
  useState(false);
  

  

const openEditClass = (cls) => {
  setEditClass(cls);
  setOpenCreateModal(true); // reuse same modal
};

const viewAnalytics = (cls) => {
  console.log("Analytics:", cls);
};

  
useEffect(() => {
  if (professorId) {
    fetchClasses();
  }
}, [professorId]);

useEffect(() => {
  console.log("Classes =>", classes);
}, [classes]);

  const fetchClasses = async () => {
  try {
    setLoading(true);

    const res = await axios.get(`${API}/professor/${professorId}`)
  .catch(err => {
    
    console.log("API ERROR:", err.response?.data);
    return { data: [] };
  });

  console.log(
  JSON.stringify(
    res.data[0],
    null,
    2
  )
);
console.log("CLASS DATA => ", res.data);
    console.log(
      "API RESPONSE =>",
      res.data
    );

    setClasses(res.data || []);

    calculateStats(res.data || []);
  } catch (err) {
    console.log(
      "LIVE CLASS ERROR =>",
      err
    );
  } finally {
    setLoading(false);
  }
};

  const calculateStats = (data) => {
  setStats({
    total: data.length,

    live: data.filter(
      (c) => c.status === "LIVE"
    ).length,

    upcoming: data.filter(
      (c) => c.status === "SCHEDULED"
    ).length,

    completed: data.filter(
      (c) => c.status === "ENDED"
    ).length,

    // Total Unique Joined
    participants: data.reduce(
      (sum, c) => sum + (c.totalParticipants || 0),
      0
    ),

    // Current Online
    attendance: data.reduce(
      (sum, c) => sum + (c.currentParticipants || 0),
      0
    ),
  });
};

  const startClass = async (id) => {
    try {
      await axios.put(`${API}/start/${id}`);
      fetchClasses();
    } catch (err) {
      console.log(err);
    }
  };

  const endClass = async (id) => {
    try {
      await axios.put(`${API}/end/${id}`);
      fetchClasses();
    } catch (err) {
      console.log(err);
    }
  };

  const deleteClass = async (id) => {
  try {
    await axios.delete(`${API}/${id}`);
    fetchClasses();
  } catch (err) {
    console.log(err);
  }
};

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
     const matchSearch =
  item.topic
    ?.toLowerCase()
    .includes(search.toLowerCase()) ||

  item.description
    ?.toLowerCase()
    .includes(search.toLowerCase()) ||

  item.meetingProvider
    ?.toLowerCase()
    .includes(search.toLowerCase());

      const matchStatus =
        filter === "ALL"
          ? true
          : item.status === filter;

      return matchSearch && matchStatus;
    });
  }, [classes, search, filter]);

  const copyLink = async (link) => {
  try {
    await navigator.clipboard.writeText(link);
  } catch (err) {
    console.log(err);
  }
};

  const badgeColor = (status) => {
    switch (status) {
      case "LIVE":
        return "bg-green-100 text-green-700";

      case "SCHEDULED":
        return "bg-blue-100 text-blue-700";

      case "ENDED":
        return "bg-gray-100 text-gray-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  };

  


  return (
    <div className="min-h-screen bg-slate-50 p-3 md:p-6">

      {/* Header */}

      <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl mb-6">

  <div className="flex flex-col lg:flex-row justify-between gap-4">

    <div>
      <h1 className="text-3xl md:text-4xl font-bold">
        Live Classes Dashboard
      </h1>

      <p className="text-blue-100 mt-2">
        Manage, schedule and monitor your live sessions.
      </p>
    </div>

    <button
  onClick={() => setOpenCreateModal(true)}
  className="bg-white text-blue-700 font-semibold px-5 py-3 rounded-xl hover:bg-blue-50 transition"
>
      <div className="flex items-center gap-2">
        <PlusCircleIcon className="h-5 w-5" />
        Create Class
      </div>
    </button>

  </div>
</div>

      {/* Stats */}

      <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 mb-6">

        <StatCard
          title="Total"
          value={stats.total}
          icon={<VideoCameraIcon className="h-7 w-7" />}
        />

        <StatCard
          title="Live"
          value={stats.live}
          icon={<PlayCircleIcon className="h-7 w-7" />}
        />

        <StatCard
          title="Upcoming"
          value={stats.upcoming}
          icon={<CalendarDaysIcon className="h-7 w-7" />}
        />

        <StatCard
          title="Completed"
          value={stats.completed}
          icon={<StopCircleIcon className="h-7 w-7" />}
        />

        <StatCard
  title="Participants"
  value={stats.participants}
  icon={<UserGroupIcon className="h-7 w-7" />}
/>

<StatCard
  title="Currently Online"
  value={stats.attendance}
  icon={<EyeIcon className="h-7 w-7" />}
/>
      </div>

      {/* Filters */}

      <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">

        <div className="flex flex-col lg:flex-row gap-3">

          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-3.5 text-slate-400" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search classes..."
              className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <select
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value)
            }
            className="border rounded-xl px-4 py-3"
          >
            <option value="ALL">
              All Classes
            </option>

            <option value="LIVE">
              Live
            </option>

            <option value="SCHEDULED">
              Scheduled
            </option>

            <option value="ENDED">
              Completed
            </option>
          </select>
        </div>
      </div>

      {/* Classes */}

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-64 rounded-2xl bg-white animate-pulse"
            />
          ))}
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

  <VideoCameraIcon className="h-20 w-20 mx-auto text-blue-300" />

  <h2 className="text-2xl font-bold mt-4">
    No Live Classes Yet
  </h2>

  <p className="text-slate-500 mt-2">
    Create your first live class and start teaching online.
  </p>

</div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">

  <div className="flex justify-between items-start">

    <div>

      <h3 className="font-bold text-lg">
        {cls.topic}
      </h3>

      <p className="text-blue-100 mt-2">
        {cls.classEntity?.className || "Live Class"}
      </p>

      {/* Provider Badge */}

      <div className="mt-3">
        <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
          {cls.meetingProvider || "Online"}
        </span>
      </div>

    </div>

    <span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
    cls.status
  )}`}
>
  {cls.status === "ENDED"
    ? "COMPLETED"
    : cls.status}
</span>

  </div>

</div>

              <div className="p-5 space-y-3">

                <div className="flex items-center gap-2 text-slate-600">
                  <CalendarDaysIcon className="h-5 w-5" />
                  {cls.scheduledDate}
                </div>

                <div className="flex items-center gap-2 text-slate-600">
                  <ClockIcon className="h-5 w-5" />
                  {cls.scheduledTime}
                </div>

               <div className="flex items-center gap-2 text-slate-600">
  <UserGroupIcon className="h-5 w-5" />
  Total Joined: {cls.totalParticipants || 0}
</div>

{/* Analytics */}

<div className="grid grid-cols-2 gap-2">

  <div className="bg-slate-50 rounded-xl p-3 text-center">
    <p className="text-xs text-slate-500">
      Current Online
    </p>

    <p className="font-bold text-green-600">
      {cls.currentParticipants || 0}
    </p>
  </div>

  <div className="bg-slate-50 rounded-xl p-3 text-center">
    <p className="text-xs text-slate-500">
      Messages
    </p>

    <p className="font-bold">
      {cls.totalMessages || 0}
    </p>
  </div>

</div>

{cls.status === "LIVE" && (
  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">

    <p className="text-xs text-green-600">
      Students Currently In Class
    </p>

    <p className="text-2xl font-bold text-green-700">
      {cls.currentParticipants || 0}
    </p>

  </div>
)}

<div className="grid grid-cols-2 gap-2 mt-4">

  <button
    onClick={() => copyLink(cls.meetingLink)}
    className="flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-slate-100"
  >
    <LinkIcon className="h-4 w-4" />
    Link
  </button>

  <button
    onClick={() =>
      window.open(cls.meetingLink, "_blank")
    }
    className="flex items-center justify-center gap-2 border rounded-xl py-2 hover:bg-slate-100"
  >
    <EyeIcon className="h-4 w-4" />
    Join
  </button>

</div>

                {cls.status === "SCHEDULED" && (
  <div className="grid grid-cols-3 gap-2 mt-3">

    {/* START CLASS */}
    <button
      onClick={() => startClass(cls.id)}
      className="bg-green-600 text-white py-3 rounded-xl"
    >
      Start
    </button>

    {/* UPDATE CLASS */}
    <button
      onClick={() => openEditClass(cls)}
      className="bg-blue-600 text-white py-3 rounded-xl"
    >
      Update
    </button>

    {/* DELETE CLASS */}
    <button
      onClick={() => deleteClass(cls.id)}
      className="bg-red-600 text-white py-3 rounded-xl"
    >
      Delete
    </button>

  </div>
)}

                {cls.status === "LIVE" && (
  <div className="grid grid-cols-2 gap-2 mt-3">

    {/* END CLASS */}
    <button
      onClick={() => endClass(cls.id)}
      className="bg-red-600 text-white py-3 rounded-xl"
    >
      End Class
    </button>

    {/* VIEW ANALYTICS */}
    <button
      onClick={() => viewAnalytics(cls)}
      className="bg-green-600 text-white py-3 rounded-xl"
    >
      Analytics
    </button>

  </div>
)}

                {cls.status === "ENDED" && (
  <button
    onClick={() => deleteClass(cls.id)}
    className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl mt-3"
  >
    Delete Class
  </button>
)}
              </div>
            </div>
          ))}
        </div>
      )}

      {openCreateModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

    <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-y-auto relative">

      <button
        onClick={() =>
          setOpenCreateModal(false)
        }
        className="absolute top-4 right-4 text-slate-500 hover:text-red-500 text-2xl"
      >
        ×
      </button>

      <CreateLiveClass
        onSuccess={() => {
          setOpenCreateModal(false);
          fetchClasses();
        }}
      />

    </div>

  </div>
)}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
}) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-1 text-slate-800">
            {value}
          </h2>

        </div>

        <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
          {icon}
        </div>

      </div>

    </div>
  );
}

export default LiveClassesInTeacher;





// import React, {
//   useEffect,
//   useMemo,
//   useState,
// } from "react";

// import axios from "axios";

// import CreateLiveClass from "./CreateLiveClass";

// import {
//   VideoCameraIcon,
//   PlayCircleIcon,
//   StopCircleIcon,
//   PlusCircleIcon,
//   UserGroupIcon,
//   CalendarDaysIcon,
//   ClockIcon,
//   MagnifyingGlassIcon,
//   LinkIcon,
//   EyeIcon,
//   PencilSquareIcon,
//   TrashIcon,
//   XMarkIcon,
// } from "@heroicons/react/24/outline";

// const API =
//   "http://localhost:8080/api/live-class";

// function LiveClassesInTeacher() {
//   const [classes, setClasses] = useState([]);

//   const [loading, setLoading] =
//     useState(true);

//   const [search, setSearch] =
//     useState("");

//   const [filter, setFilter] =
//     useState("ALL");

//   const [openCreateModal, setOpenCreateModal] =
//     useState(false);

//   const [editClass, setEditClass] =
//     useState(null);

//   const [stats, setStats] = useState({
//     total: 0,
//     live: 0,
//     upcoming: 0,
//     completed: 0,
//     participants: 0,
//     attendance: 0,
//   });

//   const stored = JSON.parse(
//     localStorage.getItem("professorData")
//   );

//   const professorId =
//     stored?.id ||
//     localStorage.getItem("professorId");

//   /* =========================================
//       FETCH CLASSES
//   ========================================= */

//   useEffect(() => {
//     if (professorId) {
//       fetchClasses();
//     }
//   }, [professorId]);

//   const fetchClasses = async () => {
//     try {
//       setLoading(true);

//       const res = await axios.get(
//         `${API}/professor/${professorId}`
//       );

//       console.log(
//         "LIVE CLASSES =>",
//         res.data
//       );

//       setClasses(res.data || []);

//       calculateStats(res.data || []);
//     } catch (err) {
//       console.log(
//         "FETCH ERROR =>",
//         err
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   /* =========================================
//       STATS
//   ========================================= */

//   const calculateStats = (data) => {
//     setStats({
//       total: data.length,

//       live: data.filter(
//         (c) => c.status === "LIVE"
//       ).length,

//       upcoming: data.filter(
//         (c) => c.status === "SCHEDULED"
//       ).length,

//       completed: data.filter(
//         (c) => c.status === "ENDED"
//       ).length,

//       participants: data.reduce(
//         (sum, c) =>
//           sum + (c.totalParticipants || 0),
//         0
//       ),

//       attendance: data.reduce(
//         (sum, c) =>
//           sum +
//           (c.currentParticipants || 0),
//         0
//       ),
//     });
//   };

//   /* =========================================
//       START CLASS
//   ========================================= */

//   const startClass = async (id) => {
//     try {
//       await axios.put(
//         `${API}/start/${id}`
//       );

//       fetchClasses();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   /* =========================================
//       END CLASS
//   ========================================= */

//   const endClass = async (id) => {
//     try {
//       await axios.put(
//         `${API}/end/${id}`
//       );

//       fetchClasses();
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   /* =========================================
//       DELETE CLASS
//   ========================================= */

//   const deleteClass = async (id) => {
//     const confirmDelete =
//       window.confirm(
//         "Are you sure you want to delete this class?"
//       );

//     if (!confirmDelete) return;

//     try {
//       await axios.delete(
//         `${API}/${id}`
//       );

//       alert("Class Deleted");

//       fetchClasses();
//     } catch (err) {
//       console.log(err);

//       alert("Delete Failed");
//     }
//   };

//   /* =========================================
//       EDIT CLASS
//   ========================================= */

//   const openEditClass = (cls) => {
//     setEditClass(cls);

//     setOpenCreateModal(true);
//   };

//   /* =========================================
//       ANALYTICS
//   ========================================= */

//   const viewAnalytics = (cls) => {
//     console.log(
//       "CLASS ANALYTICS =>",
//       cls
//     );

//     alert(`
// Topic : ${cls.topic}

// Total Joined : ${
//       cls.totalParticipants || 0
//     }

// Current Online : ${
//       cls.currentParticipants || 0
//     }

// Messages : ${
//       cls.totalMessages || 0
//     }
//     `);
//   };

//   /* =========================================
//       COPY LINK
//   ========================================= */

//   const copyLink = async (link) => {
//     try {
//       await navigator.clipboard.writeText(
//         link
//       );

//       alert("Meeting Link Copied");
//     } catch (err) {
//       console.log(err);
//     }
//   };

//   /* =========================================
//       FILTERED CLASSES
//   ========================================= */

//   const filteredClasses = useMemo(() => {
//     return classes.filter((item) => {
//       const matchSearch =
//         item.topic
//           ?.toLowerCase()
//           .includes(
//             search.toLowerCase()
//           ) ||
//         item.description
//           ?.toLowerCase()
//           .includes(
//             search.toLowerCase()
//           ) ||
//         item.meetingProvider
//           ?.toLowerCase()
//           .includes(
//             search.toLowerCase()
//           );

//       const matchStatus =
//         filter === "ALL"
//           ? true
//           : item.status === filter;

//       return (
//         matchSearch && matchStatus
//       );
//     });
//   }, [classes, search, filter]);

//   /* =========================================
//       BADGE COLOR
//   ========================================= */

//   const badgeColor = (status) => {
//     switch (status) {
//       case "LIVE":
//         return "bg-green-100 text-green-700";

//       case "SCHEDULED":
//         return "bg-blue-100 text-blue-700";

//       case "ENDED":
//         return "bg-gray-100 text-gray-700";

//       default:
//         return "bg-slate-100 text-slate-700";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 p-4 md:p-6">

//       {/* HEADER */}

//       <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white shadow-xl mb-6">

//         <div className="flex flex-col lg:flex-row justify-between gap-5">

//           <div>
//             <h1 className="text-3xl md:text-4xl font-bold">
//               Live Classes Dashboard
//             </h1>

//             <p className="text-blue-100 mt-2">
//               Manage, schedule and
//               monitor your online
//               classes.
//             </p>
//           </div>

//           <button
//             onClick={() => {
//               setEditClass(null);

//               setOpenCreateModal(
//                 true
//               );
//             }}
//             className="bg-white text-blue-700 font-semibold px-5 py-3 rounded-2xl hover:bg-blue-50 transition"
//           >
//             <div className="flex items-center gap-2">
//               <PlusCircleIcon className="h-5 w-5" />

//               Create Class
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* STATS */}

//       <div className="grid grid-cols-2 xl:grid-cols-6 gap-4 mb-6">

//         <StatCard
//           title="Total"
//           value={stats.total}
//           icon={
//             <VideoCameraIcon className="h-7 w-7" />
//           }
//         />

//         <StatCard
//           title="Live"
//           value={stats.live}
//           icon={
//             <PlayCircleIcon className="h-7 w-7" />
//           }
//         />

//         <StatCard
//           title="Upcoming"
//           value={stats.upcoming}
//           icon={
//             <CalendarDaysIcon className="h-7 w-7" />
//           }
//         />

//         <StatCard
//           title="Completed"
//           value={stats.completed}
//           icon={
//             <StopCircleIcon className="h-7 w-7" />
//           }
//         />

//         <StatCard
//           title="Participants"
//           value={stats.participants}
//           icon={
//             <UserGroupIcon className="h-7 w-7" />
//           }
//         />

//         <StatCard
//           title="Online"
//           value={stats.attendance}
//           icon={
//             <EyeIcon className="h-7 w-7" />
//           }
//         />
//       </div>

//       {/* FILTER */}

//       <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">

//         <div className="flex flex-col lg:flex-row gap-3">

//           <div className="relative flex-1">

//             <MagnifyingGlassIcon className="h-5 w-5 absolute left-4 top-3.5 text-slate-400" />

//             <input
//               type="text"
//               placeholder="Search classes..."
//               value={search}
//               onChange={(e) =>
//                 setSearch(
//                   e.target.value
//                 )
//               }
//               className="w-full border rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <select
//             value={filter}
//             onChange={(e) =>
//               setFilter(
//                 e.target.value
//               )
//             }
//             className="border rounded-xl px-4 py-3"
//           >
//             <option value="ALL">
//               All Classes
//             </option>

//             <option value="LIVE">
//               Live
//             </option>

//             <option value="SCHEDULED">
//               Scheduled
//             </option>

//             <option value="ENDED">
//               Ended
//             </option>
//           </select>
//         </div>
//       </div>

//       {/* LOADING */}

//       {loading ? (
//         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

//           {[1, 2, 3, 4, 5, 6].map(
//             (i) => (
//               <div
//                 key={i}
//                 className="h-64 bg-white rounded-2xl animate-pulse"
//               />
//             )
//           )}
//         </div>
//       ) : filteredClasses.length ===
//         0 ? (
//         /* EMPTY */

//         <div className="bg-white rounded-3xl p-12 text-center shadow-sm">

//           <VideoCameraIcon className="h-20 w-20 mx-auto text-blue-300" />

//           <h2 className="text-2xl font-bold mt-4">
//             No Live Classes Found
//           </h2>

//           <p className="text-slate-500 mt-2">
//             Create your first class
//             and start teaching online.
//           </p>
//         </div>
//       ) : (
//         /* CLASSES */

//         <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">

//           {filteredClasses.map(
//             (cls) => (
//               <div
//                 key={cls.id}
//                 className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all overflow-hidden"
//               >
//                 {/* TOP */}

//                 <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 text-white">

//                   <div className="flex justify-between items-start">

//                     <div>

//                       <h3 className="font-bold text-lg">
//                         {cls.topic}
//                       </h3>

//                       <p className="text-blue-100 mt-2">
//                         {cls.classEntity
//                           ?.className ||
//                           "Live Class"}
//                       </p>

//                       <div className="mt-3">

//                         <span className="bg-white/20 px-3 py-1 rounded-full text-xs">
//                           {cls.meetingProvider ||
//                             "Online"}
//                         </span>
//                       </div>
//                     </div>

//                     <span
//                       className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeColor(
//                         cls.status
//                       )}`}
//                     >
//                       {cls.status}
//                     </span>
//                   </div>
//                 </div>

//                 {/* BODY */}

//                 <div className="p-5 space-y-4">

//                   <div className="flex items-center gap-2 text-slate-600">

//                     <CalendarDaysIcon className="h-5 w-5" />

//                     {cls.scheduledDate}
//                   </div>

//                   <div className="flex items-center gap-2 text-slate-600">

//                     <ClockIcon className="h-5 w-5" />

//                     {cls.scheduledTime}
//                   </div>

//                   <div className="flex items-center gap-2 text-slate-600">

//                     <UserGroupIcon className="h-5 w-5" />

//                     Total Joined :
//                     {" "}
//                     {cls.totalParticipants ||
//                       0}
//                   </div>

//                   {/* ANALYTICS */}

//                   <div className="grid grid-cols-2 gap-3">

//                     <div className="bg-slate-50 rounded-xl p-3 text-center">

//                       <p className="text-xs text-slate-500">
//                         Current Online
//                       </p>

//                       <p className="font-bold text-green-600 text-xl">
//                         {cls.currentParticipants ||
//                           0}
//                       </p>
//                     </div>

//                     <div className="bg-slate-50 rounded-xl p-3 text-center">

//                       <p className="text-xs text-slate-500">
//                         Messages
//                       </p>

//                       <p className="font-bold text-xl">
//                         {cls.totalMessages ||
//                           0}
//                       </p>
//                     </div>
//                   </div>

//                   {/* LIVE INFO */}

//                   {cls.status ===
//                     "LIVE" && (
//                     <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">

//                       <p className="text-xs text-green-600">
//                         Students Currently
//                         In Class
//                       </p>

//                       <p className="text-3xl font-bold text-green-700">
//                         {cls.currentParticipants ||
//                           0}
//                       </p>
//                     </div>
//                   )}

//                   {/* LINK BUTTONS */}

//                   <div className="grid grid-cols-2 gap-3">

//                     <button
//                       onClick={() =>
//                         copyLink(
//                           cls.meetingLink
//                         )
//                       }
//                       className="flex items-center justify-center gap-2 border rounded-xl py-3 hover:bg-slate-100"
//                     >
//                       <LinkIcon className="h-4 w-4" />

//                       Copy Link
//                     </button>

//                     <button
//                       onClick={() =>
//                         window.open(
//                           cls.meetingLink,
//                           "_blank"
//                         )
//                       }
//                       className="flex items-center justify-center gap-2 border rounded-xl py-3 hover:bg-slate-100"
//                     >
//                       <EyeIcon className="h-4 w-4" />

//                       Join
//                     </button>
//                   </div>

//                   {/* SCHEDULED ACTIONS */}

//                   {cls.status ===
//                     "SCHEDULED" && (
//                     <div className="grid grid-cols-3 gap-2">

//                       <button
//                         onClick={() =>
//                           startClass(
//                             cls.id
//                           )
//                         }
//                         className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
//                       >
//                         Start
//                       </button>

//                       <button
//                         onClick={() =>
//                           openEditClass(
//                             cls
//                           )
//                         }
//                         className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl flex items-center justify-center gap-1"
//                       >
//                         <PencilSquareIcon className="h-4 w-4" />

//                         Edit
//                       </button>

//                       <button
//                         onClick={() =>
//                           deleteClass(
//                             cls.id
//                           )
//                         }
//                         className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl flex items-center justify-center gap-1"
//                       >
//                         <TrashIcon className="h-4 w-4" />

//                         Delete
//                       </button>
//                     </div>
//                   )}

//                   {/* LIVE ACTIONS */}

//                   {cls.status ===
//                     "LIVE" && (
//                     <div className="grid grid-cols-2 gap-2">

//                       <button
//                         onClick={() =>
//                           endClass(
//                             cls.id
//                           )
//                         }
//                         className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
//                       >
//                         End Class
//                       </button>

//                       <button
//                         onClick={() =>
//                           viewAnalytics(
//                             cls
//                           )
//                         }
//                         className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
//                       >
//                         Analytics
//                       </button>
//                     </div>
//                   )}

//                   {/* ENDED */}

//                   {cls.status ===
//                     "ENDED" && (
//                     <button
//                       onClick={() =>
//                         deleteClass(
//                           cls.id
//                         )
//                       }
//                       className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
//                     >
//                       Delete Class
//                     </button>
//                   )}
//                 </div>
//               </div>
//             )
//           )}
//         </div>
//       )}

//       {/* CREATE / UPDATE MODAL */}

//       {openCreateModal && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

//           <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-y-auto relative">

//             <button
//               onClick={() => {
//                 setOpenCreateModal(
//                   false
//                 );

//                 setEditClass(null);
//               }}
//               className="absolute top-4 right-4 z-10"
//             >
//               <XMarkIcon className="h-8 w-8 text-slate-500 hover:text-red-500" />
//             </button>

//             <CreateLiveClass
//               editData={editClass}
//               onSuccess={() => {
//                 setOpenCreateModal(
//                   false
//                 );

//                 setEditClass(null);

//                 fetchClasses();
//               }}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// /* =========================================
//     STAT CARD
// ========================================= */

// function StatCard({
//   title,
//   value,
//   icon,
// }) {
//   return (
//     <div className="bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg transition">

//       <div className="flex justify-between items-center">

//         <div>

//           <p className="text-slate-500 text-sm">
//             {title}
//           </p>

//           <h2 className="text-3xl font-bold mt-1 text-slate-800">
//             {value}
//           </h2>
//         </div>

//         <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
//           {icon}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LiveClassesInTeacher;