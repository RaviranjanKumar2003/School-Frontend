import {
  Card,
  CardBody,
  Avatar,
  Typography,
  Tabs,
  TabsHeader,
  Tab,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Button,
} from "@material-tailwind/react";

import {
  HomeIcon,
  Cog6ToothIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

import { CameraIcon } from "@heroicons/react/24/outline";

import { useEffect, useState } from "react";
import axios from "axios";
import { ProfileInfoCard } from "@/widgets/cards";

export function Profile() {
  const [hod, setHod] = useState(null);
  const [open, setOpen] = useState(false);
  const [hover, setHover] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  const [image, setImage] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const storedHod = JSON.parse(localStorage.getItem("hodData"));
  const hodId = storedHod?.id;

  const coverUrl = `http://localhost:8080/api/hods/cover/get/${hod?.id}`;
  const imageUrl = `http://localhost:8080/api/hods/image/get/${hod?.id}`;

  // ================= FETCH =================
  const fetchHod = () => {
    axios
      .get(`http://localhost:8080/api/hods/${hodId}`)
      .then((res) => {
        setHod(res.data);

        setFormData({
          name: res.data.name || "",
          department: res.data.department || "",
          username: res.data.username || "",
          password: res.data.password || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        });
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    if (hodId) fetchHod();
  }, [hodId]);

  if (!hod) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  // ================= UPDATE PROFILE =================
  const handleUpdate = async () => {
    try {
      const data = new FormData();

      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      if (image) data.append("file", image);

      await axios.put(
        `http://localhost:8080/api/hods/update-hod/${hodId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setOpen(false);
      fetchHod();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  // ================= COVER UPLOAD =================
  const handleCoverUpload = async () => {
    if (!coverImage) return;

    try {
      const data = new FormData();
      data.append("image", coverImage);

      await axios.post(
        `http://localhost:8080/api/hods/cover/upload/${hodId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setCoverImage(null);
      fetchHod();
    } catch (err) {
      console.error("Cover upload failed", err);
    }
  };

  return (
    <>
      {/* ================= COVER IMAGE ================= */}
      <div
        className="relative mt-8 h-72 w-full rounded-xl bg-cover bg-center group"
        style={{ backgroundImage: `url(${coverUrl})` }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="absolute inset-0 bg-black/60" />

        {/* 🔥 CAMERA ICON */}
        {hover && (
          <div className="absolute right-5 top-5 flex items-center gap-2">

            <label className="cursor-pointer bg-white p-2 rounded-full shadow-lg hover:bg-gray-200 transition">
              <CameraIcon className="h-6 w-6 text-gray-700" />
              <input
                type="file"
                hidden
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </label>

            {coverImage && (
              <Button size="sm" color="green" onClick={handleCoverUpload}>
                Upload
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ================= PROFILE CARD ================= */}
      <Card className="mx-3 -mt-16 mb-6">
        <CardBody>

          <div className="flex justify-between flex-wrap gap-6">

            <div className="flex items-center gap-6">

              <Avatar
                src={imageUrl}
                size="xl"
                className="shadow-lg"
                onError={(e) =>
                  (e.target.src =
                    "https://cdn-icons-png.flaticon.com/512/149/149071.png")
                }
              />

              <div>
                <Typography variant="h5">{hod.name}</Typography>
                <Typography variant="small">{hod.department}</Typography>
              </div>
            </div>

            <Tabs value="info">
              <TabsHeader>
                <Tab value="info">
                  <HomeIcon className="h-5 w-5 mr-2 inline" />
                  Info
                </Tab>
                <Tab value="settings">
                  <Cog6ToothIcon className="h-5 w-5 mr-2 inline" />
                  Settings
                </Tab>
              </TabsHeader>
            </Tabs>
          </div>

          {/* DETAILS */}
          <div className="mt-10">
            <ProfileInfoCard
              title="HOD Details"
              details={{
                Name: hod.name,
                Department: hod.department,
                Email: hod.email,
                Phone: hod.phone,
                Username: hod.username,
              }}
              action={
                <Tooltip content="Edit Profile">
                  <PencilIcon
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => setOpen(true)}
                  />
                </Tooltip>
              }
            />
          </div>
        </CardBody>
      </Card>

      {/* ================= EDIT MODAL ================= */}
      <Dialog open={open} handler={setOpen}>
        <DialogHeader>Edit Profile</DialogHeader>

        <DialogBody className="space-y-4">
          {Object.keys(formData).map((key) => (
            <Input
              key={key}
              label={key}
              value={formData[key]}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.value })
              }
            />
          ))}

          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </DialogBody>

        <DialogFooter>
          <Button variant="text" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={handleUpdate}>
            Update
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export default Profile;