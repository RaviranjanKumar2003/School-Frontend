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

import {
  TrashIcon,
  PlusIcon,
  BookOpenIcon,
  PencilIcon,
} from "@heroicons/react/24/solid";

const BASE_URL = "http://localhost:8080/api";

function CreatClassAndSubject() {

  // ================= ADMIN DATA =================
  const adminData = JSON.parse(
    localStorage.getItem("schoolAdminData")
  );

  const schoolId = adminData?.schoolId;

  // ================= STATES =================
  const [classes, setClasses] = useState([]);
  const [openIndex, setOpenIndex] = useState(null);

  // ================= CLASS =================
  const [openClassDialog, setOpenClassDialog] =
    useState(false);

  const [newClassName, setNewClassName] =
    useState("");

  const [newClassNumber, setNewClassNumber] =
    useState("");

  // ================= SUBJECT =================
  const [openSubjectDialog, setOpenSubjectDialog] =
    useState(false);

  const [currentClass, setCurrentClass] =
    useState(null);

  const [newSubject, setNewSubject] =
    useState("");

  // ================= SECTION =================
  const [openSectionDialog, setOpenSectionDialog] =
    useState(false);

  const [newSection, setNewSection] =
    useState("");

  const [editingSection, setEditingSection] =
    useState(null);

  const [editSectionName, setEditSectionName] =
    useState("");

  const [openEditSectionDialog, setOpenEditSectionDialog] =
    useState(false);

  // ================= LOAD DATA =================
  useEffect(() => {

    if (schoolId) {
      fetchClasses();
    }

  }, [schoolId]);

  // ================= FETCH CLASSES =================
  const fetchClasses = async () => {

    try {

      // ===== GET CLASSES =====
      const classRes = await axios.get(
        `${BASE_URL}/classes/by-school/${schoolId}`
      );

      let classData = classRes.data || [];

      // ===== GET SECTIONS FOR EVERY CLASS =====
      const updatedClasses = await Promise.all(

        classData.map(async (cls) => {

          try {

            const sectionRes = await axios.get(
              `${BASE_URL}/sections/${schoolId}/${cls.id}`
            );

            return {
              ...cls,
              sections: sectionRes.data || [],
            };

          } catch (err) {

            console.error(
              "Section Fetch Error :",
              err
            );

            return {
              ...cls,
              sections: [],
            };
          }
        })
      );

      setClasses(updatedClasses);

    } catch (err) {

      console.error("Fetch Classes Error :", err);

    }
  };

  // ================= ADD CLASS =================
  const handleAddClass = async () => {

    if (
      !newClassName.trim() ||
      !newClassNumber
    ) return;

    try {

      await axios.post(
        `${BASE_URL}/classes/${schoolId}`,
        {
          className: newClassName,
          classNumber: Number(newClassNumber),
        }
      );

      await fetchClasses();

      setNewClassName("");
      setNewClassNumber("");

      setOpenClassDialog(false);

    } catch (err) {

      console.error("Add Class Error :", err);

    }
  };

  // ================= DELETE CLASS =================
  const handleDeleteClass = async (classId) => {

    try {

      await axios.delete(
        `${BASE_URL}/classes/${schoolId}/${classId}`
      );

      await fetchClasses();

    } catch (err) {

      console.error("Delete Class Error :", err);

    }
  };

  // ================= ADD SUBJECT =================
  const handleAddSubject = async () => {

    if (
      !newSubject.trim() ||
      !currentClass
    ) return;

    try {

      await axios.post(
        `${BASE_URL}/subjects/${schoolId}/${currentClass.id}`,
        null,
        {
          params: {
            subjectName: newSubject,
          },
        }
      );

      await fetchClasses();

      setNewSubject("");

      setOpenSubjectDialog(false);

    } catch (err) {

      console.error(
        "Add Subject Error :",
        err.response?.data || err
      );

    }
  };

  // ================= DELETE SUBJECT =================
  const handleDeleteSubject = async (
    classId,
    subjectName
  ) => {

    try {

      await axios.delete(
        `${BASE_URL}/classes/${schoolId}/${classId}/subject`,
        {
          params: {
            subjectName,
          },
        }
      );

      await fetchClasses();

    } catch (err) {

      console.error(
        "Delete Subject Error :",
        err.response?.data || err
      );

    }
  };

  // ================= ADD SECTION =================
  const handleAddSection = async () => {

    if (!newSection.trim()) {
      alert("Enter section name");
      return;
    }

    if (!currentClass?.id) {
      alert("Class not selected");
      return;
    }

    try {

      await axios.post(
        `${BASE_URL}/sections/${schoolId}/${currentClass.id}`,
        null,
        {
          params: {
            sectionName: newSection,
          },
        }
      );

      await fetchClasses();

      setNewSection("");

      setOpenSectionDialog(false);

    } catch (err) {

      console.error(
        "Add Section Error :",
        err.response?.data || err.message
      );

    }
  };

  // ================= DELETE SECTION =================
  const handleDeleteSection = async (
    classId,
    sectionId
  ) => {

    try {

      await axios.delete(
        `${BASE_URL}/sections/${schoolId}/${classId}/${sectionId}`
      );

      await fetchClasses();

    } catch (err) {

      console.error(
        "Delete Section Error :",
        err.response?.data || err
      );

    }
  };

  // ================= UPDATE SECTION =================
  const handleUpdateSection = async () => {

    if (!editSectionName.trim()) return;

    try {

      await axios.put(
        `${BASE_URL}/sections/${schoolId}/${currentClass.id}/${editingSection.id}`,
        {
          sectionName: editSectionName,
        }
      );

      await fetchClasses();

      setOpenEditSectionDialog(false);

      setEditingSection(null);

      setEditSectionName("");

    } catch (err) {

      console.error(
        "Update Section Error :",
        err.response?.data || err
      );

    }
  };

  // ================= TOGGLE =================
  const toggleDetails = (index) => {

    setOpenIndex(
      openIndex === index ? null : index
    );

  };

  return (

    <div className="min-h-screen bg-gray-100 p-6 flex flex-col gap-6">

      {/* ================= TOP CARD ================= */}
      <Card className="shadow-lg border border-blue-gray-100">

        <CardBody className="flex flex-col md:flex-row justify-between items-center gap-4">

          <div>

            <Typography
              variant="h4"
              className="font-bold text-blue-gray-900"
            >
              Academic Management
            </Typography>

            <Typography className="text-gray-600 mt-1">
              Manage Classes, Sections & Subjects
            </Typography>

          </div>

          <div className="flex gap-3 flex-wrap">

            <Chip
              value={`Total Classes : ${classes.length}`}
              color="blue"
            />

            <Button
              color="blue"
              className="flex items-center gap-2"
              onClick={() =>
                setOpenClassDialog(true)
              }
            >
              <PlusIcon className="h-4 w-4" />

              Add Class
            </Button>

          </div>

        </CardBody>

      </Card>

      {/* ================= CLASS LIST ================= */}
      {classes.map((cls, index) => {

        const hasComputer =
          cls.subjects?.some(
            (s) =>
              s?.subjectName?.toLowerCase() ===
              "computer science"
          );

        return (

          <Card
            key={cls.id}
            className="shadow-md border border-blue-gray-50"
          >

            {/* ================= HEADER ================= */}
            <CardHeader
              floated={false}
              shadow={false}
              className="m-0 rounded-none bg-gradient-to-r from-blue-600 to-indigo-600 p-5"
            >

              <div className="flex justify-between items-start flex-wrap gap-4">

                {/* LEFT */}
                <div>

                  <Typography
                    variant="h5"
                    color="white"
                    className="font-bold"
                  >
                    {cls.className}
                  </Typography>

                  <Typography
                    color="white"
                    className="text-sm opacity-80 mt-1"
                  >
                    Sections
                  </Typography>

                  {/* ================= SECTIONS ================= */}
                  <div className="flex flex-wrap gap-2 mt-3">

                    {cls.sections?.length > 0 ? (

                      cls.sections.map((sec) => (

                        <div
                          key={sec.id}
                          className="group relative bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-white text-sm font-medium hover:bg-white/30 transition"
                        >

                          {sec.sectionName}

                          {/* ACTIONS */}
                          <div className="absolute hidden group-hover:flex items-center gap-1 -top-3 -right-3 bg-white rounded-full shadow-lg p-1">

                            <IconButton
                              size="sm"
                              color="blue"
                              onClick={() => {

                                setCurrentClass(cls);

                                setEditingSection(sec);

                                setEditSectionName(
                                  sec.sectionName
                                );

                                setOpenEditSectionDialog(true);

                              }}
                            >
                              <PencilIcon className="h-3 w-3" />
                            </IconButton>

                            <IconButton
                              size="sm"
                              color="red"
                              onClick={() =>
                                handleDeleteSection(
                                  cls.id,
                                  sec.id
                                )
                              }
                            >
                              <TrashIcon className="h-3 w-3" />
                            </IconButton>

                          </div>

                        </div>

                      ))

                    ) : (

                      <Typography
                        color="white"
                        className="text-sm opacity-80"
                      >
                        No Sections
                      </Typography>

                    )}

                  </div>

                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2 flex-wrap">

                  <Chip
                    value={`${cls.subjects?.length || 0} Subjects`}
                    className="bg-white text-blue-700"
                  />

                  {/* ADD SECTION */}
                  <Button
                    size="sm"
                    color="green"
                    className="flex items-center gap-2"
                    onClick={() => {

                      setCurrentClass(cls);

                      setOpenSectionDialog(true);

                    }}
                  >
                    <PlusIcon className="h-4 w-4" />

                    Add Section
                  </Button>

                  {/* DELETE CLASS */}
                  <IconButton
                    color="red"
                    size="sm"
                    onClick={() =>
                      handleDeleteClass(cls.id)
                    }
                  >
                    <TrashIcon className="h-4 w-4" />
                  </IconButton>

                </div>

              </div>

            </CardHeader>

            {/* ================= BODY ================= */}
            <CardBody>

              {/* TOP ACTIONS */}
              <div className="flex justify-between items-center flex-wrap gap-3">

                <div>

                  <Typography className="font-semibold text-blue-gray-700">
                    Subject Management
                  </Typography>

                  <Typography
                    variant="small"
                    className="text-gray-500"
                  >
                    Add & manage class subjects
                  </Typography>

                </div>

                <div className="flex gap-2 flex-wrap">

                  <Button
                    size="sm"
                    color="blue"
                    onClick={() =>
                      toggleDetails(index)
                    }
                  >
                    {openIndex === index
                      ? "Hide Subjects"
                      : "View Subjects"}
                  </Button>

                  <Button
                    size="sm"
                    color="green"
                    className="flex items-center gap-2"
                    onClick={() => {

                      setCurrentClass(cls);

                      setOpenSubjectDialog(true);

                    }}
                  >
                    <PlusIcon className="h-4 w-4" />

                    Add Subject
                  </Button>

                </div>

              </div>

              {/* ================= SUBJECTS ================= */}
              {openIndex === index && (

                <div className="mt-5">

                  {cls.subjects?.length === 0 ? (

                    <div className="bg-gray-100 rounded-lg p-4">

                      <Typography className="text-gray-500">
                        No subjects available
                      </Typography>

                    </div>

                  ) : (

                    <div className="flex flex-wrap gap-3">

                      {cls.subjects.map((sub, i) => (

                        <div
                          key={i}
                          className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full"
                        >

                          <BookOpenIcon className="h-4 w-4 text-blue-700" />

                          <Typography
                            variant="small"
                            className="font-medium"
                          >
                            {sub.subjectName}
                          </Typography>

                          <IconButton
                            size="sm"
                            color="red"
                            onClick={() =>
                              handleDeleteSubject(
                                cls.id,
                                sub.subjectName
                              )
                            }
                          >
                            <TrashIcon className="h-3 w-3" />
                          </IconButton>

                        </div>

                      ))}

                    </div>

                  )}

                </div>

              )}

              {/* ================= FEATURES ================= */}
              <div className="mt-6 flex gap-3 flex-wrap">

                <Chip
                  value="✔ Exams Enabled"
                  color="green"
                />

                <Chip
                  value="✔ Practical"
                  color="blue"
                />

                {hasComputer && (

                  <Chip
                    value="✔ Computer Lab"
                    color="purple"
                  />

                )}

              </div>

            </CardBody>

          </Card>

        );
      })}

      {/* ================= ADD CLASS ================= */}
      <Dialog
        open={openClassDialog}
        handler={setOpenClassDialog}
      >

        <DialogHeader>
          Create New Class
        </DialogHeader>

        <DialogBody>

          <div className="flex flex-col gap-4">

            <Input
              label="Class Name"
              value={newClassName}
              onChange={(e) =>
                setNewClassName(e.target.value)
              }
            />

            <Input
              type="number"
              label="Class Number"
              value={newClassNumber}
              onChange={(e) =>
                setNewClassNumber(e.target.value)
              }
            />

          </div>

        </DialogBody>

        <DialogFooter>

          <Button
            variant="text"
            onClick={() =>
              setOpenClassDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="blue"
            onClick={handleAddClass}
          >
            Create Class
          </Button>

        </DialogFooter>

      </Dialog>

      {/* ================= ADD SUBJECT ================= */}
      <Dialog
        open={openSubjectDialog}
        handler={setOpenSubjectDialog}
      >

        <DialogHeader>
          Add Subject
        </DialogHeader>

        <DialogBody>

          <Input
            label="Subject Name"
            value={newSubject}
            onChange={(e) =>
              setNewSubject(e.target.value)
            }
          />

        </DialogBody>

        <DialogFooter>

          <Button
            variant="text"
            onClick={() =>
              setOpenSubjectDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="green"
            onClick={handleAddSubject}
          >
            Add Subject
          </Button>

        </DialogFooter>

      </Dialog>

      {/* ================= ADD SECTION ================= */}
      <Dialog
        open={openSectionDialog}
        handler={setOpenSectionDialog}
      >

        <DialogHeader>
          Add Section
        </DialogHeader>

        <DialogBody>

          <Input
            label="Section Name"
            value={newSection}
            onChange={(e) =>
              setNewSection(e.target.value)
            }
          />

        </DialogBody>

        <DialogFooter>

          <Button
            variant="text"
            onClick={() =>
              setOpenSectionDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="green"
            onClick={handleAddSection}
          >
            Add Section
          </Button>

        </DialogFooter>

      </Dialog>

      {/* ================= EDIT SECTION ================= */}
      <Dialog
        open={openEditSectionDialog}
        handler={setOpenEditSectionDialog}
      >

        <DialogHeader>
          Edit Section
        </DialogHeader>

        <DialogBody>

          <Input
            label="Section Name"
            value={editSectionName}
            onChange={(e) =>
              setEditSectionName(e.target.value)
            }
          />

        </DialogBody>

        <DialogFooter>

          <Button
            variant="text"
            onClick={() =>
              setOpenEditSectionDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            color="blue"
            onClick={handleUpdateSection}
          >
            Update
          </Button>

        </DialogFooter>

      </Dialog>

    </div>
  );
}

export default CreatClassAndSubject;