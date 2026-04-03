// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Alert,
//   Card,
//   CardHeader,
//   CardBody,
// } from "@material-tailwind/react";
// import { InformationCircleIcon } from "@heroicons/react/24/outline";

// export function Notifications({ studentId }) {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8080/api/notifications/student/${studentId}`
//         );
//         if (response.ok) {
//           const data = await response.json();
//           setNotifications(data);
//         } else {
//           console.error("Failed to fetch notifications");
//         }
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, [studentId]);

//   if (loading) {
//     return <Typography>Loading...</Typography>;
//   }

//   return (
//     <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
//       <Card>
//         <CardHeader
//           color="transparent"
//           floated={false}
//           shadow={false}
//           className="m-0 p-4"
//         >
//           <Typography variant="h5" color="blue-gray">
//             Notifications
//           </Typography>
//         </CardHeader>
//         <CardBody className="flex flex-col gap-4 p-4">
//           {notifications.length > 0 ? (
//             notifications.map((notification, index) => (
//               <Alert
//                 key={index}
//                 color="blue"
//                 icon={
//                   <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
//                 }
//               >
//                 <strong>{notification.title}</strong>: {notification.message}
//               </Alert>
//             ))
//           ) : (
//             <Typography>No notifications available.</Typography>
//           )}
//         </CardBody>
//       </Card>
//     </div>
//   );
// }

// export default Notifications;



//after update





// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Alert,
//   Card,
//   CardHeader,
//   CardBody,
// } from "@material-tailwind/react";
// import { InformationCircleIcon } from "@heroicons/react/24/outline";

// export function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const studentId = localStorage.getItem("studentId");

//     console.log("Student ID:", studentId);

//     if (!studentId) {
//       console.error("Student not logged in ❌");
//       return;
//     }

//     const fetchNotifications = async () => {
//       try {
//         const response = await fetch(
//           `http://localhost:8080/api/notifications/student/${studentId}`
//         );

//         const data = await response.json();
//         console.log("Notifications:", data);

//         setNotifications(data);
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchNotifications();
//   }, []);

//   if (loading) {
//     return (
//       <Typography className="text-center mt-10">
//         Loading Notifications...
//       </Typography>
//     );
//   }

//   return (
//     <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
//       <Card>
//         <CardHeader className="p-4">
//           <Typography variant="h5">Notifications</Typography>
//         </CardHeader>

//         <CardBody className="flex flex-col gap-4 p-4">
//           {notifications.length > 0 ? (
//             notifications.map((n) => (
//               <Alert
//                 key={n.id}
//                 color={n.readStatus ? "gray" : "green"}
//                 icon={<InformationCircleIcon className="h-6 w-6" />}
//               >
//                 <div className="flex flex-col gap-1">
//                   {/* Title */}
//                   <strong className="text-base">{n.title}</strong>

//                   {/* Message */}
//                   <span>{n.message}</span>

//                   {/* 🔥 Sender */}
//                   <span className="text-sm text-gray-600 mt-1">
//                     👤 Sent by:{" "}
//                     <b>{n.sender ? n.sender : "Unknown"}</b>
//                   </span>

//                   {/* 📅 Date Time */}
//                   <span className="text-xs text-gray-400">
//                     📅{" "}
//                     {n.sentAt
//                       ? new Date(n.sentAt).toLocaleString()
//                       : "No Date"}
//                   </span>
//                 </div>
//               </Alert>
//             ))
//           ) : (
//             <Typography className="text-center">
//               No notifications ❌
//             </Typography>
//           )}
//         </CardBody>
//       </Card>
//     </div>
//   );
// }

// export default Notifications;



// new update fordeletion


import React, { useState, useEffect } from "react";
import {
  Typography,
  Alert,
  Card,
  CardHeader,
  CardBody,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem("studentId");

  const fetchNotifications = async () => {
    const response = await fetch(
      `http://localhost:8080/api/notifications/student/${studentId}`
    );
    const data = await response.json();
    setNotifications(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (id) => {
    await fetch(`http://localhost:8080/api/notifications/read/${id}`, {
      method: "PUT",
    });
    fetchNotifications();
  };

  const handleArchive = async (id) => {
    await fetch(`http://localhost:8080/api/notifications/archive/${id}`, {
      method: "PUT",
    });
    fetchNotifications();
  };

  if (loading) {
    return <Typography className="text-center mt-10">Loading...</Typography>;
  }

  return (
    <div className="mx-auto my-20 flex max-w-screen-lg flex-col gap-8">
      <Card>
        <CardHeader className="p-4">
          <Typography variant="h5">Notifications</Typography>
        </CardHeader>

        <CardBody className="flex flex-col gap-4 p-4">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <Alert
                key={n.id}
                color={n.readStatus ? "gray" : "green"}
                icon={<InformationCircleIcon className="h-6 w-6" />}
              >
                <div className="flex flex-col gap-1">
                  <strong>{n.title}</strong>
                  <span>{n.message}</span>

                  <span className="text-sm text-gray-600">
                    👤 {n.sender}
                  </span>

                  <span className="text-xs text-gray-400">
                    {new Date(n.sentAt).toLocaleString()}
                  </span>

                  {/* BUTTONS */}
                  <div className="flex gap-2 mt-2">
                    {!n.readStatus && (
                      <button
                        onClick={() => handleRead(n.id)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Read
                      </button>
                    )}

                    {n.readStatus && (
                      <button
                        onClick={() => handleArchive(n.id)}
                        className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              </Alert>
            ))
          ) : (
            <Typography>No notifications</Typography>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default Notifications;