// import React, { useEffect, useState } from "react";
// import axios from "axios";

// export default function StudentEvents() {

//   const [events, setEvents] = useState([]);
//   const [reactions, setReactions] = useState({});
//   const [comments, setComments] = useState({});
//   const [activeReact, setActiveReact] = useState(null);
//   const [showComment, setShowComment] = useState(null);
//   const [showView, setShowView] = useState(null);
//   const [viewType, setViewType] = useState({});
//   const [comment, setComment] = useState({});
//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState("");

//   const studentId = localStorage.getItem("id");
//   const studentName = localStorage.getItem("name");

//   useEffect(() => {
//     loadEvents();
//   }, []);



//   useEffect(() => {
//   const id = localStorage.getItem("id");

//   fetch(`http://localhost:8080/api/students/by-id/${id}`)
//     .then(res => res.json())
//     .then(data => {
//       localStorage.setItem(
//         "name",
//         data.studName + " " + data.studLastName
//       );
//     });
//   }, []);

//   const loadEvents = async () => {
//     const res = await axios.get("http://localhost:8080/api/events/student");
//     setEvents(res.data);

//     for (let e of res.data) {
//       loadReactions(e.id);
//       loadComments(e.id);
//     }
//   };

//   const loadReactions = async (eventId) => {
//     const res = await axios.get(
//       `http://localhost:8080/api/events/reactions/${eventId}`
//     );

//     setReactions(prev => ({
//       ...prev,
//       [eventId]: res.data
//     }));
//   };

//   const loadComments = async (eventId) => {
//     const res = await axios.get(
//       `http://localhost:8080/api/events/comments/${eventId}`
//     );

//     setComments(prev => ({
//       ...prev,
//       [eventId]: res.data
//     }));
//   };

//   const sendReact = async (eventId, type) => {
//     await axios.post("http://localhost:8080/api/events/react", {
//       eventId,
//       studentId,
//       studentName,
//       studentImage: `http://localhost:8080/api/students/image/get/${studentId}`,
//       type
//     });

//     loadReactions(eventId);
//     setActiveReact(null);
//   };

//   const sendComment = async (eventId) => {
//     if (!comment[eventId]) return;

//     await axios.post("http://localhost:8080/api/events/comment", {
//       eventId,
//       studentId,
//       studentName,
//       studentImage: `http://localhost:8080/api/students/image/get/${studentId}`,
//       comment: comment[eventId]
//     });

//     setComment({ ...comment, [eventId]: "" });
//     loadComments(eventId);
//   };

//   const deleteComment = async (id, eventId) => {
//     await axios.delete(
//       `http://localhost:8080/api/events/comment/${id}?studentId=${studentId}`
//     );
//     loadComments(eventId);
//   };

//   const updateComment = async (id, eventId) => {
//     await axios.put(
//     `http://localhost:8080/api/events/comment/${id}?studentId=${studentId}`,
//     { comment: editText }
//     );

//     setEditingId(null);
//     setEditText("");
//     loadComments(eventId);
//   };

//   const emojis = [
//     { icon: "👍", type: "LIKE" },
//     { icon: "❤️", type: "LOVE" },
//     { icon: "😂", type: "HAHA" },
//     { icon: "😮", type: "WOW" },
//     { icon: "🔥", type: "FIRE" }
//   ];

//   const getIcon = (type) => {
//     switch (type) {
//       case "LIKE": return "👍";
//       case "LOVE": return "❤️";
//       case "HAHA": return "😂";
//       case "WOW": return "😮";
//       case "FIRE": return "🔥";
//       default: return "👍";
//     }
//   };

//   const renderAvatars = (eventId) => {
//     const list = reactions[eventId] || [];

//     return (
//       <div className="flex -space-x-2 mt-2">
//         {list.slice(0, 4).map((r, i) => (
//           <img
//             key={i}
//             src={r.studentImage}
//             className="w-8 h-8 rounded-full border-2 border-white"
//           />
//         ))}
//         {list.length > 4 && (
//           <div className="w-8 h-8 bg-gray-300 flex items-center justify-center text-xs rounded-full border-2 border-white">
//             +{list.length - 4}
//           </div>
//         )}
//       </div>
//     );
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen p-6">

//       <h1 className="text-2xl font-bold mb-6">🎓 Student Events</h1>

//       <div className="grid md:grid-cols-4 gap-6">

//         {events.map((e) => (
//           <div key={e.id} className="bg-white rounded-2xl shadow-lg p-5">

//             <div className="flex justify-between">
//               <h2 className="font-semibold">{e.title}</h2>
//               <span className="text-xs text-gray-400">{e.date}</span>
//             </div>

//             <p className="text-gray-600 text-sm">{e.description}</p>

//             {renderAvatars(e.id)}

//             {/* BUTTONS */}
//             <div className="flex justify-between mt-4">

//               {/* REACT */}
//               <div className="relative">
//                 <button
//                   onClick={() =>
//                     setActiveReact(activeReact === e.id ? null : e.id)
//                   }
//                   className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm"
//                 >
//                   React
//                 </button>

//                 {activeReact === e.id && (
//                   <div className="absolute top-10 bg-white shadow-lg px-3 py-2 rounded-full flex gap-3">
//                     {emojis.map((emo) => (
//                       <span
//                         key={emo.type}
//                         onClick={() => sendReact(e.id, emo.type)}
//                         className="text-2xl cursor-pointer hover:scale-125"
//                       >
//                         {emo.icon}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>

//               {/* COMMENT */}
//               <button
//                 onClick={() =>
//                   setShowComment(showComment === e.id ? null : e.id)
//                 }
//                 className="bg-gray-200 px-4 py-1 rounded-full text-sm"
//               >
//                 Comment
//               </button>

//               {/* VIEW */}
//               <button
//                 onClick={() =>
//                   setShowView(showView === e.id ? null : e.id)
//                 }
//                 className="bg-green-500 text-white px-4 py-1 rounded-full text-sm"
//               >
//                 View
//               </button>

//             </div>

//             {/* COMMENT BOX */}
//             {showComment === e.id && (
//               <div className="mt-3">
//                 <input
//                   className="w-full border px-3 py-2 rounded"
//                   placeholder="Write comment..."
//                   value={comment[e.id] || ""}
//                   onChange={(ev) =>
//                     setComment({ ...comment, [e.id]: ev.target.value })
//                   }
//                 />

//                 <button
//                   onClick={() => sendComment(e.id)}
//                   className="mt-2 w-full bg-blue-500 text-white py-1 rounded"
//                 >
//                   Submit
//                 </button>
//               </div>
//             )}

//             {/* VIEW PANEL */}
//             {showView === e.id && (
//               <div className="mt-4">

//                 <div className="flex gap-2 mb-3">
//                   <button
//                     onClick={() =>
//                       setViewType({ ...viewType, [e.id]: "react" })
//                     }
//                     className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm"
//                   >
//                     Reactions
//                   </button>

//                   <button
//                     onClick={() =>
//                       setViewType({ ...viewType, [e.id]: "comment" })
//                     }
//                     className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm"
//                   >
//                     Comments
//                   </button>
//                 </div>

//                 {/* REACTIONS */}
//                 {viewType[e.id] === "react" && (
//                   <div className="space-y-2">
//                     {reactions[e.id]?.map((r) => (
//                       <div className="flex justify-between bg-gray-50 p-2 rounded">
//                         <div className="flex gap-2 items-center">
//                           <img src={r.studentImage} className="w-8 h-8 rounded-full" />
//                           <span>{r.studentName}</span>
//                         </div>
//                         <span>{getIcon(r.type)}</span>
//                       </div>
//                     ))}
//                   </div>
//                 )}

//                 {/* COMMENTS */}
//                 {viewType[e.id] === "comment" && (
//                   <div className="space-y-2">
//                     {comments[e.id]?.map((c) => (
//                       <div className="bg-white p-3 rounded border">

//                         <div className="flex justify-between">
//                           <div className="flex gap-2 items-center">
//                             <img src={c.studentImage} className="w-8 h-8 rounded-full" />
//                             <span>{c.studentName}</span>
//                           </div>

//                           {c.studentId == studentId && (
//                             <div className="flex gap-2 text-xs">
//                               <button
//                                 onClick={() => {
//                                   setEditingId(c.id);
//                                   setEditText(c.comment);
//                                 }}
//                                 className="text-blue-500"
//                               >
//                                 Edit
//                               </button>

//                               <button
//                                 onClick={() => deleteComment(c.id, e.id)}
//                                 className="text-red-500"
//                               >
//                                 Delete
//                               </button>
//                             </div>
//                           )}
//                         </div>

//                         {editingId === c.id ? (
//                           <div className="mt-2">
//                             <input
//                               value={editText}
//                               onChange={(e) => setEditText(e.target.value)}
//                               className="w-full border px-2 py-1 rounded"
//                             />
//                             <button
//                               onClick={() => updateComment(c.id, e.id)}
//                               className="text-green-600 text-sm mt-1"
//                             >
//                               Save
//                             </button>
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-600 mt-1">{c.comment}</p>
//                         )}

//                       </div>
//                     ))}
//                   </div>
//                 )}

//               </div>
//             )}

//           </div>
//         ))}

//       </div>

//     </div>
//   );
// }



























import React, { useEffect, useState } from "react";
import axios from "axios";

export default function StudentEvents() {

  const [events, setEvents] = useState([]);
  const [reactions, setReactions] = useState({});
  const [comments, setComments] = useState({});
  const [activeReact, setActiveReact] = useState(null);
  const [showComment, setShowComment] = useState(null);
  const [showView, setShowView] = useState(null);
  const [viewType, setViewType] = useState({});
  const [comment, setComment] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  const studentId = localStorage.getItem("id");
  const studentName = localStorage.getItem("name");

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    const id = localStorage.getItem("id");

    fetch(`http://localhost:8080/api/students/by-id/${id}`)
      .then(res => res.json())
      .then(data => {
        localStorage.setItem(
          "name",
          data.studName + " " + data.studLastName
        );
      });
  }, []);

  const loadEvents = async () => {
    const res = await axios.get("http://localhost:8080/api/events/student");
    setEvents(res.data);

    for (let e of res.data) {
      loadReactions(e.id);
      loadComments(e.id);
    }
  };

  const loadReactions = async (eventId) => {
    const res = await axios.get(
      `http://localhost:8080/api/events/reactions/${eventId}`
    );

    setReactions(prev => ({
      ...prev,
      [eventId]: res.data
    }));
  };

  const loadComments = async (eventId) => {
    const res = await axios.get(
      `http://localhost:8080/api/events/comments/${eventId}`
    );

    setComments(prev => ({
      ...prev,
      [eventId]: res.data
    }));
  };

  const sendReact = async (eventId, type) => {
    await axios.post("http://localhost:8080/api/events/react", {
      eventId,
      studentId,
      studentName,
      studentImage: `http://localhost:8080/api/students/image/get/${studentId}`,
      type
    });

    loadReactions(eventId);
    setActiveReact(null);
  };

  const sendComment = async (eventId) => {
    if (!comment[eventId]) return;

    await axios.post("http://localhost:8080/api/events/comment", {
      eventId,
      studentId,
      studentName,
      studentImage: `http://localhost:8080/api/students/image/get/${studentId}`,
      comment: comment[eventId]
    });

    setComment({ ...comment, [eventId]: "" });
    loadComments(eventId);
  };

  const deleteComment = async (id, eventId) => {
    await axios.delete(
      `http://localhost:8080/api/events/comment/${id}?studentId=${studentId}`
    );
    loadComments(eventId);
  };

  const updateComment = async (id, eventId) => {
    await axios.put(
      `http://localhost:8080/api/events/comment/${id}?studentId=${studentId}`,
      { comment: editText }
    );

    setEditingId(null);
    setEditText("");
    loadComments(eventId);
  };

  const emojis = [
    { icon: "👍", type: "LIKE" },
    { icon: "❤️", type: "LOVE" },
    { icon: "😂", type: "HAHA" },
    { icon: "😮", type: "WOW" },
    { icon: "🔥", type: "FIRE" }
  ];

  const getIcon = (type) => {
    switch (type) {
      case "LIKE": return "👍";
      case "LOVE": return "❤️";
      case "HAHA": return "😂";
      case "WOW": return "😮";
      case "FIRE": return "🔥";
      default: return "👍";
    }
  };

  const renderAvatars = (eventId) => {
    const list = reactions[eventId] || [];

    return (
      <div className="flex -space-x-2 mt-2">
        {list.slice(0, 4).map((r, i) => (
          <img
            key={i}
            src={r.studentImage}
            className="w-8 h-8 rounded-full border-2 border-white shadow"
          />
        ))}
        {list.length > 4 && (
          <div className="w-8 h-8 bg-gray-300 flex items-center justify-center text-xs rounded-full border-2 border-white">
            +{list.length - 4}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <h1 className="text-2xl font-bold mb-6">🎓 Student Events</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        {events.map((e) => (
          <div
            key={e.id}
            className="relative bg-white rounded-2xl shadow-lg p-5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]"
          >

            <div className="flex justify-between">
              <h2 className="font-semibold">{e.title}</h2>
              <span className="text-xs text-gray-400">{e.date}</span>
            </div>

            <p className="text-gray-600 text-sm">{e.description}</p>

            {renderAvatars(e.id)}

            {/* BUTTONS */}
            <div className="flex justify-between mt-4">

              <div className="relative">
                <button
                  onClick={() =>
                    setActiveReact(activeReact === e.id ? null : e.id)
                  }
                  className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm"
                >
                  React
                </button>

                {activeReact === e.id && (
                  <div className="absolute top-10 bg-white shadow-lg px-3 py-2 rounded-full flex gap-3 z-50">
                    {emojis.map((emo) => (
                      <span
                        key={emo.type}
                        onClick={() => sendReact(e.id, emo.type)}
                        className="text-2xl cursor-pointer hover:scale-125"
                      >
                        {emo.icon}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <button
                onClick={() =>
                  setShowComment(showComment === e.id ? null : e.id)
                }
                className="bg-gray-200 px-4 py-1 rounded-full text-sm"
              >
                Comment
              </button>

              <button
                onClick={() =>
                  setShowView(showView === e.id ? null : e.id)
                }
                className="bg-green-500 text-white px-4 py-1 rounded-full text-sm"
              >
                View
              </button>
            </div>

            {/* COMMENT BOX */}
            {showComment === e.id && (
              <div className="mt-3">
                <input
                  className="w-full border px-3 py-2 rounded"
                  placeholder="Write comment..."
                  value={comment[e.id] || ""}
                  onChange={(ev) =>
                    setComment({ ...comment, [e.id]: ev.target.value })
                  }
                />
                <button
                  onClick={() => sendComment(e.id)}
                  className="mt-2 w-full bg-blue-500 text-white py-1 rounded"
                >
                  Submit
                </button>
              </div>
            )}

            {/* VIEW POPUP */}
            {showView === e.id && (
              <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-xl p-3 mt-2 z-50 max-h-60 overflow-y-auto">

                <div className="flex gap-2 mb-3">
                  <button
                    onClick={() =>
                      setViewType({ ...viewType, [e.id]: "react" })
                    }
                    className={`px-3 py-1 rounded-full text-sm ${
                      viewType[e.id] === "react"
                        ? "bg-blue-500 text-white"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    👍 Reactions
                  </button>

                  <button
                    onClick={() =>
                      setViewType({ ...viewType, [e.id]: "comment" })
                    }
                    className={`px-3 py-1 rounded-full text-sm ${
                      viewType[e.id] === "comment"
                        ? "bg-green-500 text-white"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    💬 Comments
                  </button>
                </div>

                {viewType[e.id] === "react" && (
                  <div className="space-y-2">
                    {reactions[e.id]?.map((r) => (
                      <div className="flex justify-between bg-gray-50 p-2 rounded">
                        <div className="flex gap-2 items-center">
                          <img src={r.studentImage} className="w-8 h-8 rounded-full" />
                          <span>{r.studentName}</span>
                        </div>
                        <span>{getIcon(r.type)}</span>
                      </div>
                    ))}
                  </div>
                )}

                {viewType[e.id] === "comment" && (
                  <div className="space-y-2">
                    {comments[e.id]?.map((c) => (
                      <div className="bg-white p-3 rounded border">

                        <div className="flex justify-between">
                          <div className="flex gap-2 items-center">
                            <img src={c.studentImage} className="w-8 h-8 rounded-full" />
                            <span>{c.studentName}</span>
                          </div>

                          {c.studentId == studentId && (
                            <div className="flex gap-2 text-xs">
                              <button
                                onClick={() => {
                                  setEditingId(c.id);
                                  setEditText(c.comment);
                                }}
                                className="text-blue-500"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => deleteComment(c.id, e.id)}
                                className="text-red-500"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>

                        {editingId === c.id ? (
                          <div className="mt-2">
                            <input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="w-full border px-2 py-1 rounded"
                            />
                            <button
                              onClick={() => updateComment(c.id, e.id)}
                              className="text-green-600 text-sm mt-1"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-600 mt-1">{c.comment}</p>
                        )}

                      </div>
                    ))}
                  </div>
                )}

              </div>
            )}

          </div>
        ))}

      </div>

    </div>
  );
}