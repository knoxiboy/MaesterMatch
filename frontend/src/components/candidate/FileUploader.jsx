import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, CheckCircle2, AlertCircle, Loader2, X } from 'lucide-react';
import { cn } from '../../lib/utils';
import { usePuterStore } from '../../lib/puter';
import { convertPdfToImages } from '../../lib/pdf2img';
import mammoth from 'mammoth';

const FileUploader = ({ onComplete, metadata = {} }) => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, processing, error, success
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState('');

    const analyzeResume = usePuterStore(state => state.analyzeResume);

    const onDrop = useCallback(async (acceptedFiles) => {
        const selectedFile = acceptedFiles[0];
        if (!selectedFile) return;

        setFile(selectedFile);
        setStatus('processing');
        setError(null);

        try {
            let resumeText = '';
            let resumeImages = [];

            if (selectedFile.type === 'application/pdf') {
                setProgress('Converting PDF to high-res images...');
                const result = await convertPdfToImages(selectedFile);
                resumeImages = result.images;
                resumeText = result.text;
            } else if (
                selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
                selectedFile.name.endsWith('.docx')
            ) {
                setProgress('Extracting text from DOCX...');
                const arrayBuffer = await selectedFile.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                resumeText = result.value;
                if (!resumeText.trim()) throw new Error('No text found in DOCX file.');
            } else {
                throw new Error('Unsupported file format. Please upload PDF or DOCX.');
            }

            setProgress('AI is analyzing your profile...');
            const analysis = await analyzeResume(resumeText, resumeImages, metadata);
            
            setStatus('success');
            setTimeout(() => {
                onComplete?.(analysis);
            }, 1000);

        } catch (err) {
            console.error('Upload error:', err);
            setStatus('error');
            setError(err.message || 'Failed to process resume');
        }
    }, [analyzeResume, onComplete, metadata]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'application/pdf': ['.pdf'],
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
        },
        multiple: false,
        disabled: status === 'processing'
    });

    const reset = (e) => {
        e.stopPropagation();
        setFile(null);
        setStatus('idle');
        setError(null);
    };

    return (
        <div className="w-full max-w-xl mx-auto">
            <div
                {...getRootProps()}
                className={cn(
                    "relative group cursor-pointer transition-all duration-500",
                    "rounded-[40px] p-1 border-2 border-dashed",
                    isDragActive ? "border-primary-500 bg-primary-500/5 scale-[1.02]" : "border-white/10 hover:border-white/20 bg-white/2 hover:bg-white/5",
                    status === 'processing' && "pointer-events-none opacity-80",
                    status === 'error' && "border-rose-500/50 bg-rose-500/5"
                )}
            >
                <input {...getInputProps()} />

                <div className="relative overflow-hidden rounded-[38px] p-10 md:p-16 flex flex-col items-center text-center gap-8">
                    {/* Background Elements */}
                    <div className="absolute inset-0 bg-linear-to-b from-primary-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    {/* Animated Border Gradient */}
                    <div className="absolute inset-0 bg-linear-to-br from-primary-500/20 via-transparent to-purple-500/20 opacity-50" />
                    
                    {/* Status Icons */}
                    <div className="relative">
                        {status === 'idle' && (
                            <div className="size-24 rounded-[32px] bg-linear-to-br from-primary-500 to-indigo-600 flex items-center justify-center shadow-2xl shadow-primary-500/20 group-hover:scale-110 transition-transform duration-500">
                                <Upload className="size-10 text-white" />
                            </div>
                        )}
                        {status === 'processing' && (
                            <div className="size-24 rounded-[32px] bg-white/5 flex items-center justify-center border border-white/10">
                                <Loader2 className="size-10 text-primary-400 animate-spin" />
                            </div>
                        )}
                        {status === 'success' && (
                            <div className="size-24 rounded-[32px] bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
                                <CheckCircle2 className="size-10 text-emerald-400 animate-in zoom-in duration-500" />
                            </div>
                        )}
                        {status === 'error' && (
                            <div className="size-24 rounded-[32px] bg-rose-500/20 flex items-center justify-center border border-rose-500/20">
                                <AlertCircle className="size-10 text-rose-400 animate-in shake-2" />
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="space-y-3 relative z-10">
                        {status === 'idle' && (
                            <>
                                <h3 className="text-3xl font-black text-white tracking-tight">Drop your resume</h3>
                                <p className="text-gray-400 font-medium max-w-[280px] mx-auto leading-relaxed">
                                    Upload PDF or DOCX to start your premium AI assessment.
                                </p>
                            </>
                        )}
                        {status === 'processing' && (
                            <>
                                <h3 className="text-2xl font-black text-white tracking-tight">Processing...</h3>
                                <p className="text-primary-400 font-bold text-sm tracking-widest uppercase">{progress}</p>
                            </>
                        )}
                        {status === 'success' && (
                            <>
                                <h3 className="text-2xl font-black text-white tracking-tight">Analysis Complete</h3>
                                <p className="text-emerald-400/80 font-bold text-sm">Redirecting to your dashboard...</p>
                            </>
                        )}
                        {status === 'error' && (
                            <>
                                <h3 className="text-2xl font-black text-rose-400 tracking-tight">Upload Failed</h3>
                                <p className="text-gray-400 font-medium">{error}</p>
                                <button onClick={reset} className="mt-4 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-bold transition-colors">
                                    Try Again
                                </button>
                            </>
                        )}
                    </div>

                    {/* File Info */}
                    {file && status !== 'error' && (
                        <div className="flex items-center gap-3 px-5 py-3 bg-white/5 border border-white/10 rounded-2xl animate-in fade-in slide-in-from-top-2">
                            <FileText className="size-4 text-primary-400" />
                            <span className="text-sm font-bold text-gray-300 truncate max-w-[200px]">{file.name}</span>
                            {status === 'idle' && (
                                <button onClick={reset} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                                    <X className="size-3 text-gray-500" />
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-4">
                <div className="glass-card p-4 flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-primary-500/10 flex items-center justify-center">
                        <CheckCircle2 className="size-4 text-primary-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Privacy Secure</span>
                </div>
                <div className="glass-card p-4 flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                        <CheckCircle2 className="size-4 text-pink-400" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-500">Claude-3 Powered</span>
                </div>
            </div>
        </div>
    );
};

export default FileUploader;
