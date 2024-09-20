// src/pages/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Quiz App</h1>
          <nav className="flex space-x-6">
            <Link
              to="/quizzes"
              className="text-black hover:underline"
            >
              Take a Quiz
            </Link>
            <Link
              to="/login"
              className="text-black hover:underline"
            >
              Admin Login
            </Link>
            <Link
              to="/scoreboard"
              className="text-black hover:underline"
            >
              Scoreboard
            </Link>
          </nav>
        </div>
      </header>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold mb-6">Welcome to the Quiz App</h1>
      </div>
    </div>
  );
};

export default HomePage;
