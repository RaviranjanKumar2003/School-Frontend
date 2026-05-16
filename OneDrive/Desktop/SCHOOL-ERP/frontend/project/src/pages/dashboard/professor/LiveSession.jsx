// import React, { useState, useEffect, useRef } from 'react';
// import { Video, Send, Users, Mic, MicOff, VideoOff, PhoneOff, MessageSquare } from 'lucide-react';
// import SockJS from 'sockjs-client';
// import Stomp from 'stompjs';
// import axios from 'axios';

// // CORS credentials support
// axios.defaults.withCredentials = true;

// const LiveSession = () => {
//   const [message, setMessage] = useState("");
//   const [chat, setChat] = useState([]);
//   const [sessionInfo, setSessionInfo] = useState({ topic: "Loading...", professor: "Professor" });
//   const [isConnected, setIsConnected] = useState(false);
//   const stompClient = useRef(null);

//   // --- DYNAMIC USER LOGIC ---
//   // Maan lijiye aapka user data localStorage mein 'user' key ke andar hai
//   const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
//   const currentUserName = storedUser.name || "Professor"; 

//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         const res = await axios.get('http://localhost:8080/api/live/current');
//         setSessionInfo(res.data);
//       } catch (err) {
//         console.error("Error fetching session:", err);
//       }
//     };

//     fetchSession();
//     connectWebSocket();

//     return () => {
//       if (stompClient.current && stompClient.current.connected) {
//         stompClient.current.disconnect(() => console.log("Safe Disconnect"));
//       }
//     };
//   }, []);

//   const connectWebSocket = () => {
//     const socket = new SockJS('http://localhost:8080/ws-live');
//     stompClient.current = Stomp.over(socket);
//     stompClient.current.debug = null; // Console saaf rakhne ke liye

//     stompClient.current.connect({}, () => {
//       setIsConnected(true);
//       stompClient.current.subscribe('/topic/messages', (payload) => {
//         const msg = JSON.parse(payload.body);
//         setChat((prev) => [...prev, msg]);
//       });
//     }, (err) => {
//       setIsConnected(false);
//       console.error("WS Connection Error", err);
//     });
//   };

//   const handleSendMessage = (e) => {
//     e.preventDefault();
//     if (message.trim() && isConnected) {
//       const chatMessage = {
//         sender: currentUserName, // Ab ye hardcoded nahi hai
//         content: message,
//         timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
//       };
//       stompClient.current.send("/app/chat.sendMessage", {}, JSON.stringify(chatMessage));
//       setMessage("");
//     }
//   };

//   return (
//     <div className="flex flex-col h-screen bg-gray-50 p-4">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4 bg-white p-4 rounded-lg shadow-sm border border-gray-100">
//         <div>
//           <h2 className="text-xl font-bold text-gray-800">{sessionInfo.topic}</h2>
//           <p className="text-sm flex items-center gap-1">
//             <span className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
//             <span className={isConnected ? "text-green-600" : "text-red-400"}>
//               {isConnected ? "Live Session Active" : "Connecting to server..."}
//             </span>
//           </p>
//         </div>
//         <button className="bg-red-500 text-white px-5 py-2 rounded-md hover:bg-red-600 flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-red-100 font-medium">
//           <PhoneOff size={18} /> End Session
//         </button>
//       </div>

//       <div className="flex flex-1 gap-4 overflow-hidden">
//         {/* Video Side */}
//         <div className="flex-[3] bg-slate-900 rounded-2xl relative flex flex-col items-center justify-center text-white shadow-xl">
//           <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-lg text-sm border border-white/10">
//              Instructor: <span className="font-semibold">{sessionInfo.professor}</span>
//           </div>
          
//           <div className="flex flex-col items-center">
//              <Video size={64} className={`${isConnected ? 'text-blue-400' : 'text-slate-700 animate-pulse'}`} />
//              <p className="text-slate-400 mt-4 font-light italic">
//                 {isConnected ? "You are now broadcasting live" : "Establishing secure stream..."}
//              </p>
//           </div>

//           <div className="absolute bottom-8 flex gap-6 bg-slate-800/80 backdrop-blur-md p-4 rounded-full border border-white/5">
//             <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-all"><Mic size={22} /></button>
//             <button className="p-3 bg-slate-700 hover:bg-slate-600 rounded-full transition-all"><Video size={22} /></button>
//             <button className="p-3 bg-blue-600 hover:bg-blue-500 rounded-full px-10 text-sm font-bold uppercase tracking-widest shadow-lg shadow-blue-500/20">Share Screen</button>
//           </div>
//         </div>

//         {/* Chat Side */}
//         <div className="flex-1 flex flex-col gap-4">
//           <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
//             <div className="p-4 border-b bg-gray-50/50 flex items-center gap-2 font-bold text-gray-600">
//               <MessageSquare size={18} className="text-blue-500" /> Discussion
//             </div>
            
//             <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
//               {chat.length === 0 && (
//                 <div className="h-full flex items-center justify-center text-gray-400 text-sm italic">
//                   No messages in this session yet.
//                 </div>
//               )}
//               {chat.map((msg, index) => (
//                 <div key={index} className={`flex flex-col ${msg.sender === currentUserName ? "items-end" : "items-start"}`}>
//                   <div className="flex items-center gap-2 mb-1 px-1">
//                     <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">{msg.sender}</span>
//                     <span className="text-[9px] text-gray-300">{msg.timestamp}</span>
//                   </div>
//                   <p className={`p-3 rounded-2xl text-sm max-w-[90%] shadow-sm leading-relaxed ${
//                     msg.sender === currentUserName 
//                     ? "bg-blue-600 text-white rounded-tr-none" 
//                     : "bg-white text-gray-700 border border-gray-100 rounded-tl-none"
//                   }`}>
//                     {msg.content}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             <form onSubmit={handleSendMessage} className="p-4 bg-white border-t flex gap-2">
//               <input 
//                 type="text" 
//                 placeholder={isConnected ? "Send a message..." : "Reconnecting..."}
//                 disabled={!isConnected}
//                 className="flex-1 border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 transition-all outline-none bg-gray-50/50 disabled:cursor-not-allowed"
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//               />
//               <button 
//                 type="submit" 
//                 disabled={!isConnected}
//                 className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 active:scale-95 transition-all shadow-md disabled:bg-gray-300"
//               >
//                 <Send size={20} />
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default LiveSession;



//updated






import React, {
  useState,
  useEffect,
  useRef,
} from "react";

import {
  Video,
  Send,
  Calendar,
  Clock3,
  Plus,
} from "lucide-react";

import SockJS from "sockjs-client";
import Stomp from "stompjs";
import axios from "axios";

axios.defaults.withCredentials = false;

const API =
  "http://localhost:8080/api";

const LiveSession = () => {

  // ================= USER =================

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const currentUserName =
    storedUser.name || "Professor";

  const currentRole =
    storedUser.role || "TEACHER";

  const studentClass =
    storedUser.className ||
    storedUser.studentClass ||
    "";

  // ================= STATES =================

  const [message, setMessage] =
    useState("");

  const [chat, setChat] =
    useState([]);

  const [classes, setClasses] =
    useState([]);

  const [isConnected, setIsConnected] =
    useState(false);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const [sessionInfo, setSessionInfo] =
    useState({
      id: null,
      topic: "No Active Session",
      description: "",
      professorName: "",
      className: "",
      meetingLink: "",
      active: false,
      participants: 0,
    });

  const [liveForm, setLiveForm] =
    useState({
      topic: "",
      description: "",
      className: "",
      meetingLink: "",
      scheduledDate: "",
      scheduledTime: "",
    });

  const stompClient = useRef(null);

  // ================= INITIAL LOAD =================

  useEffect(() => {

    fetchClasses();

    connectWebSocket();

    if (studentClass) {
      fetchCurrentSession(studentClass);
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

  // ================= FETCH CLASSES =================

  const fetchClasses = async () => {

    try {

      const res = await axios.get(
        `${API}/classes`
      );

      console.log(
        "Classes Response:",
        res.data
      );

      if (Array.isArray(res.data)) {

        setClasses(res.data);

      } else {

        setClasses([]);
      }

    } catch (err) {

      console.error(
        "Failed to fetch classes",
        err
      );
    }
  };

  // ================= FETCH CURRENT SESSION =================

  const fetchCurrentSession =
    async (className) => {

      try {

        if (!className) return;

        const res = await axios.get(
          `${API}/live/current/${className}`
        );

        if (res.data) {

          setSessionInfo(res.data);
        }

      } catch (err) {

        console.log(
          "No active session"
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

    stompClient.current.debug =
      null;

    stompClient.current.connect(
      {},
      () => {

        setIsConnected(true);

        console.log(
          "WebSocket Connected"
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

        // ================= STUDENT LIVE =================

        if (studentClass) {

          stompClient.current.subscribe(
            `/topic/live/${studentClass}`,
            (payload) => {

              const liveData =
                JSON.parse(
                  payload.body
                );

              setSessionInfo(
                liveData
              );
            }
          );
        }
      },
      (err) => {

        console.error(
          "WS ERROR",
          err
        );

        setIsConnected(false);
      }
    );
  };

  // ================= CREATE LIVE CLASS =================

  const handleCreateLiveClass =
    async () => {

      try {

        if (
          !liveForm.topic.trim() ||
          !liveForm.className.trim() ||
          !liveForm.meetingLink.trim()
        ) {

          alert(
            "Topic, Class Name and Meet Link are required"
          );

          return;
        }

        const payload = {

          topic:
            liveForm.topic,

          description:
            liveForm.description,

          className:
            liveForm.className,

          meetingLink:
            liveForm.meetingLink,

          scheduledDate:
            liveForm.scheduledDate || null,

          scheduledTime:
            liveForm.scheduledTime || null,

          professorName:
            currentUserName,
        };

        console.log(
          "Sending Payload:",
          payload
        );

        const res = await axios.post(
          `${API}/live/create`,
          payload,
          {
            headers: {
              "Content-Type":
                "application/json",
            },
          }
        );

        console.log(
          "Create Response:",
          res.data
        );

        setSessionInfo(res.data);

        setShowCreateModal(false);

        alert(
          "Live class created successfully"
        );

        setLiveForm({
          topic: "",
          description: "",
          className: "",
          meetingLink: "",
          scheduledDate: "",
          scheduledTime: "",
        });

      } catch (err) {

        console.error(
          "CREATE ERROR:",
          err
        );

        console.log(
          "Backend Error:",
          err?.response?.data
        );

        alert(
          err?.response?.data?.message ||
          err?.response?.data ||
          "Failed to create live class"
        );
      }
    };

  // ================= END SESSION =================

  const handleEndSession =
    async () => {

      try {

        await axios.put(
          `${API}/live/end/${sessionInfo.id}`
        );

        setSessionInfo({
          id: null,
          topic: "No Active Session",
          description: "",
          professorName: "",
          className: "",
          meetingLink: "",
          active: false,
          participants: 0,
        });

        setChat([]);

        alert("Live class ended");

      } catch (err) {

        console.error(err);
      }
    };

  // ================= JOIN LIVE CLASS =================

  const joinLiveClass =
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

      {/* HEADER */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm px-6 py-5 mb-5">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

          {/* LEFT */}

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg">

              <Video size={28} />

            </div>

            <div>

              <h1 className="text-3xl font-bold text-slate-800">
                Smart Live Classroom
              </h1>

              <p className="text-slate-500 text-sm mt-1">
                Interactive live teaching platform
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
                  ? "Server Connected"
                  : "Disconnected"}
              </span>
            </div>

            {currentRole ===
              "TEACHER" && (

              <button
                onClick={() =>
                  setShowCreateModal(
                    true
                  )
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-semibold transition-all shadow-lg flex items-center gap-2"
              >

                <Plus size={18} />

                Create Live Class

              </button>
            )}
          </div>
        </div>
      </div>

      {/* MAIN */}

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-10 text-center min-h-[400px] flex flex-col justify-center">

        <div className="w-28 h-28 rounded-full bg-blue-600 mx-auto flex items-center justify-center text-white shadow-lg">

          <Video size={55} />

        </div>

        <h2 className="text-4xl font-bold text-slate-800 mt-8">
          {sessionInfo.topic}
        </h2>

        <p className="text-slate-500 mt-4 max-w-2xl mx-auto text-lg">

          {sessionInfo.description ||
            "Interactive live classroom"}

        </p>

        {sessionInfo.className && (

          <div className="mt-5 text-lg font-semibold text-blue-600">

            Class :
            {" "}
            {sessionInfo.className}

          </div>
        )}

        {sessionInfo.meetingLink && (

          <button
            onClick={joinLiveClass}
            className="mt-8 px-8 py-4 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-bold text-lg shadow-lg transition-all mx-auto"
          >
            Join Live Class
          </button>
        )}
      </div>

      {/* CREATE MODAL */}

      {showCreateModal && (

        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm overflow-y-auto">

          <div className="min-h-screen flex items-center justify-center p-5">

            <div className="w-full max-w-2xl rounded-3xl bg-white border border-slate-200 p-8 shadow-2xl my-10 max-h-[95vh] overflow-y-auto">

              {/* HEADER */}

              <div className="flex items-center justify-between mb-8">

                <div>

                  <h2 className="text-3xl font-bold text-slate-800">
                    Create Live Class
                  </h2>

                  <p className="text-slate-500 mt-1">
                    Schedule and start your online class
                  </p>

                </div>

                <div className="p-4 rounded-2xl bg-blue-600 text-white">

                  <Video size={28} />

                </div>
              </div>

              {/* FORM */}

              <div className="space-y-5">

                {/* TOPIC */}

                <div>

                  <label className="text-sm text-slate-700 mb-2 block font-medium">
                    Class Topic
                  </label>

                  <input
                    type="text"
                    value={liveForm.topic}
                    onChange={(e) =>
                      setLiveForm({
                        ...liveForm,
                        topic:
                          e.target.value,
                      })
                    }
                    placeholder="Enter class topic"
                    className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* DESCRIPTION */}

                <div>

                  <label className="text-sm text-slate-700 mb-2 block font-medium">
                    Description
                  </label>

                  <textarea
                    rows={4}
                    value={
                      liveForm.description
                    }
                    onChange={(e) =>
                      setLiveForm({
                        ...liveForm,
                        description:
                          e.target.value,
                      })
                    }
                    placeholder="Write class description..."
                    className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* CLASS DROPDOWN */}

                <div>

                  <label className="text-sm text-slate-700 mb-2 block font-medium">
                    Select Class
                  </label>

                  <select
                    value={
                      liveForm.className
                    }
                    onChange={(e) =>
                      setLiveForm({
                        ...liveForm,
                        className:
                          e.target.value,
                      })
                    }
                    className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                  >

                    <option value="">
                      Select Class
                    </option>

                    {classes &&
                      classes.length > 0 &&
                      classes.map((cls) => (

                        <option
                          key={cls.id}
                          value={
                            cls.className
                          }
                        >
                          {cls.className}
                        </option>
                      ))}
                  </select>

                </div>

                {/* MEET LINK */}

                <div>

                  <label className="text-sm text-slate-700 mb-2 block font-medium">
                    Google Meet Link
                  </label>

                  <input
                    type="text"
                    value={
                      liveForm.meetingLink
                    }
                    onChange={(e) =>
                      setLiveForm({
                        ...liveForm,
                        meetingLink:
                          e.target.value,
                      })
                    }
                    placeholder="Paste Google Meet link"
                    className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* DATE & TIME */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>

                    <label className="text-sm text-slate-700 mb-2 flex items-center gap-2 font-medium">

                      <Calendar size={16} />

                      Schedule Date

                    </label>

                    <input
                      type="date"
                      value={
                        liveForm.scheduledDate
                      }
                      onChange={(e) =>
                        setLiveForm({
                          ...liveForm,
                          scheduledDate:
                            e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>

                    <label className="text-sm text-slate-700 mb-2 flex items-center gap-2 font-medium">

                      <Clock3 size={16} />

                      Schedule Time

                    </label>

                    <input
                      type="time"
                      value={
                        liveForm.scheduledTime
                      }
                      onChange={(e) =>
                        setLiveForm({
                          ...liveForm,
                          scheduledTime:
                            e.target.value,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* BUTTONS */}

                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-5">

                  <button
                    onClick={() =>
                      setShowCreateModal(
                        false
                      )
                    }
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium transition-all"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={
                      handleCreateLiveClass
                    }
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-all shadow-lg"
                  >
                    Create & Go Live
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSession;