// src/pages/AdminPanel.js
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [quizzes, setQuizzes] = useState([]); // Ensure this is initialized as an array
  const [loading, setLoading] = useState(true);
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchQuizzes = async () => {
    try {
      const response = await fetch("https://quiz-app-backend-five-sigma.vercel.app/v1/quizzes"); // Update this endpoint accordingly
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const responseMy = await response.json();
      const data = responseMy.data;
      // console.log(data);
      if (Array.isArray(data)) {
        setQuizzes(data);
      } else {
        console.error("Expected an array of quizzes, but got:", data);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId) => {
    // Call API to delete quiz
    await fetch(`https://quiz-app-backend-five-sigma.vercel.app/v1/quizzes/${quizId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
      },
    });
    setQuizzes(quizzes.filter((quiz) => quiz.id !== quizId)); // Update local state
    fetchQuizzes();
  };

  const handleLogout = () => {
    navigate("/");
    logout();
  };

  if (!isAuthenticated) {
    return <p>Unauthorized access. Please log in first.</p>;
  }

  return (
    <div className="flex">
      <nav className="bg-gray-800 text-white w-64 min-h-screen p-4">
        <h2 className="text-lg font-bold mb-4">Admin Panel</h2>
        <ul>
          <li className="mb-2">
            <a href="#" className="hover:underline">
              All Quizzes
            </a>
          </li>
          <li className="mb-2">
            <a href="/create-quiz" className="hover:underline">
              Create New Quiz
            </a>
          </li>
        </ul>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </nav>
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-2xl font-bold mb-4">Manage Quizzes</h1>
        {loading ? (
          <p>Loading quizzes...</p>
        ) : (
          <table className="min-w-full bg-white border border-gray-300 text-center">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Description</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-2 px-4 border-b">
                    No quizzes available
                  </td>
                </tr>
              ) : (
                quizzes.map((quiz) => (
                  <tr key={quiz.id}>
                    <td className="py-2 px-4 border-b">{quiz.title}</td>
                    <td className="py-2 px-4 border-b">{quiz.description}</td>
                    <td className="py-2 px-4 border-b">
                      <a
                        href={`/edit-quiz/${quiz._id}`}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </a>
                      <button
                        onClick={() => handleDelete(quiz._id)}
                        className="text-red-500 hover:underline ml-4"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
