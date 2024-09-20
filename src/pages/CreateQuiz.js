import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const CreateQuiz = () => {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: null },
  ]);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const navigate = useNavigate();

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: null },
    ]);
  };

  const handleRemoveQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);
    } else {
      setErrorMessage("At least one question is required.");
    }
  };

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    if (field === "questionText") {
      updatedQuestions[index].questionText = value;
    } else if (field.startsWith("option")) {
      updatedQuestions[index].options[field.charAt(6)] = value;
    } else if (field === "correctAnswer") {
      updatedQuestions[index].correctAnswer = value; // Store the index of the correct answer
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message

    // Validate that each question has a correct answer selected
    for (let i = 0; i < questions.length; i++) {
      if (questions[i].correctAnswer === null) {
        setErrorMessage(
          `Please select the correct answer for question ${i + 1}`
        );
        return; // Stop submission if validation fails
      }
    }

    const quizData = {
      title,
      description,
      questions: questions.map((q) => ({
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.options[q.correctAnswer], // Use the selected correct answer
      })),
    };

    try {
      const response = await fetch("https://quiz-app-backend-five-sigma.vercel.app/v1/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
        body: JSON.stringify(quizData),
      });

      if (response.ok) {
        navigate("/admin"); // Redirect to admin panel after creation
      } else {
        setErrorMessage("Failed to create quiz. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Error creating quiz. Please try again.");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Create Quiz</h1>
      {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}{" "}
      {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter quiz title"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded p-2"
            placeholder="Enter quiz description"
            required
          />
        </div>
        {questions.map((q, index) => (
          <div key={index} className="mb-4">
            <label className="block mb-1">Question {index + 1}</label>
            <input
              type="text"
              value={q.questionText}
              onChange={(e) =>
                handleQuestionChange(index, "questionText", e.target.value)
              }
              className="w-full border rounded p-2"
              placeholder="Enter question text"
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
                  placeholder={`Option ${i + 1}`}
                  required
                />
                <label className="ml-2">
                  <input
                    type="radio"
                    name={`correctAnswer${index}`}
                    value={i}
                    onChange={() =>
                      handleQuestionChange(index, "correctAnswer", i)
                    }
                  />
                  Correct
                </label>
              </div>
            ))}
            <button
              type="button"
              onClick={() => handleRemoveQuestion(index)}
              className="text-red-500 hover:underline"
            >
              Remove Question
            </button>
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
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;
