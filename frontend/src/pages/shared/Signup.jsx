import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidate");
  const [error, setError] = useState("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await signup(name, email, password, role);
      navigate(role === "recruiter" ? "/dashboard" : "/candidate/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create account");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-32 pb-12 px-6 bg-dark-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -right-1/4 size-[500px] bg-primary-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -left-1/4 size-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-lg relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="glass-card p-10 space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-black text-white tracking-tight">Create Account</h1>
            <p className="text-gray-400 font-medium">Join the next generation of AI-powered recruitment</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3 animate-in shake-2">
              <div className="size-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Full Name</label>
              <input
                type="text"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all placeholder:text-gray-600 font-medium"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="John Doe"
              />
            </div>

            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Email Address</label>
              <input
                type="email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all placeholder:text-gray-600 font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="name@example.com"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Join as</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole("candidate")}
                  className={cn(
                    "px-6 py-4 rounded-2xl border font-bold text-sm transition-all",
                    role === "candidate" 
                      ? "bg-primary-500/20 border-primary-500 text-primary-400 shadow-lg shadow-primary-500/10" 
                      : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                  )}
                >
                  Candidate
                </button>
                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={cn(
                    "px-6 py-4 rounded-2xl border font-bold text-sm transition-all",
                    role === "recruiter" 
                      ? "bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/10" 
                      : "bg-white/5 border-white/10 text-gray-500 hover:bg-white/10"
                  )}
                >
                  Recruiter
                </button>
              </div>
            </div>
            
            <div className="space-y-2 col-span-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Password</label>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all placeholder:text-gray-600 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                minLength="6"
              />
            </div>

            <button type="submit" className="primary-button col-span-2 py-4 text-sm tracking-wide mt-4">
              Create Account
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm font-medium pt-4 border-t border-white/5">
            Already have an account? <Link to="/login" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
