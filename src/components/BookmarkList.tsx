"use client";

import { createClient } from "@/lib/supabase/client";
import { Bookmark } from "@/lib/types";
import { useEffect, useState } from "react";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export default function BookmarkList({
    initialBookmarks,
}: {
    initialBookmarks: Bookmark[];
}) {
    const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        // Subscribe to real-time changes on the bookmarks table
        const channel = supabase
            .channel("bookmarks-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "bookmarks",
                },
                (payload: RealtimePostgresChangesPayload<Bookmark>) => {
                    if (payload.eventType === "INSERT") {
                        const newBookmark = payload.new as Bookmark;
                        setBookmarks((prev) => {
                            // Avoid duplicates
                            if (prev.some((b) => b.id === newBookmark.id)) return prev;
                            return [newBookmark, ...prev];
                        });
                    } else if (payload.eventType === "DELETE") {
                        const deletedBookmark = payload.old as Partial<Bookmark>;
                        setBookmarks((prev) =>
                            prev.filter((b) => b.id !== deletedBookmark.id)
                        );
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [supabase]);

    const handleDelete = async (e: React.MouseEvent, id: string) => {
        e.preventDefault(); // Prevent link click
        e.stopPropagation();

        setDeletingId(id);
        const { error } = await supabase.from("bookmarks").delete().eq("id", id);
        if (error) {
            console.error("Error deleting bookmark:", error);
        }
        setDeletingId(null);
    };

    const getFaviconUrl = (url: string) => {
        try {
            const domain = new URL(url).hostname;
            return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
        } catch {
            return null;
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        });
    };

    if (bookmarks.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-fade-in relative z-0">
                <div className="relative mb-6">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl animate-pulse" />
                    <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-tr from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 border border-white/20 dark:border-white/5 flex items-center justify-center shadow-2xl">
                        <svg
                            className="w-10 h-10 text-gray-400 dark:text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={1.5}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                            />
                        </svg>
                    </div>
                </div>
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white mb-2">
                    Your collection is empty
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto leading-relaxed">
                    Start building your digital library. Add your first bookmark using the bar above.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in pb-20">
            {bookmarks.map((bookmark, index) => (
                <a
                    key={bookmark.id}
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex flex-col h-full bg-white/50 dark:bg-gray-900/40 backdrop-blur-md border border-white/20 dark:border-white/5 rounded-2xl p-5 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 hover:bg-white/80 dark:hover:bg-gray-800/60 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                >
                    {/* Top Bar: Favicon + Date */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 shadow-sm border border-black/5 dark:border-white/5 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-shadow">
                            {getFaviconUrl(bookmark.url) ? (
                                <img
                                    src={getFaviconUrl(bookmark.url)!}
                                    alt=""
                                    className="w-6 h-6 object-contain"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = "none";
                                    }}
                                />
                            ) : (
                                <svg
                                    className="w-6 h-6 text-gray-400"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                    />
                                </svg>
                            )}
                        </div>

                        <button
                            onClick={(e) => handleDelete(e, bookmark.id)}
                            disabled={deletingId === bookmark.id}
                            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all transform scale-90 group-hover:scale-100 focus:outline-none"
                            title="Delete bookmark"
                        >
                            {deletingId === bookmark.id ? (
                                <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                            )}
                        </button>
                    </div>

                    {/* Content */}
                    <div className="mt-auto">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 line-clamp-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {bookmark.title}
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mb-4 font-mono opacity-80 group-hover:opacity-100 transition-opacity">
                            {new URL(bookmark.url).hostname}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                                {formatDate(bookmark.created_at)}
                            </span>
                            <span className="text-xs font-semibold text-indigo-500 flex items-center gap-1 transform translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all">
                                Visit
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </span>
                        </div>
                    </div>

                    {/* Hover Glow */}
                    <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-black/5 dark:ring-white/10 group-hover:ring-indigo-500/50 transition-all pointer-events-none" />
                </a>
            ))}
        </div>
    );
}
