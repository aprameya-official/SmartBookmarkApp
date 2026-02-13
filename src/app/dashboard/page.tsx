import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkList from "@/components/BookmarkList";
import { Bookmark } from "@/lib/types";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    // Fetch initial bookmarks (server-side)
    const { data: bookmarks } = await supabase
        .from("bookmarks")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="min-h-screen bg-[var(--color-surface)] relative overflow-x-hidden selection:bg-indigo-500/30 selection:text-indigo-200">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-purple-500/10 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[60vw] h-[60vw] bg-indigo-500/10 rounded-full blur-[100px] -translate-x-1/3 translate-y-1/3 animate-pulse-slow delay-700" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <Navbar user={user} />

            <main className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
                {/* Hero Section */}
                <section className="text-center space-y-6 animate-fade-in relative z-10">
                    <div className="inline-block">
                        <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white drop-shadow-sm pb-2">
                            Welcome back,{" "}
                            <span>
                                {user.user_metadata?.full_name?.split(" ")[0] || "Creative"}
                            </span>
                        </h2>
                        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-indigo-500 to-transparent mx-auto rounded-full opacity-50" />
                    </div>
                    <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto leading-relaxed font-light">
                        Your curated digital space. Everything you need, exactly where you left it.
                    </p>
                </section>

                {/* Action Bar */}
                <section className="max-w-3xl mx-auto transform transition-all hover:scale-[1.01] duration-500">
                    <BookmarkForm />
                </section>

                {/* Content Grid */}
                <section className="relative">
                    <div className="absolute -left-4 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-indigo-500/20 to-transparent hidden xl:block" />
                    <BookmarkList initialBookmarks={(bookmarks as Bookmark[]) || []} />
                </section>
            </main>

            {/* Footer */}
            <footer className="relative py-8 text-center border-t border-white/5 bg-white/5 backdrop-blur-sm">
                <p className="text-xs text-[var(--color-text-secondary)] tracking-wider uppercase font-medium">
                    Secure • Private • Real-time
                </p>
            </footer>
        </div>
    );
}
