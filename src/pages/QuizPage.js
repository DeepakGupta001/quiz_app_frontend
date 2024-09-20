import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Import useParams to get quizId from URL
import { useNavigate } from "react-router-dom";

const QuizPage = () => {
  const { id: quizId, userId } = useParams(); // Get quizId from URL parameters
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // Track current question
  const [selectedAnswers, setSelectedAnswers] = useState({}); // Track selected answers
  const navigate = useNavigate();
  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `https://quiz-app-backend-five-sigma.vercel.app/v1/quizzes?id=${quizId}`
        );
        const data = await response.json();
        setQuiz(data.data[0]); // Adjust based on your API response structure
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  // Timer effect
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimer((prevTime) => prevTime + 1); // Increment timer
    }, 1000);

    return () => clearInterval(timerInterval); // Cleanup on unmount
  }, []);

  // Handle answer selection
  const handleAnswerSelect = (option) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestionIndex]: option,
    }));
  };

  // Handle quiz navigation
  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz?.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  // Handle quiz submission
  const handleSubmit = async () => {
    // Ensure all questions are answered
    // if (Object.keys(selectedAnswers).length < quiz?.questions.length) {
    //   setError("Please answer all questions before submitting.");
    //   return;
    // }

    const answers = Object.values(selectedAnswers); // Get the selected answers
    const timeTaken = timer; // Total time taken in seconds

    const submissionData = {
      userId,
      quizId,
      timeTaken,
      answers,
    };

    try {
      const response = await fetch(`https://quiz-app-backend-five-sigma.vercel.app/v1/quizzes/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        throw new Error("Failed to submit quiz");
      }

      const resultData = await response.json(); // Capture the API response
      navigate("/report", {
        state: { ...resultData, questions: quiz.questions, answers }, // Pass answers
      }); // Pass the result to ReportPage
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  if (loading) {
    return <div>Loading quiz...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">{quiz?.title || "Quiz Title"}</h1>
      <div className="bg-white p-6 shadow-md rounded-md w-full max-w-lg">
        <p className="mb-4">
          Time: {Math.floor(timer / 60)}m {timer % 60}s
        </p>
        {quiz && (
          <>
            <p className="mb-4">
              Question {currentQuestionIndex + 1}:{" "}
              {quiz.questions[currentQuestionIndex]?.questionText}
            </p>
            <div className="flex flex-col space-y-2">
              {quiz.questions[currentQuestionIndex]?.options.map(
                (option, index) => (
                  <button
                    key={index}
                    className={`p-2 rounded-md ${
                      selectedAnswers[currentQuestionIndex] === option
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    {option}
                  </button>
                )
              )}
            </div>
          </>
        )}
        <div className="flex justify-between mt-6">
          <button
            onClick={handlePreviousQuestion}
            className="bg-gray-300 px-4 py-2 rounded-md"
            disabled={currentQuestionIndex === 0}
          >
            Previous
          </button>
          {currentQuestionIndex === quiz?.questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded-md"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={handleNextQuestion}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
              disabled={currentQuestionIndex === quiz?.questions.length - 1}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
