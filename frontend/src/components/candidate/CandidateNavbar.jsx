import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, Upload, Sparkles, LogOut } from 'lucide-react';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();
    const isCandidate = location.pathname.startsWith('/candidate');

    if (!isCandidate) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/candidate/dashboard', icon: LayoutDashboard },
        { label: 'Upload', path: '/candidate/upload', icon: Upload },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-2xl border border-white/10 rounded-[32px] p-2 flex items-center gap-2 pointer-events-auto shadow-2xl shadow-black/50">
                <Link to="/candidate/dashboard" className="flex items-center gap-3 px-6 mr-4 group">
                    <div className="size-8 rounded-xl bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
                        <Sparkles className="size-4 text-white" />
                    </div>
                    <span className="text-white font-black tracking-tighter text-lg group-hover:text-primary-400 transition-colors">Maester<span className="text-primary-500">Match</span></span>
                </Link>

                <div className="h-6 w-px bg-white/10 mx-2" />

                <div className="flex items-center gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300",
                                    isActive 
                                        ? "bg-white/10 text-white shadow-inner" 
                                        : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                                )}
                            >
                                <Icon className={cn("size-4", isActive ? "text-primary-400" : "text-gray-600")} />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>

                <div className="h-6 w-px bg-white/10 mx-2" />

                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group"
                >
                    <LogOut className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

