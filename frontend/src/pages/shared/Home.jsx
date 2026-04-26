import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="container page-wrapper flex items-center">
      <div className="grid grid-2 items-center">
        <div>
          <h1 style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>
            Hire Smarter with <span className="text-gradient">AI-Powered</span> Resume Parsing
          </h1>
          <p style={{ fontSize: "1.2rem", marginBottom: "2.5rem" }}>
            Automate your recruitment pipeline. Upload candidate resumes, extract key skills instantly, and perfectly match them to your open job requirements.
          </p>
          <div className="flex gap-4">
            {user ? (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
                  Start Free Trial
                </Link>
                <Link to="/login" className="btn btn-outline" style={{ padding: "1rem 2rem", fontSize: "1.1rem" }}>
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Decorative elements for the landing page */}
        <div style={{ position: "relative", height: "400px" }}>
          <div className="glass-card" style={{ position: "absolute", top: "10%", right: "10%", width: "80%", zIndex: 2 }}>
            <div className="flex justify-between items-center mb-4">
              <h3 style={{ margin: 0 }}>Senior Frontend Developer</h3>
              <span className="text-primary font-weight-bold">92% Match</span>
            </div>
            <div className="flex gap-2" style={{ flexWrap: "wrap" }}>
              <span style={{ padding: "0.2rem 0.6rem", background: "rgba(99, 102, 241, 0.2)", borderRadius: "1rem", fontSize: "0.8rem", color: "#818cf8" }}>React</span>
              <span style={{ padding: "0.2rem 0.6rem", background: "rgba(99, 102, 241, 0.2)", borderRadius: "1rem", fontSize: "0.8rem", color: "#818cf8" }}>TypeScript</span>
              <span style={{ padding: "0.2rem 0.6rem", background: "rgba(99, 102, 241, 0.2)", borderRadius: "1rem", fontSize: "0.8rem", color: "#818cf8" }}>Node.js</span>
            </div>
          </div>
          
          <div className="glass-card" style={{ position: "absolute", bottom: "10%", left: "0", width: "70%", opacity: 0.8 }}>
             <p style={{ fontSize: "0.9rem", margin: 0 }}>Extracting from resume.pdf...</p>
             <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.1)", marginTop: "1rem", borderRadius: "2px", overflow: "hidden" }}>
                <div style={{ width: "65%", height: "100%", background: "var(--primary-color)" }}></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
