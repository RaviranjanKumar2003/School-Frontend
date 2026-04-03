import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
} from "@material-tailwind/react";

import { TrashIcon } from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

export default function SchoolDashboard() {
  const [classes, setClasses] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  const [openClassDialog, setOpenClassDialog] = useState(false);
  const [newClassName, setNewClassName] = useState("");

  const [openSubjectDialog, setOpenSubjectDialog] = useState(false);
  const [currentClass, setCurrentClass] = useState(null);
  const [newSubject, setNewSubject] = useState("");

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/classes`);
      setClasses(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD CLASS =================
  const handleAddClass = async () => {
    if (!newClassName) return;

    try {
      await axios.post(`${BASE_URL}/classes`, {
        className: newClassName,
      });

      fetchClasses();
      setNewClassName("");
      setOpenClassDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE CLASS =================
  const handleDeleteClass = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/classes/${id}`);
      fetchClasses();
    } catch (err) {
      console.error(err);
    }
  };

  // ================= ADD SUBJECT =================
  const handleAddSubject = async () => {
    if (!newSubject || !currentClass) return;

    try {
      await axios.post(
        `${BASE_URL}/classes/${currentClass.id}/subject`,
        null,
        {
          params: { subjectName: newSubject },
        }
      );

      fetchClasses();
      setNewSubject("");
      setOpenSubjectDialog(false);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= DELETE SUBJECT =================
  const handleDeleteSubject = async (id) => {
  console.log("Deleting subject:", id);

  try {
    await axios.delete(`${BASE_URL}/subjects/${id}`);
    fetchClasses();
  } catch (err) {
    console.error(err);
  }
};

  // ================= TOGGLE =================
  const toggleDetails = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 flex flex-col gap-6">

      {/* TOP */}
      <Card>
        <CardBody className="flex justify-between items-center">
          <Typography variant="h5">
            Total Classes: {classes.length}
          </Typography>

          <Button size="sm" onClick={() => setOpenClassDialog(true)}>
            + Add Class
          </Button>
        </CardBody>
      </Card>

      {/* LIST */}
      {classes.map((cls, index) => {
       const hasComputer = cls.subjects?.some(
  (s) =>
    s?.subjectName?.toLowerCase() === "computer science"
);

        return (
          <Card key={cls.id}>
            <CardHeader className="p-4 flex justify-between items-center bg-blue-500">
              <Typography color="white">{cls.className}</Typography>

              <div className="flex gap-3">
                <Chip
                  value={`${cls.subjects?.length || 0} Subjects`}
                />

                <IconButton
                  color="red"
                  size="sm"
                  onClick={() => handleDeleteClass(cls.id)}
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            </CardHeader>

            <CardBody>

              <div className="flex justify-between">
                <Typography>
                  Subjects in {cls.className}
                </Typography>

                <div className="flex gap-2">
                  <Button size="sm" onClick={() => toggleDetails(index)}>
                    {openIndex === index ? "Hide" : "View"}
                  </Button>

                  <Button
                    size="sm"
                    color="green"
                    onClick={() => {
                      setCurrentClass(cls);
                      setOpenSubjectDialog(true);
                    }}
                  >
                    + Add Subject
                  </Button>
                </div>
              </div>

              {/* SUBJECTS */}
              {openIndex === index && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {cls.subjects?.length === 0 ? (
                    <Typography>No subjects</Typography>
                  ) : (
                    cls.subjects.map((sub) => (
  <div key={sub.id} className="flex gap-1">
    <Chip value={sub.subjectName} />

    <IconButton
      size="sm"
      color="red"
      onClick={() => handleDeleteSubject(sub.id)}
    >
      <TrashIcon className="h-3 w-3" />
    </IconButton>
  </div>
))
                  )}
                </div>
              )}

              {/* FEATURES */}
              <div className="mt-4 flex gap-2 flex-wrap">
                <Chip value="✔ Exams" color="green" />
                <Chip value="✔ Practical" color="blue" />

                {hasComputer && (
                  <Chip value="✔ Computer Lab" color="purple" />
                )}
              </div>

            </CardBody>
          </Card>
        );
      })}

      {/* ADD CLASS */}
      <Dialog open={openClassDialog} handler={setOpenClassDialog}>
        <DialogHeader>Add Class</DialogHeader>

        <DialogBody>
          <Input
            label="Class Name"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
        </DialogBody>

        <DialogFooter>
          <Button onClick={() => setOpenClassDialog(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddClass}>
            Add
          </Button>
        </DialogFooter>
      </Dialog>

      {/* ADD SUBJECT */}
      <Dialog open={openSubjectDialog} handler={setOpenSubjectDialog}>
        <DialogHeader>Add Subject</DialogHeader>

        <DialogBody>
          <Input
            label="Subject Name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
          />
        </DialogBody>

        <DialogFooter>
          <Button onClick={() => setOpenSubjectDialog(false)}>
            Cancel
          </Button>
          <Button color="green" onClick={handleAddSubject}>
            Add
          </Button>
        </DialogFooter>
      </Dialog>

    </div>
  );
}