import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container page-wrapper">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2>Dashboard</h2>
          <p>Welcome back, {user?.name}</p>
        </div>
      </div>

      <div className="grid grid-2 mt-4">
        {/* Candidate Stats Card */}
        <div className="glass-card flex justify-between items-center">
          <div>
            <h3>Candidates</h3>
            <p className="text-muted" style={{ margin: 0 }}>Total parsed resumes</p>
          </div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--primary-color)" }}>
            0
          </div>
        </div>

        {/* Job Stats Card */}
        <div className="glass-card flex justify-between items-center">
          <div>
            <h3>Jobs</h3>
            <p className="text-muted" style={{ margin: 0 }}>Active job postings</p>
          </div>
          <div style={{ fontSize: "2.5rem", fontWeight: "bold", color: "var(--secondary-color)" }}>
            0
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-4">
        <h3 className="mb-2">Quick Actions</h3>
        <div className="flex gap-4">
          <Link to="/upload" className="btn btn-primary">
            Upload Resumes
          </Link>
          <Link to="/jobs/new" className="btn btn-outline">
            Create Job Posting
          </Link>
        </div>
      </div>
      
      {/* We will populate the actual lists of candidates and jobs in upcoming steps */}
      <div className="mt-4 glass-card" style={{ padding: "4rem 2rem", textAlign: "center" }}>
        <p className="text-muted">Start by creating a job posting or uploading candidate resumes.</p>
      </div>
    </div>
  );
};

export default Dashboard;
