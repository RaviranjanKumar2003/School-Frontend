import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";

import {
  UserPlusIcon,
  EyeIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

function HODs() {

  // ================= STATES =================
  const [hods, setHods] = useState([]);
  const [selectedHod, setSelectedHod] = useState(null);

  const [openView, setOpenView] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);

  // ================= FORM =================
  const [form, setForm] = useState({
    name: "",
    department: "",
    username: "",
    password: "",
    email: "",
    phone: "",
  });

  const schoolId = localStorage.getItem("schoolId");

  // ================= FETCH =================
  const fetchHODs = async () => {

  try {

    setLoading(true);

    const res = await axios.get(
      `http://localhost:8080/api/hods/school/${schoolId}`
    );

    console.log(
      "HOD API Response =",
      res.data
    );

    if (Array.isArray(res.data)) {

      setHods(res.data);

    } else {

      setHods([]);

      console.error(
        "Response is not array",
        res.data
      );
    }

  } catch (err) {

    console.log(
      err.response?.data || err.message
    );

    setHods([]);

  } finally {

    setLoading(false);
  }
};

  useEffect(() => {

    if (schoolId) {
      fetchHODs();
    }

  }, [schoolId]);

  // ================= RESET =================
  const resetForm = () => {

    setForm({
      name: "",
      department: "",
      username: "",
      password: "",
      email: "",
      phone: "",
    });

    setFile(null);
  };

  // ================= CREATE =================
  console.log("schoolId =", schoolId);
  const handleCreate = async () => {

    try {

      const payload = {
        ...form,
        schoolId: Number(schoolId),
      };

      const data = new FormData();

      data.append(
  "data",
  new Blob(
    [JSON.stringify(payload)],
    {
      type: "application/json",
    }
  )
);

      if (file) {

        data.append("file", file);
      }

      await axios.post(
        "http://localhost:8080/api/hods",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setOpenCreate(false);

      resetForm();

      fetchHODs();

    } catch (err) {

      console.log(
        err.response?.data || err.message
      );
    }
  };

  // ================= EDIT OPEN =================
  const handleEditOpen = (hod) => {

    setSelectedHod(hod);

    setForm({
      name: hod.name || "",
      department: hod.department || "",
      username: hod.username || "",
      password: hod.password || "",
      email: hod.email || "",
      phone: hod.phone || "",
    });

    setFile(null);

    setOpenEdit(true);
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {

    try {

      const payload = {
        ...form,
        schoolId: Number(schoolId),
      };

      const data = new FormData();

      data.append(
        "data",
        new Blob(
          [JSON.stringify(payload)],
          {
            type: "application/json",
          }
        )
      );

      if (file) {

        data.append("file", file);
      }

      await axios.put(
        `http://localhost:8080/api/hods/${selectedHod.id}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setOpenEdit(false);

      resetForm();

      fetchHODs();

    } catch (err) {

      console.log(
        err.response?.data || err.message
      );
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this HOD?"
    );

    if (!confirmDelete) return;

    try {

      await axios.delete(
        `http://localhost:8080/api/hods/${id}`
      );

      fetchHODs();

    } catch (err) {

      console.log(
        err.response?.data || err.message
      );
    }
  };

  // ================= FILTER =================
  const filtered = Array.isArray(hods)
  ? hods.filter((h) =>
      h.name
        ?.toLowerCase()
        .includes(search.toLowerCase())
    )
  : [];

  return (

    <div className="p-6 bg-gray-50 min-h-screen">

      {/* ================= HEADER ================= */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">

        <div>

          <Typography
            variant="h4"
            className="font-bold text-blue-700"
          >
            HOD Management
          </Typography>

          <Typography className="text-gray-500 text-sm">
            Manage Head of Departments
          </Typography>

        </div>

        <Button
          onClick={() => setOpenCreate(true)}
          className="flex items-center gap-2"
          color="blue"
        >

          <UserPlusIcon className="h-5 w-5" />

          Create HOD

        </Button>

      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">

        <div className="w-full md:w-[350px]">

          <Input
            label="Search HOD"
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="bg-white"
          />

        </div>

        <div className="bg-white px-4 py-3 rounded-xl shadow min-w-[170px]">

          <Typography className="font-medium">
            Total HODs: <b>{hods.length}</b>
          </Typography>

        </div>

      </div>

      {/* ================= LOADING ================= */}
      {loading && (

        <div className="text-center py-10">

          <Typography className="text-gray-600">
            Loading...
          </Typography>

        </div>
      )}

      {/* ================= EMPTY ================= */}
      {!loading && filtered.length === 0 && (

        <div className="text-center py-16 bg-white rounded-xl shadow">

          <Typography variant="h6">
            No HODs Found
          </Typography>

        </div>
      )}

      {/* ================= CARDS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

        {filtered.map((hod) => (

          <Card
            key={hod.id}
            className="shadow-lg rounded-2xl border"
          >

            <CardBody>

              {/* IMAGE */}
              <div className="flex justify-center mb-4">

                <img
                  src={
                      hod.imageUrl
                      ? `http://localhost:8080/api/images/${hod.imageUrl}`
                      : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    }
                  alt="hod"
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                />

              </div>

              {/* DETAILS */}
              <Typography className="font-bold text-lg text-center">
                {hod.name}
              </Typography>

              <Typography className="text-sm text-gray-500 text-center">
                {hod.department}
              </Typography>

              <div className="text-sm mt-4 space-y-2">

                <p>
                  <b>Email:</b> {hod.email}
                </p>

                <p>
                  <b>Phone:</b> {hod.phone}
                </p>

                <p>
                  <b>School:</b>{" "}
                  {hod.school?.schoolName}
                </p>

              </div>

              {/* ACTIONS */}
              <div className="flex gap-2 mt-5 justify-center">

                <Button
                  size="sm"
                  color="green"
                  onClick={() => {
                    setSelectedHod(hod);
                    setOpenView(true);
                  }}
                >

                  <EyeIcon className="h-4 w-4" />

                </Button>

                <Button
                  size="sm"
                  color="blue"
                  onClick={() =>
                    handleEditOpen(hod)
                  }
                >

                  <PencilIcon className="h-4 w-4" />

                </Button>

                <Button
                  size="sm"
                  color="red"
                  onClick={() =>
                    handleDelete(hod.id)
                  }
                >

                  <TrashIcon className="h-4 w-4" />

                </Button>

              </div>

            </CardBody>

          </Card>
        ))}

      </div>

      {/* ================= VIEW ================= */}
      <Dialog
        open={openView}
        handler={() => setOpenView(false)}
      >

        <DialogHeader>
          HOD Details
        </DialogHeader>

        <DialogBody>

          {selectedHod && (

            <div className="space-y-3">

              <p>
                <b>Name:</b> {selectedHod.name}
              </p>

              <p>
                <b>Department:</b> {selectedHod.department}
              </p>

              <p>
                <b>Email:</b> {selectedHod.email}
              </p>

              <p>
                <b>Phone:</b> {selectedHod.phone}
              </p>

              <p>
                <b>Username:</b> {selectedHod.username}
              </p>

              <p>
                <b>School:</b>{" "}
                {selectedHod.school?.schoolName}
              </p>

              <p>
                <b>School Code:</b>{" "}
                {selectedHod.school?.schoolCode}
              </p>

            </div>
          )}

        </DialogBody>

        <DialogFooter>

          <Button
            onClick={() =>
              setOpenView(false)
            }
          >
            Close
          </Button>

        </DialogFooter>

      </Dialog>

      {/* ================= FORM UI ================= */}
      {(openCreate || openEdit) && (
        <Dialog
          open={openCreate || openEdit}
          handler={() => {
            setOpenCreate(false);
            setOpenEdit(false);
          }}
        >

          <DialogHeader>
            {openCreate ? "Create HOD" : "Update HOD"}
          </DialogHeader>

          <DialogBody>

            <div className="space-y-4">

              <Input
                label="Name"
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                  })
                }
              />

              <Input
                label="Department"
                value={form.department}
                onChange={(e) =>
                  setForm({
                    ...form,
                    department: e.target.value,
                  })
                }
              />

              <Input
                label="Username"
                value={form.username}
                onChange={(e) =>
                  setForm({
                    ...form,
                    username: e.target.value,
                  })
                }
              />

              <Input
                label="Password"
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />

              <Input
                label="Email"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
              />

              <Input
                label="Phone"
                value={form.phone}
                onChange={(e) =>
                  setForm({
                    ...form,
                    phone: e.target.value,
                  })
                }
              />

              <input
                type="file"
                className="border p-2 rounded w-full"
                onChange={(e) =>
                  setFile(e.target.files[0])
                }
              />

            </div>

          </DialogBody>

          <DialogFooter>

            <Button
              variant="text"
              onClick={() => {
                setOpenCreate(false);
                setOpenEdit(false);
              }}
            >
              Cancel
            </Button>

            <Button
              color="blue"
              onClick={
                openCreate
                  ? handleCreate
                  : handleUpdate
              }
            >
              {openCreate
                ? "Save HOD"
                : "Update HOD"}
            </Button>

          </DialogFooter>

        </Dialog>
      )}

    </div>
  );
}

export default HODs;