import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FileUploader from '../../components/candidate/FileUploader';
import { Sparkles, Building2, Briefcase, FileSearch } from 'lucide-react';

const CandidateUpload = () => {
    const navigate = useNavigate();
    const [metadata, setMetadata] = useState({
        companyName: '',
        jobTitle: '',
        jobDescription: ''
    });

    const handleComplete = (analysis) => {
        navigate('/candidate/dashboard');
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMetadata(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen pt-32 pb-20 px-6">
            <div className="max-w-4xl mx-auto space-y-16">
                {/* Header */}
                <div className="space-y-6 text-center animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="flex justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-black uppercase tracking-widest shadow-2xl shadow-primary-500/10">
                            <Sparkles className="size-3" />
                            Next-Gen AI Analysis
                        </div>
                    </div>
                    
                    <h1 className="text-6xl md:text-7xl font-black text-white tracking-tighter leading-tight">
                        Perfect your <span className="text-gradient">resume.</span>
                    </h1>
                    
                    <p className="text-gray-400 text-lg md:text-xl font-medium max-w-2xl mx-auto leading-relaxed opacity-80">
                        Specify the role you're targeting and let our elite AI model benchmark your skills against global standards.
                    </p>
                </div>

                {/* Form & Uploader Section */}
                <div className="grid md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
                    {/* Role Context Form */}
                    <div className="glass-card p-8 space-y-6">
                        <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
                            <Briefcase className="size-5 text-primary-400" />
                            Role Context
                        </h2>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Target Company</label>
                                <div className="relative group">
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    <input 
                                        type="text"
                                        name="companyName"
                                        value={metadata.companyName}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Google, Stripe, Netflix"
                                        className="w-full bg-white/2 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:bg-white/5 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Job Title</label>
                                <div className="relative group">
                                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    <input 
                                        type="text"
                                        name="jobTitle"
                                        value={metadata.jobTitle}
                                        onChange={handleInputChange}
                                        placeholder="e.g. Senior Frontend Engineer"
                                        className="w-full bg-white/2 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:bg-white/5 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-1">Job Description (Optional)</label>
                                <div className="relative group">
                                    <FileSearch className="absolute left-4 top-5 size-4 text-gray-500 group-focus-within:text-primary-400 transition-colors" />
                                    <textarea 
                                        name="jobDescription"
                                        value={metadata.jobDescription}
                                        onChange={handleInputChange}
                                        placeholder="Paste the job description here for a hyper-targeted analysis..."
                                        rows={4}
                                        className="w-full bg-white/2 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-gray-600 focus:outline-none focus:border-primary-500/50 focus:bg-white/5 transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Uploader */}
                    <div className="flex flex-col justify-center">
                        <FileUploader onComplete={handleComplete} metadata={metadata} />
                    </div>
                </div>

                {/* Trust Footer */}
                <div className="pt-20 border-t border-white/5 opacity-40 grayscale transition-all hover:opacity-100 hover:grayscale-0 duration-700 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500 mb-8">Trusted by talent at</p>
                    <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 text-white font-black text-xl opacity-30">
                        <span>GOOGLE</span>
                        <span>NETFLIX</span>
                        <span>STRIPE</span>
                        <span>AIRBNB</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CandidateUpload;
