import { create } from "zustand";
import mammoth from "mammoth";

const getPuter = () =>
    typeof window !== "undefined" && window.puter ? window.puter : null;

export const usePuterStore = create((set, get) => {
    const setError = (msg) => {
        set({
            error: msg,
            isLoading: false,
            auth: {
                user: null,
                isAuthenticated: false,
                signIn: get().auth.signIn,
                signOut: get().auth.signOut,
                refreshUser: get().auth.refreshUser,
                checkAuthStatus: get().auth.checkAuthStatus,
                getUser: get().auth.getUser,
            },
        });
    };

    const checkAuthStatus = async () => {
        const puter = getPuter();
        if (!puter) {
            return false;
        }

        set({ isLoading: true, error: null });

        try {
            const isSignedIn = await puter.auth.isSignedIn();
            if (isSignedIn) {
                const user = await puter.auth.getUser();
                set({
                    auth: {
                        user,
                        isAuthenticated: true,
                        signIn: get().auth.signIn,
                        signOut: get().auth.signOut,
                        refreshUser: get().auth.refreshUser,
                        checkAuthStatus: get().auth.checkAuthStatus,
                        getUser: () => user,
                    },
                    isLoading: false,
                });
                return true;
            } else {
                set({
                    auth: {
                        user: null,
                        isAuthenticated: false,
                        signIn: get().auth.signIn,
                        signOut: get().auth.signOut,
                        refreshUser: get().auth.refreshUser,
                        checkAuthStatus: get().auth.checkAuthStatus,
                        getUser: () => null,
                    },
                    isLoading: false,
                });
                return false;
            }
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to check auth status";
            setError(msg);
            return false;
        }
    };

    const signIn = async () => {
        const puter = getPuter();
        if (!puter) {
            setError("Puter.js not available");
            return;
        }

        set({ isLoading: true, error: null });

        try {
            await puter.auth.signIn();
            await checkAuthStatus();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Sign in failed";
            setError(msg);
        }
    };

    const signOut = async () => {
        const puter = getPuter();
        if (!puter) return;

        set({ isLoading: true, error: null });

        try {
            await puter.auth.signOut();
            set({
                auth: {
                    user: null,
                    isAuthenticated: false,
                    signIn: get().auth.signIn,
                    signOut: get().auth.signOut,
                    refreshUser: get().auth.refreshUser,
                    checkAuthStatus: get().auth.checkAuthStatus,
                    getUser: () => null,
                },
                isLoading: false,
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Sign out failed";
            setError(msg);
        }
    };

    const refreshUser = async () => {
        const puter = getPuter();
        if (!puter) return;

        set({ isLoading: true, error: null });

        try {
            const user = await puter.auth.getUser();
            set({
                auth: {
                    user,
                    isAuthenticated: true,
                    signIn: get().auth.signIn,
                    signOut: get().auth.signOut,
                    refreshUser: get().auth.refreshUser,
                    checkAuthStatus: get().auth.checkAuthStatus,
                    getUser: () => user,
                },
                isLoading: false,
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to refresh user";
            setError(msg);
        }
    };

    const init = () => {
        const puter = getPuter();
        if (puter) {
            set({ puterReady: true });
            checkAuthStatus();
            return;
        }

        const interval = setInterval(() => {
            if (getPuter()) {
                clearInterval(interval);
                set({ puterReady: true });
                checkAuthStatus();
            }
        }, 100);

        setTimeout(() => {
            clearInterval(interval);
            if (!getPuter()) {
                setError("Puter.js failed to load");
            }
        }, 5000);
    };

    return {
        isLoading: true,
        error: null,
        puterReady: false,
        auth: {
            user: null,
            isAuthenticated: false,
            signIn,
            signOut,
            refreshUser,
            checkAuthStatus,
            getUser: () => get().auth.user,
        },
        fs: {
            write: (path, data) => getPuter()?.fs.write(path, data),
            read: (path) => getPuter()?.fs.read(path),
            readDir: (path) => getPuter()?.fs.readdir(path),
            upload: (files) => getPuter()?.fs.upload(files),
            delete: (path) => getPuter()?.fs.delete(path),
        },
        ai: {
            chat: (prompt, imageURL, testMode, options) => getPuter()?.ai.chat(prompt, imageURL, testMode, options),
            feedback: async (pathOrText, message, type = "file") => {
                const puter = getPuter();
                if (!puter) return;
                const content = [];
                if (type === "file") {
                    content.push({ type: "file", puter_path: pathOrText });
                } else {
                    content.push({ type: "text", text: pathOrText });
                }
                content.push({ type: "text", text: message });
                return puter.ai.chat([{ role: "user", content }], { model: "claude-3-5-sonnet" });
            },
            img2txt: (image, testMode) => getPuter()?.ai.img2txt(image, testMode),
            extractTextFromDocx: async (file) => {
                const arrayBuffer = await file.arrayBuffer();
                const result = await mammoth.extractRawText({ arrayBuffer });
                return result.value;
            },
        },
        kv: {
            get: (key) => getPuter()?.kv.get(key),
            set: (key, value) => getPuter()?.kv.set(key, value),
            delete: (key) => getPuter()?.kv.delete(key),
            list: (pattern, returnValues = false) => getPuter()?.kv.list(pattern, returnValues),
            flush: () => getPuter()?.kv.flush(),
        },
        ui: {
            alert: (title, text) => getPuter()?.ui.alert(title, text),
            notify: (opts) => getPuter()?.ui.notify(opts),
            showSpinner: () => getPuter()?.ui.showSpinner(),
            hideSpinner: () => getPuter()?.ui.hideSpinner(),
            prompt: (title, text) => getPuter()?.ui.prompt(title, text),
            showOpenFilePicker: () => getPuter()?.ui.showOpenFilePicker(),
        },
        init,
        clearError: () => set({ error: null }),
    };
});
