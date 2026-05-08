import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';

import { ProjectProvider } from './context/ProjectContext';

import Sidebar from './components/Layout/Sidebar';
import Navbar from './components/Layout/Navbar';

import Dashboard from './pages/Dashboard';
import ResumeUpload from './pages/ResumeUpload';
import JobDescription from './pages/JobDescription';
import Ranking from './pages/Ranking';
import Login from './pages/Login';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  // TEMPORARY
  // later replace with real auth
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <ProjectProvider>
      <Router>
        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/login" element={<Login />} />

          {/* PROTECTED ROUTES */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <Layout>
                  <ResumeUpload />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/job-description"
            element={
              <ProtectedRoute>
                <Layout>
                  <JobDescription />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/results"
            element={
              <ProtectedRoute>
                <Layout>
                  <Ranking />
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* DEFAULT ROUTES */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>
      </Router>
    </ProjectProvider>
  );
}

export default App;