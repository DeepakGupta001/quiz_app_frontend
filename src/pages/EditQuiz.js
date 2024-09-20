import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const EditQuiz = () => {
  const { token } = useContext(AuthContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState({
    title: "",
    description: "",
    questions: [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `https://quiz-app-backend-five-sigma.vercel.app/v1/quizzes?id=${id}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const myRes = await response.json();
        const data = myRes.data;
        if (Array.isArray(data)) {
          setQuiz(data[0]);
        } else {
          console.error("Expected an array of quizzes, but got:", data);
        }
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...quiz.questions];
    if (field === "questionText") {
      // Use 'questionText' to match the field name in the data
      updatedQuestions[index].questionText = value;
    } else if (field.startsWith("option")) {
      updatedQuestions[index].options[field.charAt(6)] = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[index].correctAnswer = value;
    }
    setQuiz({ ...quiz, questions: updatedQuestions });
  };

  const handleAddQuestion = () => {
    setQuiz({
      ...quiz,
      questions: [
        ...quiz.questions,
        { question: "", options: ["", "", "", ""], correctAnswer: "" },
      ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`https://quiz-app-backend-five-sigma.vercel.app/v1/quizzes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(quiz),
    });
    navigate("/admin"); // Redirect to admin panel after editing
  };

  if (loading) {
    return <p>Loading quiz...</p>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Edit Quiz</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={quiz.title}
            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            value={quiz.description}
            onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
            className="w-full border rounded p-2"
            required
          />
        </div>
        {quiz.questions.map((q, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-1">Question {index + 1}</label>
            <input
              type="text"
              value={q.questionText} // Ensure this is using 'questionText'
              onChange={(e) =>
                handleQuestionChange(index, "questionText", e.target.value)
              } // Use 'questionText' instead of 'question'
              className="w-full border rounded p-2"
              required
            />
            {q.options.map((option, i) => (
              <div key={i} className="flex items-center mb-2">
                <input
                  type="text"
                  value={option}
                  onChange={(e) =>
                    handleQuestionChange(index, `option${i}`, e.target.value)
                  }
                  className="border rounded p-2 w-full"
                  required
                />
                <label className="ml-2">
                  <input
                    type="radio"
                    name={`correctAnswer${index}`}
                    value={option}
                    checked={q.correctAnswer === option}
                    onChange={() =>
                      handleQuestionChange(index, "correctAnswer", option)
                    }
                  />
                  Correct
                </label>
              </div>
            ))}
          </div>
        ))}

        <button
          type="button"
          onClick={handleAddQuestion}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        >
          Add Question
        </button>
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Update Quiz
        </button>
      </form>
    </div>
  );
};

export default EditQuiz;
