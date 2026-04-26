import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
      <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center gap-4 pointer-events-auto shadow-2xl shadow-black/50 pr-4">
        <Link to="/" className="flex items-center gap-3 px-6 mr-2 group">
          <div className="size-8 rounded-xl bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <svg className="size-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.912 5.813h6.112l-4.944 3.592 1.888 5.795-4.968-3.592-4.968 3.592 1.888-5.795-4.944-3.592h6.112z"/></svg>
          </div>
          <span className="text-white font-black tracking-tighter text-lg group-hover:text-primary-400 transition-colors">ATS<span className="text-primary-500">PRO</span></span>
        </Link>

        <div className="h-6 w-px bg-white/10 mx-2" />

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link 
                to={user.role === "candidate" ? "/candidate/dashboard" : "/dashboard"} 
                className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all"
              >
                Dashboard
              </Link>
              {user.role === "candidate" && (
                <Link to="/candidate/upload" className="px-5 py-2.5 rounded-2xl text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-all">
                  Scan Resume
                </Link>
              )}
              
              <div className="h-6 w-px bg-white/10 mx-2" />
              
              <div className="flex items-center gap-4 pl-2">
                <div className="hidden md:flex flex-col items-end">
                  <span className="text-white text-xs font-bold leading-none">{user.username}</span>
                  <span className="text-primary-500 text-[10px] font-black uppercase tracking-tighter leading-none mt-1">{user.role}</span>
                </div>
                <button onClick={handleLogout} className="px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-rose-400 text-xs font-black uppercase tracking-widest hover:bg-rose-500/10 hover:border-rose-500/20 transition-all cursor-pointer">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="px-6 py-2.5 text-sm font-bold text-gray-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-6 py-2.5 rounded-2xl bg-primary-500 text-white text-sm font-black shadow-lg shadow-primary-500/25 hover:bg-primary-400 hover:-translate-y-0.5 active:translate-y-0 transition-all">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
