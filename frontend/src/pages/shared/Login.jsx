import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError("");
      const res = await login(email, password);
      navigate(res.user.role === "recruiter" ? "/dashboard" : "/candidate/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center pt-24 pb-12 px-6 bg-dark-950 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/4 -left-1/4 size-[500px] bg-primary-500/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-1/4 size-[500px] bg-indigo-500/10 blur-[120px] rounded-full" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-700">
        <div className="glass-card p-10 space-y-8">
          <div className="text-center space-y-2">
            <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
              <img src="/favicon.svg" alt="Logo" className="size-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight">Welcome Back</h1>
            <p className="text-gray-400 font-medium">Login to your premium assessment portal</p>
          </div>

          {error && (
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-400 text-sm font-bold flex items-center gap-3 animate-in shake-2">
              <div className="size-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
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
            
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Password</label>
                <Link to="#" className="text-[10px] font-black uppercase tracking-widest text-primary-400 hover:text-primary-300 transition-colors">Forgot?</Link>
              </div>
              <input
                type="password"
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500/50 transition-all placeholder:text-gray-600 font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
              />
            </div>

            <button type="submit" className="primary-button w-full py-4 text-sm tracking-wide">
              Sign In
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm font-medium pt-4 border-t border-white/5">
            Don't have an account? <Link to="/signup" className="text-primary-400 font-bold hover:text-primary-300 transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
