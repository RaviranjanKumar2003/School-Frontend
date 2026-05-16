import React, { useEffect, useState } from "react";
import axios from "axios";

const CreateQuiz = () => {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [formData, setFormData] = useState({
    classId: "",
    subjectId: "",
    chapterName: "",
    questionTitle: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "",
  });

  // ================= LOAD CLASSES =================

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/classes"
      );

      setClasses(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= LOAD SUBJECTS BY CLASS =================

  const fetchSubjects = async (classId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/subjects/class/${classId}`
      );

      setSubjects(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // ================= HANDLE INPUT =================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });

    // class change
    if (name === "classId") {
      fetchSubjects(value);
    }
  };

  // ================= SUBMIT QUIZ =================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        "http://localhost:8080/api/quizzes",
        {
          subjectId: formData.subjectId,
          chapterName: formData.chapterName,
          questionTitle: formData.questionTitle,
          optionA: formData.optionA,
          optionB: formData.optionB,
          optionC: formData.optionC,
          optionD: formData.optionD,
          correctAnswer: formData.correctAnswer,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Quiz Created Successfully");

      setFormData({
        classId: "",
        subjectId: "",
        chapterName: "",
        questionTitle: "",
        optionA: "",
        optionB: "",
        optionC: "",
        optionD: "",
        correctAnswer: "",
      });

    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-3xl p-8">

        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800">
            Create Quiz Question
          </h1>

          <p className="text-gray-500 mt-2">
            Add revision questions for students.
          </p>
        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* CLASS + SUBJECT */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* CLASS */}

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Class
              </label>

              <select
                name="classId"
                value={formData.classId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose Class</option>

                {classes.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.className}
                  </option>
                ))}
              </select>
            </div>

            {/* SUBJECT */}

            <div>
              <label className="block mb-2 font-semibold text-gray-700">
                Select Subject
              </label>

              <select
                name="subjectId"
                value={formData.subjectId}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Choose Subject</option>

                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.subjectName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* CHAPTER */}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Chapter Name
            </label>

            <input
              type="text"
              name="chapterName"
              value={formData.chapterName}
              onChange={handleChange}
              placeholder="Enter chapter name"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* QUESTION */}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Question
            </label>

            <textarea
              rows="4"
              name="questionTitle"
              value={formData.questionTitle}
              onChange={handleChange}
              placeholder="Enter your question"
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          {/* OPTIONS */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <input
              type="text"
              name="optionA"
              value={formData.optionA}
              onChange={handleChange}
              placeholder="Option A"
              className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="optionB"
              value={formData.optionB}
              onChange={handleChange}
              placeholder="Option B"
              className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="optionC"
              value={formData.optionC}
              onChange={handleChange}
              placeholder="Option C"
              className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              name="optionD"
              value={formData.optionD}
              onChange={handleChange}
              placeholder="Option D"
              className="border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* CORRECT ANSWER */}

          <div>
            <label className="block mb-2 font-semibold text-gray-700">
              Correct Answer
            </label>

            <select
              name="correctAnswer"
              value={formData.correctAnswer}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Correct Answer</option>

              <option value={formData.optionA}>
                {formData.optionA || "Option A"}
              </option>

              <option value={formData.optionB}>
                {formData.optionB || "Option B"}
              </option>

              <option value={formData.optionC}>
                {formData.optionC || "Option C"}
              </option>

              <option value={formData.optionD}>
                {formData.optionD || "Option D"}
              </option>
            </select>
          </div>

          {/* BUTTON */}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 transition-all text-white py-4 rounded-2xl text-lg font-semibold shadow-lg"
          >
            Create Quiz Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuiz;