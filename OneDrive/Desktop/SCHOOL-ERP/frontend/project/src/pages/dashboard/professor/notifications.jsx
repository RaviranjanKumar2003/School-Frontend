// import React, { useState, useEffect } from "react";
// import {
//   Typography,
//   Alert,
//   Card,
//   CardHeader,
//   CardBody,
// } from "@material-tailwind/react";
// import { InformationCircleIcon } from "@heroicons/react/24/outline";
// import axios from "axios";

// export function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [showAlerts, setShowAlerts] = useState({});
//   const [professor, setProfessor] = useState(null);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const storedProfessorData = localStorage.getItem("professorData");

//     if (storedProfessorData) {
//       const professorData = JSON.parse(storedProfessorData);
//       setProfessor(professorData);
//       console.log("Professor data: ", professorData);
//     } else {
//       setError("No professor data available. Please log in again.");
//     }
//   }, []);

//   useEffect(() => {
//     const fetchNotifications = async () => {
//       try {
//         if (professor) {
//           const response = await axios.get(
//             `http://localhost:8080/api/notifications/professor/${professor.id}`
//           );

//           setNotifications(response.data);
//           console.log("Notifications: ", response.data);

//           // Initialize showAlerts state to keep track of each notification's visibility
//           const initialAlertsState = response.data.reduce(
//             (acc, notification) => {
//               acc[notification.id] = true; // Use notification id as the key
//               return acc;
//             },
//             {}
//           );

//           setShowAlerts(initialAlertsState);
//         }
//       } catch (error) {
//         console.error("Error fetching notifications:", error);
//         setError("Failed to load notifications. Please try again later.");
//       }
//     };

//     if (professor) {
//       fetchNotifications();
//     }
//   }, [professor]);

//   const handleCloseAlert = (notificationId) => {
//     setShowAlerts((prevState) => ({
//       ...prevState,
//       [notificationId]: false,
//     }));
//   };

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
//           {error && (
//             <Alert
//               color="red"
//               icon={<InformationCircleIcon className="h-6 w-6" />}
//             >
//               {error}
//             </Alert>
//           )}
//           {notifications.length > 0 ? (
//             notifications.map((notification) => (
//               <Alert
//                 key={notification.id} 
//                 open={showAlerts[notification.id]}
//                 color="blue"
//                 icon={
//                   <InformationCircleIcon strokeWidth={2} className="h-6 w-6" />
//                 }
//                 onClose={() => handleCloseAlert(notification.id)}
//               >
//                 <Typography variant="h6" className="font-bold">
//                   {notification.subject || "No subject available"}
//                 </Typography>
//                 <Typography>{notification.message}</Typography>
//                 <div className="mt-2">
//                   <Typography variant="small" color="gray" className="italic">
//                     Sent at{" "}
//                     {notification.sentAt
//                       ? new Date(notification.sentAt).toLocaleString()
//                       : "Unknown time"}
//                   </Typography>
//                 </div>
//               </Alert>
//             ))
//           ) : (
//             <Typography variant="h6" color="gray">
//               No notifications available.
//             </Typography>
//           )}
//         </CardBody>
//       </Card>
//     </div>
//   );
// }

// export default Notifications;





import { useState } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Input,
  Typography,
  Select,
  Option,
  Spinner,
} from "@material-tailwind/react";

const TeacherNotification = () => {
  const [recipientType, setRecipientType] = useState("ALL_STUDENTS");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [classNumber, setClassNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      message,
      subject,
      recipientType,
      recipientId:
        recipientType === "INDIVIDUAL" ? Number(receiverId) : null,
      classNumber:
        recipientType === "CLASS" ? Number(classNumber) : null,
      sender: localStorage.getItem("userName") || "TEACHER",
    };

    try {
      setIsLoading(true);

      const res = await fetch(
        "http://localhost:8080/api/notifications/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (res.ok) {
        alert("✅ Notification Sent!");
        resetForm();
      } else {
        alert("❌ Failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setSubject("");
    setReceiverId("");
    setClassNumber("");
    setRecipientType("ALL_STUDENTS");
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-xl">
      <CardHeader className="bg-green-600 text-white p-4">
        <Typography variant="h5">
          Teacher Notification Panel
        </Typography>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Recipient */}
          <div>
            <Typography variant="small">Recipient Type</Typography>
            <Select
              value={recipientType}
              onChange={(val) => setRecipientType(val)}
            >
              <Option value="ALL_STUDENTS">ALL STUDENTS</Option>
              <Option value="CLASS">CLASS</Option>
              <Option value="INDIVIDUAL">INDIVIDUAL</Option>
            </Select>
          </div>

          {/* CLASS */}
          {recipientType === "CLASS" && (
            <Input
              label="Class Number (e.g. 1,2,3)"
              value={classNumber}
              onChange={(e) => setClassNumber(e.target.value)}
              required
            />
          )}

          {/* INDIVIDUAL */}
          {recipientType === "INDIVIDUAL" && (
            <Input
              label="Student ID (numeric)"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
            />
          )}

          {/* Title */}
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Message */}
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Message"
            rows="4"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />

          {/* Subject */}
          <Input
            label="Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />

          {/* Button */}
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading ? <Spinner /> : "SEND"}
          </Button>

        </form>
      </CardBody>
    </Card>
  );
};

export default TeacherNotification;