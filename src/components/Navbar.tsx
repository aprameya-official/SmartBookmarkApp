"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

export default function Navbar({ user }: { user: User }) {
    const supabase = createClient();
    const router = useRouter();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    };

    return (
        <nav className="sticky top-4 z-50 mx-4 md:mx-auto max-w-5xl">
            <div className="glass rounded-2xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg shadow-black/5 ring-1 ring-white/10 backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:ring-white/20">
                {/* Logo */}
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute inset-0 bg-white/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
                        <svg
                            className="w-5 h-5 text-white relative z-10"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                    </div>
                    <span className="hidden sm:block text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                        Smart Bookmark
                    </span>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-800">
                        {user.user_metadata?.avatar_url && (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Avatar"
                                className="w-8 h-8 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-sm"
                            />
                        )}
                        <button
                            onClick={handleSignOut}
                            className="relative px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 transition-colors group"
                        >
                            <span className="relative z-10">Sign out</span>
                            <span className="absolute inset-0 bg-gray-100 dark:bg-gray-800 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity scale-90 group-hover:scale-100" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}
