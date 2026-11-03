import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from './context/UserContext';

// Pages
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Lessons from './pages/Lessons';
import LessonPlayer from './pages/LessonPlayer';
import Practice from './pages/Practice';
import WritingPractice from './pages/WritingPractice';
import Exams from './pages/Exams';
import ExamPlayer from './pages/ExamPlayer';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

/**
 * ProtectedRoute — Redirects to onboarding if user hasn't completed setup
 */
function ProtectedRoute({ children }) {
  const { user } = useUser();

  if (!user.onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }

  return children;
}

/**
 * PublicRoute — Redirects to dashboard if user has already onboarded
 */
function PublicRoute({ children }) {
  const { user } = useUser();

  if (user.onboardingComplete) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

/**
 * AppRouter — Defines all application routes
 *
 * Route structure:
 * /              → Landing page (public, redirects to dashboard if onboarded)
 * /onboarding    → Multi-step onboarding flow
 * /dashboard     → Main dashboard (protected)
 * /lessons       → Lesson browser (protected)
 * /learn/:id     → Lesson player (protected)
 * /practice      → Practice/review mode (protected)
 * /profile       → User profile & settings (protected)
 * *              → 404 Not Found
 */
export default function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        {/* Public routes */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Protected routes (require onboarding) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <ProtectedRoute>
              <Lessons />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:lessonId"
          element={
            <ProtectedRoute>
              <LessonPlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exams"
          element={
            <ProtectedRoute>
              <Exams />
            </ProtectedRoute>
          }
        />
        <Route
          path="/exam/:examId"
          element={
            <ProtectedRoute>
              <ExamPlayer />
            </ProtectedRoute>
          }
        />
        <Route
          path="/writing"
          element={
            <ProtectedRoute>
              <WritingPractice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* 404 catch-all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </HashRouter>
  );
}

