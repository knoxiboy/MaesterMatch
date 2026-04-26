import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePuterStore } from '../../lib/puter';
import { useAuth } from '../../context/AuthContext';
import { 
    Plus, 
    FileText, 
    ChevronRight, 
    Clock, 
    Calendar, 
    TrendingUp, 
    Zap, 
    Loader2,
    Trash2,
    Building2,
    LogOut
} from 'lucide-react';
import ScoreBadge from '../../components/candidate/ScoreBadge';

const AnalysisCard = ({ analysis, onClick, onDelete }) => {
    const date = new Date(analysis.timestamp).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });

    return (
        <div 
            onClick={onClick}
            className="glass-card p-6 glass-card-hover group cursor-pointer flex flex-col md:flex-row items-center gap-6 relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-1.5 h-full bg-primary-500 opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-500">
                <FileText className="size-8 text-primary-400" />
            </div>

            <div className="flex-1 space-y-2 text-center md:text-left">
                <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                    {analysis.jobTitle || `Resume Analysis #${analysis.id.slice(0, 4)}`}
                </h3>
                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 text-xs font-bold uppercase tracking-widest">
                    {analysis.companyName && (
                        <div className="flex items-center gap-1.5 text-primary-400">
                            <Building2 className="size-3" />
                            {analysis.companyName}
                        </div>
                    )}
                    <div className="flex items-center gap-1.5">
                        <Calendar className="size-3" />
                        {date}
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Clock className="size-3" />
                        {new Date(analysis.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex flex-col items-center md:items-end gap-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Score</span>
                    <ScoreBadge score={analysis.feedback.overallScore} />
                </div>
                
                <div className="flex items-center gap-2">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            onDelete(analysis.id);
                        }}
                        className="p-3 rounded-xl bg-rose-500/0 hover:bg-rose-500/10 text-gray-600 hover:text-rose-400 transition-all"
                    >
                        <Trash2 className="size-5" />
                    </button>
                    <div className="p-3 rounded-xl bg-white/5 group-hover:bg-primary-500 group-hover:text-white text-gray-400 transition-all">
                        <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const CandidateDashboard = () => {
    const navigate = useNavigate();
    const { history, fetchHistory, deleteAnalysis } = usePuterStore();
    const { logout } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            await fetchHistory();
            setLoading(false);
        };
        load();
    }, [fetchHistory]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this analysis?")) {
            await deleteAnalysis(id);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="size-12 text-primary-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Dashboard Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
                    <div className="space-y-4">
                        <span className="eyebrow">Candidate Command Center</span>
                        <h1 className="text-5xl font-black text-white tracking-tight">Your History</h1>
                        <p className="text-gray-400 text-lg font-medium max-w-lg">
                            Manage and review your previous resume iterations and AI benchmark reports.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            onClick={logout}
                            className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 font-bold hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all flex items-center gap-2 group"
                        >
                            <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
                            Logout
                        </button>
                        <button 
                            onClick={() => navigate('/candidate/upload')}
                            className="btn-primary group"
                        >
                            <Plus className="size-5 group-hover:rotate-90 transition-transform duration-300" />
                            New Analysis
                        </button>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="glass-card p-6 bg-linear-to-br from-primary-500/10 to-transparent border-primary-500/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-primary-500/20 text-primary-400">
                                <TrendingUp className="size-6" />
                            </div>
                            <span className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Growth</span>
                        </div>
                        <div className="text-3xl font-black text-white">{history.length}</div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Total Audits</div>
                    </div>

                    <div className="glass-card p-6 bg-linear-to-br from-pink-500/10 to-transparent border-pink-500/20">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-pink-500/20 text-pink-400">
                                <Zap className="size-6" />
                            </div>
                            <span className="text-[10px] font-black text-pink-400 uppercase tracking-widest">Active</span>
                        </div>
                        <div className="text-3xl font-black text-white">
                            {history.length > 0 ? Math.max(...history.map(h => h.feedback.overallScore)) : 0}
                        </div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Highest Score</div>
                    </div>

                    <div className="glass-card p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 rounded-2xl bg-white/5 text-gray-400">
                                <Clock className="size-6" />
                            </div>
                        </div>
                        <div className="text-3xl font-black text-white">
                            {history.length > 0 ? new Date(history[0].timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '--'}
                        </div>
                        <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mt-1">Last Update</div>
                    </div>
                </div>

                {/* History List */}
                <div className="space-y-4">
                    {history.length === 0 ? (
                        <div className="glass-card p-20 text-center space-y-6">
                            <div className="size-20 rounded-[32px] bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-gray-600">
                                <FileText className="size-10" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-2xl font-bold text-white">No analysis yet</h3>
                                <p className="text-gray-500 max-w-xs mx-auto">Upload your first resume to see your detailed AI report here.</p>
                            </div>
                            <button 
                                onClick={() => navigate('/candidate/upload')}
                                className="px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-white font-bold transition-all"
                            >
                                Get Started
                            </button>
                        </div>
                    ) : (
                        history.map((analysis) => (
                            <AnalysisCard 
                                key={analysis.id} 
                                analysis={analysis} 
                                onClick={() => navigate(`/candidate/report/${analysis.id}`)}
                                onDelete={handleDelete}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
