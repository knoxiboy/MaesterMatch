import { create } from "zustand";
import mammoth from "mammoth";

const getPuter = () =>
    typeof window !== "undefined" && window.puter ? window.puter : null;

const clampScore = (value) => Math.max(0, Math.min(100, Math.round(value)));

export const calculateOverallScore = (feedback) => {
    const weightedScore =
        feedback.ATS.score * 0.28 +
        feedback.content.score * 0.24 +
        feedback.structure.score * 0.18 +
        feedback.skills.score * 0.18 +
        feedback.toneAndStyle.score * 0.12;

    return clampScore(weightedScore);
};

export const normalizeFeedbackScores = (feedback) => {
    const normalized = {
        ...feedback,
        overallScore: 0,
        ATS: { ...feedback.ATS, score: clampScore(feedback.ATS.score) },
        toneAndStyle: { ...feedback.toneAndStyle, score: clampScore(feedback.toneAndStyle.score) },
        content: { ...feedback.content, score: clampScore(feedback.content.score) },
        structure: { ...feedback.structure, score: clampScore(feedback.structure.score) },
        skills: { ...feedback.skills, score: clampScore(feedback.skills.score) },
    };

    normalized.overallScore = calculateOverallScore(normalized);
    return normalized;
};

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({ jobTitle, jobDescription }) =>
    `You are an elite Senior Hiring Manager and ATS expert. 
      Analyze the provided resume against the target role: "${jobTitle}"
      
      Job Context:
      ${jobDescription || "Standard industry competency requirements apply."}

      Perform a multi-layered analysis based on these core prompts, and map them to the corresponding JSON output sections:
      
      1. THE BRUTAL HONEST REVIEW (Output to "content" section):
      Pretend you are a senior hiring manager in this industry. Tell the user honestly what's weak, what's missing, and what would make you reject this resume immediately. Score strictly based on content depth.
      
      2. THE ATS OPTIMIZER (Output to "ATS" section):
      Compare the job requirements with the resume and specify exactly which keywords are missing, which skills to highlight, and how to restructure bullet points to pass screening. Score strictly based on keyword and matching.
      
      3. THE BULLET POINT TRANSFORMER (Output to "structure" section):
      Rewrite each of my bullet points using the formula: Action Verb + Task + Measurable Result. If numbers are missing, ask for them. Score based on visual structure and layout.
      
      4. THE INDUSTRY TONE MATCH (Output to "skills" section):
      Analyze if the resume summary and skills sound like an industry insider or a generic applicant. Suggest rewrites to sound authentic to the field. Score based on role alignment and skills.
      
      5. THE FINAL POLISH (Output to "toneAndStyle" section):
      Do a final review. Check for: consistency in tense, clichés (like 'team player'), anything that sounds generic. Replace all of it with specific, powerful language. Score based on tone and style.

      CRITICAL SCORING INSTRUCTIONS:
      - NEVER just output "82" as the default score! You MUST dynamically calculate the "overallScore" based purely on the actual quality of the provided resume. If the resume is terrible, give it a 35. If it is outstanding, give it a 92. Give highly variable, accurate scores.
      - Each section must also have its own dynamic score (0-100) reflecting that specific category.
      - Keep explanations EXTREMELY CONCISE. Maximum 1-2 short sentences per tip. Do not ramble.
      - Provide 3-4 specific, actionable tips per section.

      Format the entire analysis as a single JSON object matching this structure exactly:
      ${AIResponseFormat}
      
      Return ONLY the valid JSON object. No markdown backticks, no preamble.`;

export const usePuterStore = create((set, get) => ({
    isLoading: true,
    error: null,
    puterReady: false,
    history: [],
    auth: {
        user: null,
        isAuthenticated: false,
        signIn: async () => {
            const puter = getPuter();
            if (!puter) {
                set({ error: "Puter.js not available" });
                return;
            }
            set({ isLoading: true, error: null });
            try {
                await puter.auth.signIn();
                const isSigned = await puter.auth.isSignedIn();
                if (isSigned) {
                    const user = await puter.auth.getUser();
                    set({ auth: { ...get().auth, user, isAuthenticated: true }, isLoading: false });
                } else {
                    set({ isLoading: false });
                }
            } catch (err) {
                set({ error: err.message, isLoading: false });
            }
        },
        signOut: async () => {
            const puter = getPuter();
            if (!puter) return;
            set({ isLoading: true });
            try {
                await puter.auth.signOut();
                set({ auth: { ...get().auth, user: null, isAuthenticated: false }, isLoading: false });
            } catch (err) {
                set({ error: err.message, isLoading: false });
            }
        },
        checkAuthStatus: async () => {
            const puter = getPuter();
            if (!puter) return false;
            set({ isLoading: true });
            try {
                const isSignedIn = await puter.auth.isSignedIn();
                if (isSignedIn) {
                    const user = await puter.auth.getUser();
                    set({ auth: { ...get().auth, user, isAuthenticated: true }, isLoading: false });
                    return true;
                }
                set({ auth: { ...get().auth, user: null, isAuthenticated: false }, isLoading: false });
                return false;
            } catch (err) {
                set({ error: err.message, isLoading: false });
                return false;
            }
        },
    },
    init: () => {
        const puter = getPuter();
        if (puter) {
            set({ puterReady: true });
            get().auth.checkAuthStatus();
            return;
        }
        const interval = setInterval(() => {
            if (getPuter()) {
                clearInterval(interval);
                set({ puterReady: true });
                get().auth.checkAuthStatus();
            }
        }, 100);
        setTimeout(() => clearInterval(interval), 5000);
    },
    fetchHistory: async () => {
        const puter = getPuter();
        if (!puter) return [];
        try {
            const keys = await puter.kv.list('resume:*', true);
            const history = (keys || [])
                .map((item) => JSON.parse(item.value))
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            set({ history });
            return history;
        } catch (err) {
            console.error("Failed to fetch history:", err);
            return [];
        }
    },
    getAnalysisById: async (id) => {
        const puter = getPuter();
        if (!puter) return null;
        try {
            const data = await puter.kv.get(`resume:${id}`);
            return data ? JSON.parse(data) : null;
        } catch (err) {
            console.error("Failed to get analysis:", err);
            return null;
        }
    },
    deleteAnalysis: async (id) => {
        const puter = getPuter();
        if (!puter) return;
        try {
            await puter.kv.delete(`resume:${id}`);
            get().fetchHistory();
        } catch (err) {
            console.error("Failed to delete analysis:", err);
        }
    },
    analyzeResume: async (text, images = [], context = {}) => {
        const puter = getPuter();
        if (!puter) throw new Error("Puter.js not ready");
        set({ isLoading: true });
        const prompt = prepareInstructions({
            jobTitle: context.jobTitle || "Not specified",
            jobDescription: context.jobDescription || ""
        });
        try {
            const messages = [{ role: "user", content: [] }];
            if (images.length > 0) {
                images.slice(0, 3).forEach(img => {
                    messages[0].content.push({ type: "image", image_url: { url: img } });
                });
            }
            messages[0].content.push({ type: "text", text: `Resume Content:\n${text}\n\n${prompt}` });
            const response = await puter.ai.chat(messages, { model: "claude-3-5-sonnet" });
            const resultText = response.message.content[0].text;
            const firstBrace = resultText.indexOf('{');
            const lastBrace = resultText.lastIndexOf('}');
            if (firstBrace === -1 || lastBrace === -1) throw new Error("AI failed to return valid JSON");
            const cleanJson = resultText.substring(firstBrace, lastBrace + 1);
            const rawFeedback = JSON.parse(cleanJson);
            const feedback = normalizeFeedbackScores(rawFeedback);
            const id = Math.random().toString(36).substring(2, 15);
            const analysis = {
                id,
                timestamp: new Date().toISOString(),
                feedback,
                jobTitle: context.jobTitle,
                companyName: context.companyName,
                jobDescription: context.jobDescription
            };
            await puter.kv.set(`resume:${id}`, JSON.stringify(analysis));
            get().fetchHistory();
            set({ isLoading: false });
            return analysis;
        } catch (err) {
            set({ error: err.message, isLoading: false });
            throw err;
        }
    },
    clearError: () => set({ error: null }),
}));
