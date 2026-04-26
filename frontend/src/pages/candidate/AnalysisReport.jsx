import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { usePuterStore } from '../../lib/puter';
import Summary from '../../components/candidate/Summary';
import Details from '../../components/candidate/Details';
import { Loader2, ArrowLeft, Download, Share2, Building2 } from 'lucide-react';

const AnalysisReport = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);

    const getAnalysisById = usePuterStore(state => state.getAnalysisById);

    useEffect(() => {
        const fetchReport = async () => {
            if (!id) return;
            try {
                const data = await getAnalysisById(id);
                if (data) {
                    setReport(data);
                } else {
                    navigate('/candidate/dashboard');
                }
            } catch (err) {
                console.error("Failed to fetch report:", err);
                navigate('/candidate/dashboard');
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id, getAnalysisById, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="size-12 text-primary-500 animate-spin" />
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Retrieving Analysis...</p>
                </div>
            </div>
        );
    }

    if (!report) return null;

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Actions */}
                <div className="space-y-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <button 
                            onClick={() => navigate('/candidate/dashboard')}
                            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
                        >
                            <ArrowLeft className="size-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-sm font-bold uppercase tracking-widest">Back to Dashboard</span>
                        </button>

                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold hover:bg-white/10 transition-all">
                                <Share2 className="size-4" />
                                Share
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 border border-primary-500 rounded-2xl text-white text-sm font-bold hover:bg-primary-500 transition-all shadow-xl shadow-primary-500/20">
                                <Download className="size-4" />
                                Download PDF
                            </button>
                        </div>
                    </div>

                    {(report.jobTitle || report.companyName) && (
                        <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                            <h1 className="text-4xl font-black text-white tracking-tight">
                                {report.jobTitle || "Target Role"}
                            </h1>
                            {report.companyName && (
                                <p className="text-primary-400 font-bold flex items-center gap-2 mt-2">
                                    <Building2 className="size-4" />
                                    {report.companyName}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Report Content */}
                <div className="space-y-16">
                    <Summary feedback={report.feedback} />
                    <div className="h-px w-full bg-linear-to-r from-transparent via-white/10 to-transparent" />
                    <Details feedback={report.feedback} />
                </div>
            </div>
        </div>
    );
};

export default AnalysisReport;
