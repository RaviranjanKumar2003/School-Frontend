// import { useState } from "react";
// import {
//   Card,
//   CardBody,
//   CardHeader,
//   Button,
//   Input,
//   Typography,
//   Select,
//   Option,
//   Spinner,
// } from "@material-tailwind/react";

// const NotificationSender = () => {
//   const [recipientType, setRecipientType] = useState("STUDENT"); // Default to stuśdents
//   const [title, setTitle] = useState("");
//   const [message, setMessage] = useState("");
//   const [subject, setSubject] = useState(""); // New field for subject
//   const [timestamp, setTimestamp] = useState(new Date().toISOString()); // Default to current time
//   const [readStatus, setReadStatus] = useState(false); // Default to false
//   const [sender, setSender] = useState(""); // New field for sender
//   const [isLoading, setIsLoading] = useState(false);

//   const handleRecipientTypeChange = (value) => {
//     setRecipientType(value);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const notificationData = {
//       title: title,
//       message: message,
//       subject: subject,
//       timestamp: timestamp,
//       readStatus: readStatus,
//       recipientType: recipientType,
//       sender: sender,
//     };

//     try {
//       setIsLoading(true);
//       // Replace with your API endpoint
//       const response = await fetch(
//         "http://localhost:8080/api/notifications/send",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(notificationData),
//         }
//       );

//       if (response.ok) {
//         alert("Notification sent successfully!");
//         resetForm();
//       } else {
//         alert("Failed to send notification.");
//       }
//     } catch (error) {
//       console.error("Error sending notification:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const resetForm = () => {
//     setTitle("");
//     setMessage("");
//     setSubject("");
//     setTimestamp(new Date().toISOString()); // Reset to current time
//     setReadStatus(false);
//     setSender("");
//     setRecipientType("STUDENT");
//   };

//   return (
//     <Card className="max-w-lg mx-auto mt-12 shadow-lg border border-gray-100">
//       <CardHeader className="bg-blue-600 text-white p-4">
//         <Typography variant="h5" className="font-semibold">
//           Send Notification
//         </Typography>
//       </CardHeader>
//       <CardBody>
//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div>
//             <Typography
//               variant="small"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Recipient Type
//             </Typography>
//             <Select
//               value={recipientType}
//               onChange={(value) => handleRecipientTypeChange(value)}
//               className="w-full"
//             >
//               <Option value="STUDENT">ALL_STUDENTS</Option>
//               <Option value="STUDENT">STUDENT</Option>
//               <Option value="PROFESSOR">ALL_PROFESSORS</Option>
//               <Option value="PROFESSOR">PROFESSOR</Option>
//               <Option value="BOTH">ALL_STUDENTS_AND_PROFESSORS</Option>
//             </Select>
//           </div>

//           <div>
//             <Typography
//               variant="small"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Notification Title
//             </Typography>
//             <Input
//               type="text"
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               placeholder="Enter notification title"
//               required
//               className="w-full"
//             />
//           </div>

//           <div>
//             <Typography
//               variant="small"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Message
//             </Typography>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Enter your message"
//               rows="4"
//               required
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//             />
//           </div>

//           <div>
//             <Typography
//               variant="small"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Subject
//             </Typography>
//             <Input
//               type="text"
//               value={subject}
//               onChange={(e) => setSubject(e.target.value)}
//               placeholder="Enter subject"
//               className="w-full"
//             />
//           </div>

//           <div>
//             <Typography
//               variant="small"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Timestamp
//             </Typography>
//             <Input
//               type="datetime-local"
//               value={timestamp}
//               onChange={(e) => setTimestamp(e.target.value)}
//               className="w-full"
//             />
//           </div>

//           <div>
//             <Typography
//               variant="small"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Sender
//             </Typography>
//             <Input
//               type="text"
//               value={sender}
//               onChange={(e) => setSender(e.target.value)}
//               placeholder="Enter sender name"
//               className="w-full"
//             />
//           </div>

//           <div>
//             <Button
//               type="submit"
//               color="blue"
//               fullWidth
//               className="flex items-center justify-center"
//               disabled={isLoading}
//             >
//               {isLoading ? (
//                 <Spinner className="h-5 w-5" />
//               ) : (
//                 "Send Notification"
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardBody>
//     </Card>
//   );
// };

// export default NotificationSender;


//after update 

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

const NotificationSender = () => {
  const [recipientType, setRecipientType] = useState("ALL_STUDENTS");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const notificationData = {
      title,
      message,
      subject,
      recipientType,
      receiverId: recipientType === "INDIVIDUAL" ? receiverId : null,
      sender: localStorage.getItem("userName") || "HOD",
      timestamp: new Date().toISOString(),
      readStatus: false,
    };

    try {
      setIsLoading(true);

      const response = await fetch(
        "http://localhost:8080/api/notifications/send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(notificationData),
        }
      );

      if (response.ok) {
        alert("✅ Notification Sent Successfully!");
        resetForm();
      } else {
        alert("❌ Failed to send notification");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setMessage("");
    setSubject("");
    setReceiverId("");
    setRecipientType("ALL_STUDENTS");
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 shadow-lg">
      <CardHeader className="bg-blue-600 text-white p-4">
        <Typography variant="h5">Send Notification</Typography>
      </CardHeader>

      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Recipient */}
          <div>
            <Typography variant="small" className="mb-2">
              Recipient Type
            </Typography>
            <Select
              value={recipientType}
              onChange={(val) => setRecipientType(val)}
            >
              <Option value="ALL_STUDENTS">ALL STUDENTS</Option>
              <Option value="ALL_TEACHERS">ALL TEACHERS</Option>
              <Option value="ALL">ALL (Students + Teachers)</Option>
              <Option value="INDIVIDUAL">INDIVIDUAL</Option>
            </Select>
          </div>

          {/* Individual Field */}
          {recipientType === "INDIVIDUAL" && (
            <Input
              label="Receiver ID / Email"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              required
            />
          )}

          {/* Title */}
          <Input
            label="Notification Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Message */}
          <textarea
            className="w-full border p-2 rounded"
            placeholder="Enter Message"
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
            {isLoading ? <Spinner className="h-5 w-5" /> : "Send Notification"}
          </Button>

        </form>
      </CardBody>
    </Card>
  );
};

export default NotificationSender;