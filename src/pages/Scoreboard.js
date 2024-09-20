import React, { useEffect, useState } from "react";

const Scoreboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("https://quiz-app-backend-five-sigma.vercel.app/v1/users");
        const myRes = await response.json();
        const data = myRes.data;
        setUsers(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Calculate total score, time taken, and ranking for each user
  const calculateScoresAndRankings = (users) => {
    const usersWithScores = users.map((user) => {
      const totalScore = user.quizzes.reduce(
        (acc, quiz) => acc + quiz.score,
        0
      );
      const totalTime = user.quizzes.reduce(
        (acc, quiz) => acc + quiz.timeTaken,
        0
      );
      return {
        ...user,
        totalScore,
        totalTime,
      };
    });

    // Sort users by total score in descending order and assign ranks
    const sortedUsers = usersWithScores.sort(
      (a, b) => b.totalScore - a.totalScore
    );
    return sortedUsers.map((user, index) => ({
      ...user,
      rank: index + 1,
    }));
  };

  const usersWithScoresAndRankings = calculateScoresAndRankings(users);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Scoreboard</h1>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <div className="overflow-x-auto w-full max-w-4xl">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border">Rank</th>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Total Score</th>
                <th className="py-2 px-4 border">Total Time Taken (s)</th>
              </tr>
            </thead>
            <tbody>
              {usersWithScoresAndRankings.map((user) => (
                <tr key={user._id} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border">{user.rank}</td>
                  <td className="py-2 px-4 border">{user.name}</td>
                  <td className="py-2 px-4 border">{user.totalScore}</td>
                  <td className="py-2 px-4 border">{user.totalTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Scoreboard;
