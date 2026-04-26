import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden flex items-center pt-20">
      {/* Background Glows */}
      <div className="absolute top-0 -left-[10%] size-[800px] bg-primary-600/10 blur-[160px] rounded-full" />
      <div className="absolute bottom-0 -right-[10%] size-[800px] bg-indigo-600/10 blur-[160px] rounded-full" />
      
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
        <div className="space-y-10 animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-primary-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            v2.0 Now Powered by Puter AI
          </div>

          <h1 className="text-7xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
            Hire Smarter with <span className="text-gradient">AI.</span>
          </h1>
          
          <p className="text-gray-400 text-xl font-medium max-w-xl leading-relaxed">
            The next generation of recruitment. Benchmark resumes against global standards, extract deep insights, and find your perfect match in seconds.
          </p>
          
          <div className="flex flex-wrap gap-6 pt-4">
            {user ? (
              <Link 
                to={user.role === "candidate" ? "/candidate/dashboard" : "/dashboard"} 
                className="px-10 py-5 rounded-2xl bg-white text-black font-black text-lg hover:bg-primary-500 hover:text-white transition-all shadow-2xl shadow-white/5 active:scale-95"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link 
                  to="/signup" 
                  className="px-10 py-5 rounded-2xl bg-primary-500 text-white font-black text-lg hover:bg-primary-400 transition-all shadow-2xl shadow-primary-500/20 active:scale-95"
                >
                  Get Started
                </Link>
                <Link 
                  to="/login" 
                  className="px-10 py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-lg hover:bg-white/10 transition-all active:scale-95"
                >
                  Member Login
                </Link>
              </>
            )}
          </div>
        </div>
        
        {/* Visual Mockup */}
        <div className="relative hidden lg:block animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
          <div className="relative z-20 glass-card p-8 space-y-6 rotate-2 hover:rotate-0 transition-transform duration-700 cursor-default shadow-3xl">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <h3 className="text-white font-black tracking-tight text-xl">Senior Product Designer</h3>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Candidate ID: #8821</p>
              </div>
              <div className="size-16 rounded-2xl bg-primary-500/10 border border-primary-500/20 flex flex-col items-center justify-center">
                <span className="text-primary-400 font-black text-xl leading-none">94</span>
                <span className="text-primary-500 text-[8px] font-black uppercase mt-1">Score</span>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full w-[94%] bg-linear-to-r from-primary-600 to-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]" />
              </div>
              <div className="flex flex-wrap gap-2">
                {['Figma', 'React', 'Prototyping', 'User Research'].map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
              <div className="flex -space-x-3">
                {[1,2,3].map(i => (
                  <div key={i} className="size-8 rounded-full border-2 border-dark-900 bg-dark-800" />
                ))}
              </div>
              <span className="text-primary-400 text-[10px] font-black uppercase tracking-widest">Matched by AI engine</span>
            </div>
          </div>

          {/* Secondary Mockup */}
          <div className="absolute -bottom-10 -left-10 z-10 glass-card p-6 w-72 -rotate-3 hover:rotate-0 transition-transform duration-700 shadow-2xl opacity-80">
             <div className="flex items-center gap-4 mb-4">
               <div className="size-10 rounded-xl bg-indigo-500/20 flex items-center justify-center">
                 <div className="size-2 rounded-full bg-indigo-400 animate-pulse" />
               </div>
               <div>
                 <p className="text-white text-xs font-bold">Scanning...</p>
                 <p className="text-gray-500 text-[10px]">resume_v2_final.pdf</p>
               </div>
             </div>
             <div className="space-y-2">
               <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                 <div className="h-full w-2/3 bg-indigo-500 animate-[loading_2s_ease-in-out_infinite]" />
               </div>
               <div className="flex justify-between text-[8px] font-black uppercase text-gray-600 tracking-tighter">
                 <span>Parsing Content</span>
                 <span>67%</span>
               </div>
             </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[450px] border border-white/5 rounded-full animate-[spin_20s_linear_infinite]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[300px] border border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
        </div>
      </div>
    </div>
  );
};

export default Home;
