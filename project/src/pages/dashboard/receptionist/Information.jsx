// import {
//   Card,
//   CardBody,
//   Avatar,
//   Typography,
//   Tooltip,
//   Dialog,
//   DialogHeader,
//   DialogBody,
//   DialogFooter,
//   Input,
//   Button,
// } from "@material-tailwind/react";

// import {
//   PencilIcon,
//   CameraIcon,
// } from "@heroicons/react/24/solid";

// import {
//   useEffect,
//   useState,
// } from "react";

// import axios from "axios";

// import {
//   ProfileInfoCard,
// } from "@/widgets/cards";

// // =====================================================
// // COMPONENT
// // =====================================================

// export function Information() {

//   // =====================================================
//   // STATES
//   // =====================================================

//   const [receptionist, setReceptionist] =
//     useState(null);

//   const [open, setOpen] =
//     useState(false);

//   const [hover, setHover] =
//     useState(false);

//   const [loading, setLoading] =
//     useState(false);

//   const [image, setImage] =
//     useState(null);

//   const [coverImages, setCoverImages] =
//     useState([]);

//   const [currentIndex, setCurrentIndex] =
//     useState(0);

//   const [newImages, setNewImages] =
//     useState([]);

//   const [formData, setFormData] =
//     useState({

//       name: "",

//       username: "",

//       password: "",

//       email: "",

//       phone: "",

//       schoolName: "",
//     });

//   // =====================================================
//   // LOCAL STORAGE
//   // =====================================================

//   const storedReceptionist =
//     JSON.parse(

//       localStorage.getItem(
//         "receptionistData"
//       )
//     );

//   const receptionistId =
//     storedReceptionist?.id;

//   const schoolId =
//     storedReceptionist?.school?.id;

//   // =====================================================
//   // FETCH RECEPTIONIST
//   // =====================================================

//   const fetchReceptionist =
//     async () => {

//       try {

//         setLoading(true);

//         const res =
//           await axios.get(

//             `http://localhost:8080/api/receptionists/${receptionistId}`
//           );

//         console.log(
//           "RECEPTIONIST =",
//           res.data
//         );

//         setReceptionist(
//           res.data
//         );

//         setFormData({

//           name:
//             res.data.name || "",

//           username:
//             res.data.username || "",

//           password:
//             res.data.password || "",

//           email:
//             res.data.email || "",

//           phone:
//             res.data.phone || "",

//           schoolName:
//             res.data.school
//               ?.schoolName || "",
//         });

//         // =================================================
//         // COVER IMAGES
//         // =================================================

//         setCoverImages(

//           Array.isArray(
//             res.data.school
//               ?.coverImages
//           )

//             ? res.data.school
//                 .coverImages

//             : []
//         );

//         setCurrentIndex(0);

//       } catch (err) {

//         console.error(

//           "Receptionist Fetch Error:",

//           err.response?.data ||
//             err.message
//         );

//       } finally {

//         setLoading(false);
//       }
//     };

//   // =====================================================
//   // USE EFFECT
//   // =====================================================

//   useEffect(() => {

//     if (receptionistId) {

//       fetchReceptionist();
//     }

//   }, [receptionistId]);

//   // =====================================================
//   // AUTO SLIDER
//   // =====================================================

//   useEffect(() => {

//     if (
//       coverImages.length <= 1
//     )
//       return;

//     const interval =
//       setInterval(() => {

//         setCurrentIndex(
//           (prev) =>

//             prev ===
//             coverImages.length -
//               1

//               ? 0

//               : prev + 1
//         );

//       }, 3000);

//     return () =>
//       clearInterval(interval);

//   }, [coverImages]);

//   // =====================================================
//   // LOADING
//   // =====================================================

//   if (
//     loading ||
//     !receptionist
//   ) {

//     return (

//       <div
//         className="
//           text-center
//           mt-10
//           text-lg
//           font-semibold
//         "
//       >

//         Loading...

//       </div>
//     );
//   }

//   // =====================================================
//   // IMAGE URL
//   // =====================================================

//   const imageUrl =
//   receptionist?.imageUrl
//     ? `http://localhost:8080/api/receptionists/image/${receptionist.imageUrl}?t=${Date.now()}`
//     : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

//   // =====================================================
//   // COVER URL
//   // =====================================================

//   const coverUrl = (
//     fileName
//   ) =>

//     `http://localhost:8080/api/schools/cover/get-file/${fileName}`;

//   // =====================================================
//   // CURRENT COVER
//   // =====================================================

//   const currentCover =

//     coverImages.length > 0

//       ? coverUrl(
//           coverImages[
//             currentIndex
//           ]
//         )

//       : "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200";

//   // =====================================================
//   // UPDATE PROFILE
//   // =====================================================

//   const handleUpdate =
//     async () => {

//       try {

//         // =============================================
//         // UPDATE INFO
//         // =============================================

//         await axios.put(

//           `http://localhost:8080/api/receptionists/${receptionistId}`,

//           {

//             ...receptionist,

//             ...formData,
//           }
//         );

//         // =============================================
//         // PROFILE IMAGE
//         // =============================================

//         if (image) {

//           const imageData =
//             new FormData();

//           imageData.append(
//             "image",
//             image
//           );

//           await axios.post(

//             `http://localhost:8080/api/receptionists/image/upload/${receptionistId}`,

//             imageData,

//             {
//               headers: {
//                 "Content-Type":
//                   "multipart/form-data",
//               },
//             }
//           );
//         }

//         setOpen(false);

//         setImage(null);

//         fetchReceptionist();

//       } catch (err) {

//         console.error(

//           "Update Error:",

//           err.response?.data ||
//             err.message
//         );
//       }
//     };

//   // =====================================================
//   // COVER IMAGE UPLOAD
//   // =====================================================

//   const handleCoverUpload =
//     async () => {

//       if (
//         newImages.length === 0
//       )
//         return;

//       try {

//         const data =
//           new FormData();

//         newImages.forEach(
//           (file) => {

//             data.append(
//               "images",
//               file
//             );
//           }
//         );

//         await axios.post(

//           `http://localhost:8080/api/schools/cover/upload-multiple/${schoolId}`,

//           data,

//           {
//             headers: {
//               "Content-Type":
//                 "multipart/form-data",
//             },
//           }
//         );

//         setNewImages([]);

//         fetchReceptionist();

//       } catch (err) {

//         console.error(

//           "Cover Upload Error:",

//           err.response?.data ||
//             err.message
//         );
//       }
//     };

//   // =====================================================
//   // UI
//   // =====================================================

//   return (
//     <>

//       {/* ================================================= */}
//       {/* COVER */}
//       {/* ================================================= */}

//       <div
//         className="
//           relative
//           mt-8
//           h-72
//           w-full
//           rounded-3xl
//           overflow-hidden
//           group
//           shadow-2xl
//         "
//         onMouseEnter={() =>
//           setHover(true)
//         }
//         onMouseLeave={() =>
//           setHover(false)
//         }
//       >

//         <img
//           src={currentCover}
//           alt="cover"
//           className="
//             w-full
//             h-full
//             object-cover
//             transition-all
//             duration-700
//           "
//           onError={(e) => {

//             e.target.onerror =
//               null;

//             e.target.src =
//               "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200";
//           }}
//         />

//         {/* OVERLAY */}

//         <div
//           className="
//             absolute
//             inset-0
//             bg-black/40
//           "
//         />

//         {/* CONTROLS */}

//         {hover && (

//           <div
//             className="
//               absolute
//               top-5
//               right-5
//               flex
//               gap-3
//             "
//           >

//             <label
//               className="
//                 cursor-pointer
//                 bg-white
//                 p-3
//                 rounded-full
//                 shadow-lg
//               "
//             >

//               <CameraIcon
//                 className="
//                   h-6
//                   w-6
//                   text-gray-700
//                 "
//               />

//               <input
//                 type="file"
//                 multiple
//                 hidden
//                 onChange={(e) =>
//                   setNewImages(

//                     Array.from(
//                       e.target.files
//                     )
//                   )
//                 }
//               />

//             </label>

//             {newImages.length >
//               0 && (

//               <Button
//                 size="sm"
//                 color="green"
//                 onClick={
//                   handleCoverUpload
//                 }
//               >

//                 Upload (
//                 {
//                   newImages.length
//                 }
//                 )

//               </Button>
//             )}

//           </div>
//         )}

//       </div>

//       {/* ================================================= */}
//       {/* PROFILE CARD */}
//       {/* ================================================= */}

//       <Card
//         className="
//           mx-3
//           -mt-16
//           mb-6
//           rounded-3xl
//           shadow-2xl
//         "
//       >

//         <CardBody>

//           {/* TOP */}

//           <div
//             className="
//               flex
//               flex-col
//               md:flex-row
//               items-center
//               gap-6
//             "
//           >

//             <Avatar
//               src={imageUrl}
//               size="xxl"
//               alt="profile"
//               className="
//                 border-4
//                 border-white
//                 shadow-xl
//               "
//               onError={(e) => {

//                 e.target.onerror =
//                   null;

//                 e.target.src =
//                   "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
//               }}
//             />

//             <div
//               className="
//                 text-center
//                 md:text-left
//               "
//             >

//               <Typography
//                 variant="small"
//                 className="
//                   text-blue-600
//                   font-semibold
//                 "
//               >

//                 {
//                   receptionist
//                     .school
//                     ?.schoolName
//                 }

//               </Typography>

//               <Typography
//                 variant="h3"
//               >

//                 {
//                   receptionist.name
//                 }

//               </Typography>

//               <Typography
//                 variant="h6"
//                 className="
//                   text-blue-gray-500
//                   mt-1
//                 "
//               >

//                 Receptionist

//               </Typography>

//             </div>

//           </div>

//           {/* DETAILS */}

//           <div className="mt-10">

//             <ProfileInfoCard
//               title="Receptionist Details"
//               details={{

//                 School:
//                   receptionist
//                     .school
//                     ?.schoolName,

//                 Email:
//                   receptionist.email,

//                 Phone:
//                   receptionist.phone,

//                 Username:
//                   receptionist.username,
//               }}

//               action={

//                 <Tooltip content="Edit Profile">

//                   <PencilIcon
//                     className="
//                       h-5
//                       w-5
//                       cursor-pointer
//                     "
//                     onClick={() =>
//                       setOpen(true)
//                     }
//                   />

//                 </Tooltip>
//               }
//             />

//           </div>

//         </CardBody>

//       </Card>

//       {/* ================================================= */}
//       {/* EDIT MODAL */}
//       {/* ================================================= */}

//       <Dialog
//         open={open}
//         handler={setOpen}
//         size="md"
//       >

//         <DialogHeader>

//           Edit Profile

//         </DialogHeader>

//         <DialogBody
//           className="space-y-5"
//         >

//           <Input
//             label="Name"
//             value={formData.name}
//             onChange={(e) =>
//               setFormData({

//                 ...formData,

//                 name:
//                   e.target.value,
//               })
//             }
//           />

//           <Input
//             label="School Name"
//             value={
//               formData.schoolName
//             }
//             disabled
//           />

//           <Input
//             label="Username"
//             value={
//               formData.username
//             }
//             onChange={(e) =>
//               setFormData({

//                 ...formData,

//                 username:
//                   e.target.value,
//               })
//             }
//           />

//           <Input
//             type="password"
//             label="Password"
//             value={
//               formData.password
//             }
//             onChange={(e) =>
//               setFormData({

//                 ...formData,

//                 password:
//                   e.target.value,
//               })
//             }
//           />

//           <Input
//             label="Email"
//             value={
//               formData.email
//             }
//             onChange={(e) =>
//               setFormData({

//                 ...formData,

//                 email:
//                   e.target.value,
//               })
//             }
//           />

//           <Input
//             label="Phone"
//             value={
//               formData.phone
//             }
//             onChange={(e) =>
//               setFormData({

//                 ...formData,

//                 phone:
//                   e.target.value,
//               })
//             }
//           />

//           {/* IMAGE */}

//           <div>

//             <Typography
//               variant="small"
//               className="
//                 mb-2
//                 font-semibold
//               "
//             >

//               Upload Profile Image

//             </Typography>

//             <input
//               type="file"
//               className="
//                 border
//                 p-2
//                 rounded-lg
//                 w-full
//               "
//               onChange={(e) =>
//                 setImage(
//                   e.target.files[0]
//                 )
//               }
//             />

//           </div>

//         </DialogBody>

//         <DialogFooter
//           className="gap-3"
//         >

//           <Button
//             variant="text"
//             color="red"
//             onClick={() =>
//               setOpen(false)
//             }
//           >

//             Cancel

//           </Button>

//           <Button
//             color="green"
//             onClick={
//               handleUpdate
//             }
//           >

//             Update Profile

//           </Button>

//         </DialogFooter>

//       </Dialog>

//     </>
//   );
// }

// export default Information;


//===================================================================

import {
  Card,
  CardBody,
  Avatar,
  Typography,
} from "@material-tailwind/react";

import {
  CameraIcon,
} from "@heroicons/react/24/solid";

import {
  useEffect,
  useState,
  useRef,
} from "react";

import axios from "axios";

import { ProfileInfoCard } from "@/widgets/cards";

export function Information() {

  // ================= STATES =================
  const [receptionist, setReceptionist] = useState(null);
  const [loading, setLoading] = useState(false);

  const [coverImages, setCoverImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(Date.now());

  const fileRef = useRef(null);

  // ================= LOCAL STORAGE =================
  const storedReceptionist = JSON.parse(
    localStorage.getItem("receptionistData")
  );

  const receptionistId = storedReceptionist?.id;

  // ================= FETCH =================
  const fetchReceptionist = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:8080/api/receptionists/${receptionistId}`
      );

      setReceptionist(res.data);

      setCoverImages(
        Array.isArray(res.data.school?.coverImages)
          ? res.data.school.coverImages
          : []
      );

      setCurrentIndex(0);

    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (receptionistId) fetchReceptionist();
  }, [receptionistId]);

  // ================= AUTO SLIDER =================
  useEffect(() => {
    if (coverImages.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) =>
        prev === coverImages.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [coverImages]);

  // ================= PROFILE IMAGE =================
  const imageUrl = receptionist?.imageUrl
    ? `http://localhost:8080/api/receptionists/image/${receptionist.imageUrl}?t=${refreshKey}`
    : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";

  // ================= COVER URL =================
  const coverUrl = (fileName) =>
    `http://localhost:8080/api/schools/cover/get-file/${fileName}`;

  const currentCover =
    coverImages.length > 0
      ? coverUrl(coverImages[currentIndex])
      : "https://images.unsplash.com/photo-1503264116251-35a269479413?q=80&w=1200";

  // ================= IMAGE UPLOAD ONLY =================
  const handleImageChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !receptionistId) return;

    try {
      setUploading(true);

      const formData = new FormData();

      // IMPORTANT: backend expects "image"
      formData.append("image", file);

      await axios.post(
        `http://localhost:8080/api/receptionists/image/upload/${receptionistId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setRefreshKey(Date.now());
      fetchReceptionist();

    } catch (err) {
      console.error("Upload Error:", err.response?.data || err.message);
    } finally {
      setUploading(false);
    }
  };

  // ================= LOADING =================
  if (loading || !receptionist) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <>

      {/* ================= COVER ================= */}
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-3xl shadow-2xl">

        <img
          src={currentCover}
          alt="cover"
          className="w-full h-full object-cover transition-all duration-700"
        />

        <div className="absolute inset-0 bg-black/40" />

        {/* DOTS */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {coverImages.map((_, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${
                i === currentIndex ? "bg-white" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ================= PROFILE CARD ================= */}
      <Card className="mx-3 -mt-16 mb-6 rounded-3xl shadow-2xl">
        <CardBody>

          <div className="flex flex-col md:flex-row items-center gap-6">

            {/* ================= AVATAR ================= */}
            <div className="relative group">

              <Avatar
                src={imageUrl}
                size="xxl"
                className="border-4 border-white shadow-xl"
              />

              {/* CAMERA ICON */}
              <div
                onClick={() => fileRef.current?.click()}
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer rounded-full transition"
              >
                <CameraIcon className="h-8 w-8 text-white" />
              </div>

              {/* UPLOADING */}
              {uploading && (
                <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-white text-sm rounded-full">
                  Uploading...
                </div>
              )}

            </div>

            {/* ================= INFO ================= */}
            <div className="text-center md:text-left">

              <Typography className="text-blue-600 font-semibold">
                {receptionist.school?.schoolName}
              </Typography>

              <Typography variant="h3">
                {receptionist.name}
              </Typography>

              <Typography className="text-blue-gray-500 mt-1">
                Receptionist
              </Typography>

            </div>

          </div>

          {/* ================= DETAILS ================= */}
          <div className="mt-10">

            <ProfileInfoCard
              title="Receptionist Details"
              details={{
                School: receptionist.school?.schoolName,
                Email: receptionist.email,
                Phone: receptionist.phone,
                Username: receptionist.username,
              }}
            />

          </div>

        </CardBody>
      </Card>

      {/* ================= HIDDEN INPUT ================= */}
      <input
        type="file"
        ref={fileRef}
        className="hidden"
        accept="image/*"
        onChange={handleImageChange}
      />

    </>
  );
}

export default Information;