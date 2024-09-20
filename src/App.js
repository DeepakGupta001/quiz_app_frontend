// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/RegisterPage';
import AdminPanel from './pages/AdminPanel'; 
import HomePage from './pages/HomePage';
import QuizHome from './pages/QuizHome';
import CreateQuiz from './pages/CreateQuiz';
import EditQuiz from './pages/EditQuiz';
import QuizPage from './pages/QuizPage';
import ReportPage from './pages/ReportPage';
import Scoreboard from './pages/Scoreboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/quizzes" element={<QuizHome />} />
        <Route path="/create-quiz" element={<CreateQuiz />} />
        <Route path="/edit-quiz/:id" element={<EditQuiz />} />
        <Route path="/quizzes/:id/:userId" element={<QuizPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
      </Routes>
    </Router>
  );
}

export default App;
