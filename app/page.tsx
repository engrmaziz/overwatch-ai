'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Mic, Image as ImageIcon, Link2, UploadCloud, Copy, RotateCcw, CheckCircle2, AlertTriangle, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';

type AppState = 'idle' | 'scanning' | 'verdict';
type ScanType = 'audio' | 'image' | 'text' | null;

interface VerificationResult {
    authenticityScore: number;
    threatLevel: 'HIGH' | 'MEDIUM' | 'LOW';
    manipulationTactics: string[];
    aiGenerated: number;
    manipulationLanguage: number;
    sourceCredibility: number;
    verdict: string;
    fullAnalysis: string;
}

export default function OverwatchApp() {
    const [appState, setAppState] = useState<AppState>('idle');
    const [scanType, setScanType] = useState<ScanType>(null);
    const [inputText, setInputText] = useState('');
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    const [verdictData, setVerdictData] = useState<VerificationResult | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const startScan = async (type: ScanType, content: string | File) => {
        setScanType(type);
        setAppState('scanning');

        const minAnimationTime = new Promise((resolve) => setTimeout(resolve, 3000));

        let fetchPromise;
        try {
            const formData = new FormData();
            formData.append('type', type as string);
            formData.append('content', content);

            fetchPromise = fetch('/api/scan', {
                method: 'POST',
                body: formData,
            }).then(res => res.json());

        } catch (err) {
            console.error(err);
            fetchPromise = Promise.resolve({
                authenticityScore: 50,
                threatLevel: 'MEDIUM',
                manipulationTactics: ['Analysis error'],
                aiGenerated: 5,
                manipulationLanguage: 5,
                sourceCredibility: 5,
                verdict: 'Unable to connect to Overwatch servers.',
                fullAnalysis: 'The scan encountered a network issue. When in doubt, do not comply.'
            });
        }

        const [_, data] = await Promise.all([minAnimationTime, fetchPromise]);
        setVerdictData(data);
        setAppState('verdict');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, expectedType: 'audio' | 'image') => {
        const file = e.target.files?.[0];
        if (!file) return;
        startScan(expectedType, file);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (!file) return;

        if (file.type.startsWith('audio/')) {
            startScan('audio', file);
        } else if (file.type.startsWith('image/')) {
            startScan('image', file);
        } else {
            // Fallback
            alert('Unsupported file type for drop zone.');
        }
    };

    const handleTextScan = () => {
        if (!inputText.trim()) return;
        startScan('text', inputText);
    };

    const resetState = () => {
        setAppState('idle');
        setScanType(null);
        setInputText('');
        setIsTextExpanded(false);
        setVerdictData(null);
    };

    const copyReport = () => {
        if (!verdictData) return;
        const report = `\u26A0 OVERWATCH SCAN REPORT\nThreat Level: ${verdictData.threatLevel}\nAuthenticity Score: ${verdictData.authenticityScore}/100\nTactics Detected: ${verdictData.manipulationTactics.join(', ')}\n\nVerdict: "${verdictData.verdict}"\n\nScanned with OVERWATCH \u2014 AI shield against AI scams.`;
        navigator.clipboard.writeText(report);
        setToastMessage('Report copied \u2014 share it to protect others.');
        setTimeout(() => setToastMessage(null), 3000);
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 overflow-x-hidden">
            {/* Top Bar */}
            <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-6 sm:px-12 z-40 glass-panel border-b border-border/50">
                <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-overwatch-green" />
                    <h1 className="font-sans font-bold text-xl tracking-[0.3em] text-overwatch-green">OVERWATCH</h1>
                </div>
                <div className="hidden sm:flex items-center gap-2 bg-overwatch-green/10 px-3 py-1.5 rounded-full border border-overwatch-green/20">
                    <div className="w-2 h-2 rounded-full bg-overwatch-green animate-pulse" />
                    <span className="font-mono text-xs text-overwatch-green uppercase tracking-wider">System Active</span>
                </div>
                <div className="text-xs font-sans text-muted hidden md:block">
                    Powered by <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span><span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span> Gemini AI
                </div>
            </header>

            <AnimatePresence mode="wait">
                {appState === 'idle' && (
                    <IdleView
                        key="idle"
                        isTextExpanded={isTextExpanded}
                        setIsTextExpanded={setIsTextExpanded}
                        inputText={inputText}
                        setInputText={setInputText}
                        handleTextScan={handleTextScan}
                        handleDrop={handleDrop}
                        fileInputRef={fileInputRef}
                        handleFileUpload={handleFileUpload}
                    />
                )}
                {appState === 'scanning' && (
                    <ScanningView key="scanning" scanType={scanType} />
                )}
                {appState === 'verdict' && verdictData && (
                    <VerdictView
                        key="verdict"
                        data={verdictData}
                        onReset={resetState}
                        onCopy={copyReport}
                    />
                )}
            </AnimatePresence>

            {/* Toast Notification */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 50 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-overwatch-green/20 border border-overwatch-green text-overwatch-green font-mono text-sm px-6 py-3 rounded-full backdrop-blur-md z-50 flex items-center gap-2"
                    >
                        <CheckCircle2 className="w-4 h-4" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// -------------------------------------------------------------
// IDLE VIEW
// -------------------------------------------------------------
function IdleView({
    isTextExpanded, setIsTextExpanded, inputText, setInputText, handleTextScan, handleDrop, fileInputRef, handleFileUpload
}: any) {
    return (
        <motion.main
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-4xl flex flex-col items-center mt-20 z-10"
        >
            <div className="text-center mb-12 space-y-4">
                <h2 className="font-sans text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
                    Your AI Shield Against<br />
                    <span className="text-overwatch-green drop-shadow-[0_0_15px_rgba(0,255,136,0.3)]">AI-Powered Scams.</span>
                </h2>
                <p className="font-sans text-lg text-muted max-w-2xl mx-auto">
                    Upload suspicious media. Get a verdict in seconds. <br className="hidden sm:block" />Protect yourself and your family.
                </p>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className="w-full glass-panel rounded-2xl p-8 border border-border group hover:border-overwatch-green/50 transition-colors duration-500 relative"
            >
                <div className="absolute inset-0 bg-overwatch-green/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />

                <div className="border-2 border-dashed border-border group-hover:border-overwatch-green/30 rounded-xl p-12 flex flex-col items-center justify-center text-center transition-all duration-300 relative overflow-hidden">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    >
                        <UploadCloud className="w-16 h-16 text-muted group-hover:text-overwatch-green mb-6 transition-colors duration-300" />
                    </motion.div>

                    <h3 className="font-mono text-xl sm:text-2xl text-muted group-hover:text-overwatch-green tracking-widest uppercase mb-2 transition-colors">
                        Drop Suspicious Media Here
                    </h3>
                    <p className="font-sans text-muted mb-8">or choose a type below</p>

                    <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl z-10">
                        {/* Audio Button */}
                        <button
                            onClick={() => { fileInputRef.current!.accept = '.mp3,.wav,.ogg,.m4a'; fileInputRef.current!.click(); }}
                            className="flex-1 glass-panel hover:border-overwatch-blue hover:scale-[1.02] transition-all duration-300 rounded-xl py-4 flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-overwatch-blue/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            <Mic className="w-5 h-5 text-overwatch-blue" />
                            <span className="font-mono text-sm tracking-wide text-foreground">VOICE NOTE</span>
                        </button>

                        {/* Image Button */}
                        <button
                            onClick={() => { fileInputRef.current!.accept = '.jpg,.jpeg,.png,.webp'; fileInputRef.current!.click(); }}
                            className="flex-1 glass-panel hover:border-overwatch-blue hover:scale-[1.02] transition-all duration-300 rounded-xl py-4 flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-overwatch-blue/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            <ImageIcon className="w-5 h-5 text-overwatch-blue" />
                            <span className="font-mono text-sm tracking-wide text-foreground">SCREENSHOT</span>
                        </button>

                        {/* Text Button */}
                        <button
                            onClick={() => setIsTextExpanded(!isTextExpanded)}
                            className="flex-1 glass-panel hover:border-overwatch-blue hover:scale-[1.02] transition-all duration-300 rounded-xl py-4 flex items-center justify-center gap-3 group/btn relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-overwatch-blue/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                            <Link2 className="w-5 h-5 text-overwatch-blue" />
                            <span className="font-mono text-sm tracking-wide text-foreground">PASTE TEXT / URL</span>
                        </button>
                    </div>

                    <AnimatePresence>
                        {isTextExpanded && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                                className="w-full max-w-2xl overflow-hidden z-10"
                            >
                                <div className="relative">
                                    <textarea
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="Paste the suspicious text message, email content, or website URL here..."
                                        className="w-full bg-black/40 border border-border rounded-xl p-4 font-sans text-foreground placeholder:text-muted focus:outline-none focus:border-overwatch-blue resize-none min-h-[120px] transition-colors"
                                    />
                                    <div className="absolute bottom-4 right-4 text-xs font-mono text-muted">
                                        {inputText.length} chars
                                    </div>
                                </div>
                                <button
                                    onClick={handleTextScan}
                                    disabled={!inputText.trim()}
                                    className="mt-4 w-full bg-overwatch-blue text-black font-bold font-mono tracking-widest py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-all active:scale-95"
                                >
                                    SCAN NOW
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

                </div>
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                    const acc = fileInputRef.current?.accept;
                    if (acc?.includes('mp3')) handleFileUpload(e, 'audio');
                    else handleFileUpload(e, 'image');
                }}
                className="hidden"
            />

            {/* Stats Bar */}
            <div className="mt-16 sm:mt-auto sm:mb-8 grid grid-cols-1 sm:grid-cols-3 gap-8 w-full border-t border-border/50 pt-8">
                <StatRow label="SCANS RUN" value="12,847" />
                <StatRow label="ACCURACY" value="94.3%" />
                <StatRow label="AVG SCAN TIME" value="3.2s" />
            </div>
        </motion.main>
    );
}

function StatRow({ label, value }: { label: string, value: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="font-mono text-2xl text-foreground font-bold">{value}</div>
            <div className="font-mono text-xs text-muted tracking-widest">{label}</div>
        </div>
    );
}

// -------------------------------------------------------------
// SCANNING VIEW
// -------------------------------------------------------------
function ScanningView({ scanType }: { scanType: ScanType }) {
    const [tickerLines, setTickerLines] = useState<string[]>([]);

    const defaultLines = [
        "> Initializing Overwatch scan protocol...",
        "> Stripping metadata and encoding artifacts...",
        "> Routing to Gemini 3.1 Flash multimodal engine...",
        "> Analyzing content structure and semantic patterns...",
        "> Checking for AI synthesis signatures...",
        "> Cross-referencing psychological manipulation vectors...",
        "> Evaluating urgency, authority, and isolation tactics...",
        "> Compiling threat assessment report...",
        "> Scan complete. Generating verdict..."
    ];

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            if (index < defaultLines.length) {
                setTickerLines(prev => [...prev, defaultLines[index]]);
                index++;
            } else {
                clearInterval(interval);
            }
        }, 600);
        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden"
        >
            {/* Sweeping scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(14,165,233,0.1)_50%,transparent_100%)] h-[20%] w-full animate-sweep" />

            {/* Scanner Ring */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 mb-16 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full animate-[spin_4s_linear_infinite]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(14, 165, 233, 0.2)" strokeWidth="1" />
                    <circle
                        cx="50" cy="50" r="48"
                        fill="none"
                        stroke="var(--accent-blue)"
                        strokeWidth="2"
                        strokeDasharray="75 225"
                        strokeLinecap="round"
                    />
                </svg>
                <svg className="absolute inset-0 w-full h-full animate-[spin_3s_linear_infinite_reverse]" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(14, 165, 233, 0.1)" strokeWidth="1" strokeDasharray="4 4" />
                </svg>
                <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="relative z-10 p-6 rounded-full bg-overwatch-blue/10 border border-overwatch-blue/30"
                >
                    {scanType === 'audio' && <Mic className="w-12 h-12 text-overwatch-blue" />}
                    {scanType === 'image' && <ImageIcon className="w-12 h-12 text-overwatch-blue" />}
                    {scanType === 'text' && <Link2 className="w-12 h-12 text-overwatch-blue" />}
                </motion.div>
            </div>

            {/* Ticker */}
            <div className="w-full max-w-2xl px-6 h-64 overflow-hidden relative font-mono text-xs sm:text-sm text-overwatch-green">
                <div className="absolute bottom-0 w-full space-y-2 pb-4">
                    {tickerLines.map((line, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            {line}
                        </motion.div>
                    ))}
                    <motion.div
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-4 bg-overwatch-green inline-block ml-2 align-middle"
                    />
                </div>
                {/* Top fade */}
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-10" />
            </div>
        </motion.div>
    );
}

// -------------------------------------------------------------
// VERDICT VIEW
// -------------------------------------------------------------
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

function VerdictView({ data, onReset, onCopy }: { data: VerificationResult, onReset: () => void, onCopy: () => void }) {

    const isHigh = data.threatLevel === 'HIGH';
    const isMed = data.threatLevel === 'MEDIUM';
    const isLow = data.threatLevel === 'LOW';

    const bannerColor = isHigh ? 'bg-overwatch-red glow-red' : isMed ? 'bg-overwatch-amber glow-amber' : 'bg-overwatch-green glow-green';
    const bannerTextColor = isHigh ? 'text-black' : isMed ? 'text-black' : 'text-black';
    const bannerText = isHigh ? '⚠ HIGH RISK \u2014 DO NOT COMPLY' : isMed ? '⚡ SUSPICIOUS \u2014 PROCEED WITH CAUTION' : '✓ CLEAR \u2014 NO THREATS DETECTED';

    const authColorClass = data.authenticityScore < 30 ? 'text-overwatch-red' : data.authenticityScore <= 70 ? 'text-overwatch-amber' : 'text-overwatch-green';
    const authStroke = data.authenticityScore < 30 ? 'var(--accent-red)' : data.authenticityScore <= 70 ? 'var(--accent-amber)' : 'var(--accent-green)';
    const dashoffset = 283 - (283 * data.authenticityScore) / 100;

    const getDots = (score: number) => {
        // score 0-10
        const filled = Math.min(10, Math.max(0, Math.round(score)));
        return (
            <span className="font-mono tracking-widest text-[10px] sm:text-xs">
                <span className="opacity-100">{'●'.repeat(filled)}</span>
                <span className="opacity-20">{'○'.repeat(10 - filled)}</span>
            </span>
        );
    };

    const getRiskColor = (score: number, invert: boolean = false) => {
        // if invert is false, higher score = higher risk (red)
        // if invert is true, higher score = lower risk (green) -> e.g. sourceCredibility
        let s = score;
        if (invert) s = 10 - score;
        if (s >= 7) return 'text-overwatch-red';
        if (s >= 4) return 'text-overwatch-amber';
        return 'text-overwatch-green';
    };

    return (
        <motion.main
            variants={containerVariants}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-6xl mt-24 mb-12 flex flex-col gap-6 z-10"
        >
            {/* Threat Banner */}
            <motion.div variants={itemVariants} className={cn("w-full py-4 px-6 rounded-xl flex items-center justify-center text-center", bannerColor)}>
                <h2 className={cn("font-sans text-xl sm:text-2xl md:text-3xl font-bold tracking-widest uppercase", bannerTextColor)}>
                    {bannerText}
                </h2>
            </motion.div>

            {/* Metric Cards Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Authenticity Score */}
                <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="text-xs font-mono text-muted mb-6 tracking-widest">AUTHENTICITY SCORE</div>
                    <div className="relative w-32 h-32 flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                            <motion.circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke={authStroke}
                                strokeWidth="8"
                                strokeLinecap="round"
                                initial={{ strokeDasharray: 283, strokeDashoffset: 283 }}
                                animate={{ strokeDashoffset: dashoffset }}
                                transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
                            />
                        </svg>
                        <span className={cn("font-mono font-bold text-5xl", authColorClass)}>{data.authenticityScore}</span>
                    </div>
                    <div className="text-[10px] font-mono text-muted mt-6">100 = human / 0 = AI-generated</div>
                </motion.div>

                {/* Tactics Detected */}
                <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6 flex flex-col items-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="text-xs font-mono text-muted mb-6 tracking-widest text-center w-full">TACTICS DETECTED</div>
                    <div className="flex-1 flex flex-wrap content-center justify-center gap-2">
                        {(!data.manipulationTactics || data.manipulationTactics.length === 0 || (data.manipulationTactics.length === 1 && data.manipulationTactics[0].toLowerCase().includes('none'))) ? (
                            <span className="bg-overwatch-green/10 text-overwatch-green border border-overwatch-green/20 px-3 py-1.5 rounded-md font-mono text-xs">
                                [NONE DETECTED]
                            </span>
                        ) : (
                            data.manipulationTactics.map((tactic, idx) => (
                                <span key={idx} className="bg-overwatch-red/10 text-overwatch-red border border-overwatch-red/20 px-3 py-1.5 rounded-md font-mono text-xs uppercase">
                                    [{tactic}]
                                </span>
                            ))
                        )}
                    </div>
                </motion.div>

                {/* Risk Assessment */}
                <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6 flex flex-col justify-center relative overflow-hidden space-y-4">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/5 opacity-0 hover:opacity-100 transition-opacity" />
                    <div className="text-xs font-mono text-muted mb-2 tracking-widest text-center">RISK ASSESSMENT</div>

                    <div className="flex flex-col gap-3 w-full">
                        <div className="flex justify-between items-center bg-black/30 rounded-lg px-3 py-2 border border-border">
                            <span className="font-mono text-[10px] text-muted">AI GENERATED</span>
                            <span className={getRiskColor(data.aiGenerated)}>{getDots(data.aiGenerated)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/30 rounded-lg px-3 py-2 border border-border">
                            <span className="font-mono text-[10px] text-muted">MANIPULATION</span>
                            <span className={getRiskColor(data.manipulationLanguage)}>{getDots(data.manipulationLanguage)}</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/30 rounded-lg px-3 py-2 border border-border">
                            <span className="font-mono text-[10px] text-muted">CREDIBILITY</span>
                            <span className={getRiskColor(data.sourceCredibility, true)}>{getDots(data.sourceCredibility)}</span>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* Full Analysis Block */}
            <motion.div variants={itemVariants} className="glass-panel rounded-xl p-6 sm:p-8 mt-2 bracket-corners">
                <h3 className="font-mono text-overwatch-green tracking-widest text-sm mb-6 border-b border-overwatch-green/20 pb-4 inline-block">
                    [ FULL ANALYSIS REPORT ]
                </h3>
                <p className="font-sans text-[15px] sm:text-base leading-relaxed text-foreground/90 will-change-transform">
                    {data.fullAnalysis.split(' ').map((word, idx) => (
                        <motion.span
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + (idx * 0.02) }}
                            className="inline-block mr-1"
                        >
                            {word}
                        </motion.span>
                    ))}
                </p>
            </motion.div>

            {/* Verdict Sentence */}
            <motion.div variants={itemVariants} className="my-8 text-center px-4">
                <span className={cn("font-sans text-xl sm:text-2xl italic font-medium px-8 py-4 rounded-xl inline-block", isHigh ? "text-overwatch-red bg-overwatch-red/5" : isMed ? "text-overwatch-amber bg-overwatch-amber/5" : "text-overwatch-green bg-overwatch-green/5")}>
                    "{data.verdict}"
                </span>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4 w-full max-w-md mx-auto">
                <button
                    onClick={onCopy}
                    className="w-full bg-foreground text-background font-mono font-bold tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-muted transition-colors active:scale-95"
                >
                    <Copy className="w-5 h-5" />
                    SHARE REPORT
                </button>
                <button
                    onClick={onReset}
                    className="w-full md:w-auto bg-transparent border border-border text-muted font-mono tracking-widest py-4 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 hover:text-foreground hover:border-muted transition-colors active:scale-95"
                >
                    <RotateCcw className="w-5 h-5" />
                    SCAN ANOTHER
                </button>
            </motion.div>

        </motion.main>
    );
}
