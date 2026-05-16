import React, { useEffect, useState } from "react";
import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
} from "@material-tailwind/react";
import {
  HomeIcon,
  ChatBubbleLeftEllipsisIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";
import { ProfileInfoCard } from "@/widgets/cards";

export function Profile() {
  const [student, setStudent] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
  const id = localStorage.getItem("id");

  fetch(`http://localhost:8080/api/students/by-id/${id}`)

    .then((res) => res.json())
    .then((data) => setStudent(data))
    .catch((err) => console.log(err));
  }, []);

 const uploadImage = async () => {
  if (!selectedImage) {
    alert("❌ Please select image");
    return;
  }

  const id = student.id;

  const formData = new FormData();
  formData.append("image", selectedImage);

  const res = await fetch(
    `http://localhost:8080/api/students/image/upload/${id}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (res.ok) {
    alert("✅ Image Updated");
    setOpenEdit(false);

    const updated = await fetch(
      `http://localhost:8080/api/students/by-id/${id}`
    );
    const data = await updated.json();
    setStudent(data);
  } else {
    alert("❌ Upload failed");
  }
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  const handleImageChange = (e) => {
  setSelectedImage(e.target.files[0]);
  };

  return (
    <>
      <div className="relative mt-8 h-72 w-full overflow-hidden rounded-xl bg-[url('/img/student-background.png')] bg-cover bg-center">
        <div className="absolute inset-0 h-full w-full bg-gray-900/75" />
      </div>
      <Card className="mx-3 -mt-16 mb-6 lg:mx-4 border border-blue-gray-100">
        <CardBody className="p-4">
          <div className="mb-10 flex items-center justify-between flex-wrap gap-6">
            <div className="flex items-center gap-6">
              <Avatar
               src={
                 student.imageUrl
                  ? `http://localhost:8080/api/students/image/get/${student.id}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
               }
               alt={student.studName}
               size="xl"
               variant="rounded"
              />
              <div>
                <Typography variant="h5" color="blue-gray" className="mb-1">
                  {`${student.studName} ${student.studLastName}`}
                </Typography>
                <Typography
                  variant="small"
                  className="font-normal text-blue-gray-600"
                >
                  {student.major} - Year {student.classNumber}
                </Typography>
              </div>
            </div>
            <div className="w-96">
              <Tabs value="info">
                <TabsHeader>
                  <Tab value="info">
                    <HomeIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Info
                  </Tab>
                  {/* <Tab value="semesters">
                    <ChatBubbleLeftEllipsisIcon className="-mt-0.5 mr-2 inline-block h-5 w-5" />
                    Semesters
                  </Tab> */}
                  <Tab value="settings">
                    <Cog6ToothIcon className="-mt-1 mr-2 inline-block h-5 w-5" />
                    Settings
                  </Tab>
                </TabsHeader>
              </Tabs>
            </div>
          </div>
          <div className="grid-cols-1 mb-12 grid gap-12 px-4 lg:grid-cols-2 xl:grid-cols-3">
            <div>
              <h3
                className={`cursor-pointer ${
                activeTab === "info" ? "text-blue-600 font-bold" : ""
                }`}
                onClick={() => setActiveTab("info")}>
                 Personal Information
               </h3>
             {activeTab === "info" && (
               <ProfileInfoCard
               title="Student Details"
               description="Here are the student's personal and academic details."
               details={{
               "Full Name": `${student.studName} ${student.studLastName}`,
               "Father's Name": student.studFatherName,
               "Roll Number": student.studRollNo,
               "Date of Birth": student.studentDob,
               Age: student.studentAge,
               "Phone Number": student.studPhoneNumber,
                Email: student.email,
                Category: student.studCategory,
                Caste: student.studCaste,
                }}
                action={
                <Tooltip content="Edit Profile">
                <PencilIcon
                className="h-4 w-4 cursor-pointer text-blue-gray-500"
                onClick={() => setOpenEdit(true)}
                />
               </Tooltip>
                 }
              />
             )}
           </div>
            <div>
              <h3
               className={`cursor-pointer ${
               activeTab === "academic" ? "text-blue-600 font-bold" : ""
                }`}
               onClick={() => setActiveTab("academic")}>
               Academic Information
              </h3>
              {activeTab === "academic" && (
             <ul className="flex flex-col gap-6">
             {student.semesters?.map((semester) => (
             <li key={semester.id} className="flex items-center">
             <Typography className="flex-1">
             {semester.semester}
             </Typography>
             <Typography className="flex-1">
             {semester.name}
             </Typography>
             <Typography className="flex-1">
             Credits: {semester.credits}
             </Typography>
             <Typography className="flex-1">
             Grade: {semester.grade}
             </Typography>
             </li>
             ))}
            </ul>
             )}
            </div>
          </div>
        </CardBody>
      </Card>

      {openEdit && (
       <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-80 space-y-3">

      <h2 className="font-bold">Update Profile Image</h2>

      <input type="file" onChange={handleImageChange} />

      <div className="flex justify-end gap-2">
        <button onClick={() => setOpenEdit(false)}>Cancel</button>

        <button
          onClick={uploadImage}
          className="bg-blue-600 text-white px-3 py-1 rounded"
        >
          Upload
        </button>
      </div>

    </div>
   </div>
   )}
  </>
);
}

export default Profile;