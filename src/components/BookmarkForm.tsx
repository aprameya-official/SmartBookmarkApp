"use client";

import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

export default function BookmarkForm() {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeField, setActiveField] = useState<"url" | "title" | null>(null);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!url.trim() || !title.trim()) {
            setError("Please fill in both fields");
            return;
        }

        try {
            new URL(url);
        } catch {
            setError("Invalid URL format");
            return;
        }

        setLoading(true);
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            setError("Please log in first");
            setLoading(false);
            return;
        }

        const { error: insertError } = await supabase.from("bookmarks").insert({
            url: url.trim(),
            title: title.trim(),
            user_id: user.id,
        });

        if (insertError) {
            setError(insertError.message);
        } else {
            setUrl("");
            setTitle("");
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full relative group z-10 max-w-2xl mx-auto">
            {/* Glow Effect behind form */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500" />

            <div className="relative glass rounded-2xl p-2 shadow-2xl backdrop-blur-xl border border-white/20 flex flex-col md:flex-row items-center gap-2">
                {/* Title Input */}
                <div className="relative flex-[1.5] w-full group/field">
                    <div className={`absolute inset-0 bg-white/5 rounded-xl transition-all duration-300 ${activeField === 'title' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} />
                    <input
                        type="text"
                        placeholder="Bookmark Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onFocus={() => setActiveField('title')}
                        onBlur={() => setActiveField(null)}
                        className="w-full relative bg-transparent px-4 py-3.5 rounded-xl text-[var(--color-text)] placeholder:text-gray-400/70 focus:outline-none transition-all font-medium border border-transparent focus:border-white/10"
                    />
                </div>

                {/* Divider (Desktop) */}
                <div className="hidden md:block w-px h-8 bg-white/10" />

                {/* URL Input */}
                <div className="relative flex-[2] w-full group/field">
                    <div className={`absolute inset-0 bg-white/5 rounded-xl transition-all duration-300 ${activeField === 'url' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`} />
                    <input
                        type="text"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onFocus={() => setActiveField('url')}
                        onBlur={() => setActiveField(null)}
                        className="w-full relative bg-transparent px-4 py-3.5 rounded-xl text-[var(--color-text)] placeholder:text-gray-400/70 focus:outline-none transition-all font-medium border border-transparent focus:border-white/10"
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap ring-1 ring-white/20"
                >
                    {loading ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto" />
                    ) : (
                        "Save"
                    )}
                </button>

                {/* Error Message */}
                {error && (
                    <div className="absolute -bottom-14 left-0 right-0 mx-auto w-max px-4 py-2 bg-red-500/90 text-white text-xs font-medium rounded-full shadow-lg backdrop-blur-md animate-slide-up text-center">
                        {error}
                    </div>
                )}
            </div>
        </form>
    );
}
