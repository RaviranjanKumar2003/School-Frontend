// import React from "react";

// const classes = [
//   {
//     id: 1,
//     subject: "Mathematics",
//     teacher: "Prof. Sharma",
//     time: "10:00 AM - 11:00 AM",
//     status: "LIVE",
//     link: "https://meet.google.com/abc-xyz",
//   },
//   {
//     id: 2,
//     subject: "Computer Science",
//     teacher: "Prof. Verma",
//     time: "12:00 PM - 1:00 PM",
//     status: "UPCOMING",
//     link: "https://meet.google.com/def-xyz",
//   },
//   {
//     id: 3,
//     subject: "English",
//     teacher: "Prof. Singh",
//     time: "2:00 PM - 3:00 PM",
//     status: "ENDED",
//     link: "",
//   },
// ];

// const LiveClass = () => {
//   return (
//     <div className="p-6 min-h-screen bg-gray-100">

//       {/* 🔥 HEADER */}
//       <h1 className="text-2xl font-bold mb-6">🎥 Live Classes</h1>

//       {/* 🔥 CLASS LIST */}
//       <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

//         {classes.map((cls) => (
//           <div
//             key={cls.id}
//             className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
//           >

//             {/* SUBJECT */}
//             <h2 className="text-lg font-semibold">{cls.subject}</h2>

//             {/* TEACHER */}
//             <p className="text-gray-500 text-sm mt-1">
//               👨‍🏫 {cls.teacher}
//             </p>

//             {/* TIME */}
//             <p className="text-gray-400 text-sm mt-1">
//               🕒 {cls.time}
//             </p>

//             {/* STATUS */}
//             <div className="mt-3">
//               {cls.status === "LIVE" && (
//                 <span className="text-green-600 font-semibold text-sm">
//                   🔴 Live Now
//                 </span>
//               )}
//               {cls.status === "UPCOMING" && (
//                 <span className="text-yellow-500 font-semibold text-sm">
//                   ⏳ Upcoming
//                 </span>
//               )}
//               {cls.status === "ENDED" && (
//                 <span className="text-gray-400 font-semibold text-sm">
//                   ❌ Ended
//                 </span>
//               )}
//             </div>

//             {/* BUTTON */}
//             <div className="mt-4">
//               {cls.status === "LIVE" ? (
//                 <a
//                   href={cls.link}
//                   target="_blank"
//                   rel="noreferrer"
//                   className="block text-center bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition"
//                 >
//                   Join Now
//                 </a>
//               ) : cls.status === "UPCOMING" ? (
//                 <button
//                   disabled
//                   className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg cursor-not-allowed"
//                 >
//                   Not Started
//                 </button>
//               ) : (
//                 <button
//                   disabled
//                   className="w-full bg-gray-200 text-gray-500 py-2 rounded-lg cursor-not-allowed"
//                 >
//                   Class Ended
//                 </button>
//               )}
//             </div>

//           </div>
//         ))}

//       </div>

//     </div>
//   );
// };

// export default LiveClass;







//updated 


import React, {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Video,
  Bell,
  Users,
  Clock3,
  Send,
} from "lucide-react";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";

axios.defaults.withCredentials = false;

const API =
  "http://localhost:8080/api";

const LiveClass = () => {

  // ================= USER =================

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const currentUserName =
    storedUser.name || "Student";

  const studentClass =
    storedUser.className ||
    storedUser.studentClass ||
    "";

  // ================= STATES =================

  const [isConnected, setIsConnected] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [chat, setChat] = useState([]);

  const [notification, setNotification] =
    useState("");

  const [sessionInfo, setSessionInfo] =
    useState({
      id: null,
      topic: "Waiting for Live Class",
      description: "",
      professorName: "",
      className: "",
      meetingLink: "",
      scheduledDate: "",
      scheduledTime: "",
      active: false,
      participants: 0,
    });

  const stompClient = useRef(null);

  // ================= INITIAL LOAD =================

  useEffect(() => {

    if (studentClass) {

      fetchCurrentSession(studentClass);

      connectWebSocket();
    }

    return () => {

      if (
        stompClient.current &&
        stompClient.current.connected
      ) {

        stompClient.current.disconnect(() => {

          console.log(
            "Disconnected safely"
          );
        });
      }
    };

  }, []);

  // ================= FETCH CURRENT SESSION =================

  const fetchCurrentSession =
    async (className) => {

      try {

        const res = await axios.get(
          `${API}/live/current/${className}`
        );

        if (res.data) {

          setSessionInfo(res.data);
        }

      } catch (err) {

        console.log(
          "No live session"
        );
      }
    };

  // ================= WEBSOCKET =================

  const connectWebSocket = () => {

    const socket = new SockJS(
      "http://localhost:8080/ws-live"
    );

    stompClient.current =
      Stomp.over(socket);

    stompClient.current.debug = null;

    stompClient.current.connect(
      {},
      () => {

        setIsConnected(true);

        console.log(
          "WebSocket Connected"
        );

        // ================= LIVE CLASS NOTIFICATION =================

        stompClient.current.subscribe(
          `/topic/live/${studentClass}`,
          (payload) => {

            const liveData =
              JSON.parse(
                payload.body
              );

            setSessionInfo(liveData);

            // ================= BROWSER NOTIFICATION =================

            if (
              Notification.permission ===
              "granted"
            ) {

              new Notification(
                "New Live Class Started",
                {
                  body: `${liveData.topic} by ${liveData.professorName}`,
                }
              );
            }

            setNotification(
              `Professor ${liveData.professorName} started a live class`
            );
          }
        );

        // ================= CHAT =================

        stompClient.current.subscribe(
          "/topic/messages",
          (payload) => {

            const msg =
              JSON.parse(
                payload.body
              );

            setChat((prev) => [
              ...prev,
              msg,
            ]);
          }
        );
      },
      (err) => {

        console.error(err);

        setIsConnected(false);
      }
    );
  };

  // ================= ENABLE NOTIFICATION =================

  useEffect(() => {

    if (
      "Notification" in window
    ) {

      Notification.requestPermission();
    }

  }, []);

  // ================= JOIN CLASS =================

  const handleJoinClass =
    async () => {

      try {

        if (!sessionInfo.id)
          return;

        await axios.put(
          `${API}/live/join/${sessionInfo.id}`
        );

        window.open(
          sessionInfo.meetingLink,
          "_blank"
        );

      } catch (err) {

        console.error(err);
      }
    };

  // ================= SEND MESSAGE =================

  const handleSendMessage = (
    e
  ) => {

    e.preventDefault();

    if (
      !message.trim() ||
      !isConnected
    ) {
      return;
    }

    const chatMessage = {

      sender:
        currentUserName,

      content: message,

      timestamp:
        new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute:
              "2-digit",
          }
        ),
    };

    if (
      stompClient.current &&
      stompClient.current.connected
    ) {

      stompClient.current.send(
        "/app/chat.sendMessage",
        {},
        JSON.stringify(chatMessage)
      );
    }

    setMessage("");
  };

  return (

    <div className="min-h-screen bg-slate-100 p-5">

      {/* ================= HEADER ================= */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-5 mb-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">

              <Video size={28} />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-800">
                Student Live Classroom
              </h1>

              <p className="text-slate-500 text-sm mt-1">
                Attend live classes instantly
              </p>

            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-3 flex-wrap">

            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-4 py-2 rounded-xl">

              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  isConnected
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              />

              <span
                className={`text-sm font-medium ${
                  isConnected
                    ? "text-green-700"
                    : "text-red-600"
                }`}
              >
                {isConnected
                  ? "Connected"
                  : "Disconnected"}
              </span>
            </div>

          </div>
        </div>
      </div>

      {/* ================= NOTIFICATION ================= */}

      {notification && (

        <div className="mb-5 bg-blue-50 border border-blue-200 rounded-2xl p-4 flex items-center gap-3">

          <Bell
            className="text-blue-600"
            size={22}
          />

          <p className="text-blue-700 font-medium">
            {notification}
          </p>

        </div>
      )}

      {/* ================= LIVE CARD ================= */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center">

        <div className="w-28 h-28 rounded-full bg-red-500 mx-auto flex items-center justify-center text-white shadow-lg animate-pulse">

          <Video size={55} />

        </div>

        <h2 className="text-4xl font-bold text-slate-800 mt-8">

          {sessionInfo.topic}

        </h2>

        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">

          {sessionInfo.description ||
            "No live class available"}

        </p>

        {/* CLASS */}

        {sessionInfo.className && (

          <div className="mt-5 text-lg font-semibold text-blue-600">

            Class :
            {" "}
            {sessionInfo.className}

          </div>
        )}

        {/* PROFESSOR */}

        {sessionInfo.professorName && (

          <div className="mt-3 text-slate-700 font-medium">

            By :
            {" "}
            {sessionInfo.professorName}

          </div>
        )}

        {/* DATE TIME */}

        {(sessionInfo.scheduledDate ||
          sessionInfo.scheduledTime) && (

          <div className="mt-5 flex flex-wrap items-center justify-center gap-5 text-slate-600">

            <div className="flex items-center gap-2">

              <Clock3 size={18} />

              {sessionInfo.scheduledDate}

            </div>

            <div className="flex items-center gap-2">

              <Clock3 size={18} />

              {sessionInfo.scheduledTime}

            </div>

          </div>
        )}

        {/* PARTICIPANTS */}

        <div className="mt-5 flex justify-center items-center gap-2 text-slate-600">

          <Users size={20} />

          <span>
            {sessionInfo.participants || 0}
            {" "}
            Students Joined
          </span>

        </div>

        {/* JOIN BUTTON */}

        {sessionInfo.meetingLink && (

          <button
            onClick={handleJoinClass}
            className="mt-8 px-10 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-lg transition-all"
          >
            Join Live Class
          </button>
        )}
      </div>

      {/* ================= CHAT ================= */}

      <div className="mt-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-5">

        <h2 className="text-2xl font-bold text-slate-800 mb-5">

          Live Chat

        </h2>

        {/* CHAT LIST */}

        <div className="h-[300px] overflow-y-auto bg-slate-50 rounded-2xl p-4 space-y-4">

          {chat.length === 0 ? (

            <div className="text-slate-400 text-center mt-24">
              No messages yet
            </div>

          ) : (

            chat.map((msg, index) => (

              <div
                key={index}
                className="bg-white rounded-2xl p-3 shadow-sm border border-slate-100"
              >

                <div className="flex items-center justify-between mb-1">

                  <span className="font-semibold text-blue-600">

                    {msg.sender}

                  </span>

                  <span className="text-xs text-slate-400">

                    {msg.timestamp}

                  </span>

                </div>

                <p className="text-slate-700">
                  {msg.content}
                </p>

              </div>
            ))
          )}
        </div>

        {/* MESSAGE FORM */}

        <form
          onSubmit={
            handleSendMessage
          }
          className="mt-5 flex gap-3"
        >

          <input
            type="text"
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            placeholder="Type message..."
            className="flex-1 border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-2xl shadow-lg transition-all flex items-center justify-center"
          >

            <Send size={20} />

          </button>

        </form>
      </div>
    </div>
  );
};

export default LiveClass;