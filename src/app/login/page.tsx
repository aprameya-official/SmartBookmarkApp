"use client";

import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function LoginContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get("error");
    const supabase = createClient();
    const [hovered, setHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth) * 100,
                y: (e.clientY / window.innerHeight) * 100,
            });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[var(--color-surface)]">
            {/* Dynamic Background Mesh */}
            <div
                className="absolute inset-0 opacity-60 transition-transform duration-[2s] ease-out"
                style={{
                    background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(99, 102, 241, 0.25) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y
                        }%, rgba(244, 114, 182, 0.25) 0%, transparent 50%)
          `,
                }}
            />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 brightness-100 contrast-150 mix-blend-overlay"></div>

            {/* Floating Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-500/30 blur-[120px] animate-pulse-slow" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-indigo-500/30 blur-[120px] animate-pulse-slow delay-1000" />

            {/* Login Card */}
            <div className="relative z-10 w-full max-w-md p-8 md:p-12 mx-4 glass rounded-3xl shadow-2xl backdrop-blur-2xl border border-white/20 overflow-hidden animate-slide-up ring-1 ring-white/30">
                {/* Shine Effect */}
                <div
                    className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 translate-x-[-100%] animate-[shine_3s_infinite]"
                    style={{ animationPlayState: hovered ? "running" : "paused" }}
                />

                {/* Logo Area */}
                <div className="flex flex-col items-center justify-center text-center mb-10">
                    <div className="relative mb-6 group">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
                        <div className="relative w-20 h-20 bg-gradient-to-br from-white/80 to-white/50 rounded-2xl border border-white/40 flex items-center justify-center backdrop-blur-sm shadow-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                            <svg
                                className="w-10 h-10 text-indigo-600 drop-shadow-sm"
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
                    <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 tracking-tight mb-3 drop-shadow-sm">
                        Smart Bookmark
                    </h1>
                    <p className="text-gray-600 font-medium text-sm max-w-[260px] leading-relaxed">
                        Curate your digital universe with intelligent precision.
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-200 text-sm text-center animate-slide-down backdrop-blur-md">
                        Authentication failed. Please try again.
                    </div>
                )}

                {/* Action Button */}
                <button
                    onClick={handleGoogleLogin}
                    onMouseEnter={() => setHovered(true)}
                    onMouseLeave={() => setHovered(false)}
                    className="group relative w-full flex items-center justify-center gap-3 px-8 py-4 bg-white text-gray-900 rounded-xl font-medium text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <svg className="w-5 h-5 relative z-10" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    <span className="relative z-10">Continue with Google</span>
                </button>

                {/* Footer */}
                <p className="text-center text-[var(--color-text-secondary)] text-xs mt-8 opacity-60">
                    Secured by Supabase • Private by Design
                </p>
            </div>

            {/* Decorative Lines */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent transform -translate-y-1/2" />
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-white/10 to-transparent transform -translate-x-1/2" />
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
                    <div className="w-8 h-8 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
                </div>
            }
        >
            <LoginContent />
        </Suspense>
    );
}
