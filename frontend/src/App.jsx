import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SharedNavbar from "./components/shared/Navbar";
import CandidateNavbar from "./components/candidate/CandidateNavbar";
import Home from "./pages/shared/Home";
import Login from "./pages/shared/Login";
import Signup from "./pages/shared/Signup";
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateJob from "./pages/recruiter/CreateJob";
import UploadResume from "./pages/recruiter/UploadResume";
import MatchResults from "./pages/recruiter/MatchResults";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import CandidateUpload from "./pages/candidate/CandidateUpload";
import AnalysisReport from "./pages/candidate/AnalysisReport";
import "./index.css";

// A simple PrivateRoute wrapper
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={user.role === "candidate" ? "/candidate/dashboard" : "/dashboard"} />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();
  const isCandidate = user?.role === "candidate";

  return (
    <div className="min-h-screen bg-gray-950 text-white selection:bg-primary-500/30 selection:text-primary-200">
      {/* Dynamic Navbar selection */}
      {!isCandidate ? <SharedNavbar /> : <CandidateNavbar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Recruiter Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <RecruiterDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/jobs/new" 
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <CreateJob />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/upload" 
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <UploadResume />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/matches/:jobId" 
          element={
            <PrivateRoute allowedRoles={["recruiter"]}>
              <MatchResults />
            </PrivateRoute>
          } 
        />

        {/* Candidate Routes */}
        <Route 
          path="/candidate/dashboard" 
          element={
            <PrivateRoute allowedRoles={["candidate"]}>
              <CandidateDashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/candidate/upload" 
          element={
            <PrivateRoute allowedRoles={["candidate"]}>
              <CandidateUpload />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/candidate/report/:id" 
          element={
            <PrivateRoute allowedRoles={["candidate"]}>
              <AnalysisReport />
            </PrivateRoute>
          } 
        />
        
        {/* Redirect candidate analysis to report if needed */}
        <Route path="/candidate/analysis/:id" element={<Navigate to="/candidate/report/:id" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;

