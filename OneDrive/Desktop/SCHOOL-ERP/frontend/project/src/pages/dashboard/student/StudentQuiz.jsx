import React, { useEffect, useState } from "react";
import axios from "axios";

const StudentQuiz = () => {

  const [subjects, setSubjects] = useState([]);

  const [selectedSubject, setSelectedSubject] = useState("");

  const [quizzes, setQuizzes] = useState([]);

  const [selectedAnswers, setSelectedAnswers] = useState({});

  const [score, setScore] = useState(null);

  // ================= LOAD STUDENT SUBJECTS =================

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8080/api/student/subjects",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSubjects(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  // ================= LOAD QUIZZES =================

  const fetchQuizzes = async (subjectId) => {

    try {

      const response = await axios.get(
        `http://localhost:8080/api/quizzes/subject/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setQuizzes(response.data);

    } catch (error) {
      console.log(error);
    }
  };

  // ================= SUBJECT CHANGE =================

  const handleSubjectChange = (e) => {

    const subjectId = e.target.value;

    setSelectedSubject(subjectId);

    fetchQuizzes(subjectId);
  };

  // ================= ANSWER SELECT =================

  const handleAnswerSelect = (quizId, answer) => {

    setSelectedAnswers({
      ...selectedAnswers,
      [quizId]: answer,
    });
  };

  // ================= SUBMIT =================

  const handleSubmit = () => {

    let totalScore = 0;

    quizzes.forEach((quiz) => {

      if (selectedAnswers[quiz.id] === quiz.correctAnswer) {
        totalScore++;
      }
    });

    setScore(totalScore);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}

        <div className="bg-white rounded-3xl p-8 shadow-lg mb-8">

          <h1 className="text-4xl font-bold text-gray-800">
            Student Revision Quiz
          </h1>

          <p className="text-gray-500 mt-2">
            Practice subject-wise revision questions.
          </p>

          {/* SUBJECT SELECT */}

          <div className="mt-6">

            <label className="block mb-2 font-semibold text-gray-700">
              Select Subject
            </label>

            <select
              value={selectedSubject}
              onChange={handleSubjectChange}
              className="w-full border border-gray-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* QUIZZES */}

        <div className="space-y-6">

          {quizzes.map((quiz, index) => (

            <div
              key={quiz.id}
              className="bg-white rounded-3xl p-8 shadow-lg"
            >

              <h2 className="text-xl font-bold text-gray-800 mb-6">
                Q{index + 1}. {quiz.questionTitle}
              </h2>

              <div className="space-y-4">

                {[quiz.optionA, quiz.optionB, quiz.optionC, quiz.optionD]
                  .map((option, i) => (

                  <label
                    key={i}
                    className="flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-4 hover:bg-gray-50 cursor-pointer"
                  >

                    <input
                      type="radio"
                      name={`quiz-${quiz.id}`}
                      value={option}
                      onChange={() =>
                        handleAnswerSelect(quiz.id, option)
                      }
                    />

                    <span>{option}</span>

                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* SUBMIT */}

        {quizzes.length > 0 && (

          <button
            onClick={handleSubmit}
            className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg font-bold shadow-lg"
          >
            Submit Quiz
          </button>
        )}

        {/* SCORE */}

        {score !== null && (

          <div className="mt-8 bg-green-100 border border-green-300 rounded-3xl p-8 text-center">

            <h2 className="text-3xl font-bold text-green-700">
              Your Score: {score} / {quizzes.length}
            </h2>

          </div>
        )}
      </div>
    </div>
  );
};

export default StudentQuiz;