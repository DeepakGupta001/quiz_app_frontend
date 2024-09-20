import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const QuizHome = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await fetch("https://quiz-app-backend-five-sigma.vercel.app/v1/quizzes");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setQuizzes(data.data); // Adjust based on your API response structure
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  const handleNameSubmit = async (name) => {
    setUserName(name);
    setIsModalOpen(false); // Close modal after name submission

    // POST the username to the specified endpoint
    try {
      const response = await fetch("https://quiz-app-backend-five-sigma.vercel.app/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }), // Send the name in the body
      });

      if (!response.ok) {
        throw new Error("Failed to submit username");
      }

      // Optionally handle the response if needed
      const myRes = await response.json();
      const data = myRes.data;
      setUserId(data._id);
      console.log("User submitted:", data);
    } catch (error) {
      console.error("Error submitting username:", error);
    }
  };

  const handleStartQuiz = (quizId) => {
    navigate(`/quizzes/${quizId}/${userId}`); 
  };

  if (loading) {
    return <p className="text-center">Loading quizzes...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleNameSubmit}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 flex-grow">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Available Quizzes
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white p-6 shadow-md rounded-md text-center"
            >
              <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
              <p className="mb-4">{quiz.description}</p>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                onClick={() => handleStartQuiz(quiz._id)} // Call function on button click
              >
                Start
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizHome;
