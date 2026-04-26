import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/shared/Navbar";
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

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
            path="/candidate/analysis/:id" 
            element={
              <PrivateRoute allowedRoles={["candidate"]}>
                <AnalysisReport />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
