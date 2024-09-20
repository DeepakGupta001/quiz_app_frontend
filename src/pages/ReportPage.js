import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ReportPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, timeTaken, correctAnswers, percentage, answers, questions } =
    location.state || {};

  // Check if required data exists before rendering the report
  console.log(score, timeTaken, correctAnswers, percentage, answers, questions);
  if (!correctAnswers || !answers || !questions) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
        <p className="text-lg font-semibold">Error: Report data is missing.</p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="bg-white p-6 shadow-md rounded-md max-w-lg w-full">
        <h1 className="text-3xl font-bold mb-6 text-center">Quiz Report</h1>
        <p className="text-lg mb-2">
          <strong>Score:</strong> {score}
        </p>
        <p className="text-lg mb-2">
          <strong>Time Taken:</strong> {Math.floor(timeTaken / 60)}m{" "}
          {timeTaken % 60}s
        </p>
        <p className="text-lg mb-2">
          <strong>Percentage:</strong> {percentage}%
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-4">Answers</h2>
        <div className="space-y-4">
          {questions.map((question, index) => (
            <div key={index} className="border-b-2 pb-4">
              <p>
                <strong>Question {index + 1}:</strong> {question.questionText}
              </p>
              <p className="text-green-500">
                <strong>Correct Answer:</strong> {correctAnswers[index]}
              </p>
              <p className="text-blue-500">
                <strong>Your Answer:</strong> {answers[index] || "No answer"}
              </p>
            </div>
          ))}
        </div>

        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-md mt-6"
          onClick={() => navigate("/")}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default ReportPage;
