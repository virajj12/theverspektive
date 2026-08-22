"use client";

import { useState } from "react";
import Link from "next/link";
import { KeyRound } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      
      const data: any = await res.json();
      
      if (data.success) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.error || "Request failed");
      }
    } catch (err) {
      setStatus("error");
      setMessage("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 pt-24">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[28px] shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-white/10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <KeyRound className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Reset Password</h1>
          <p className="text-muted-foreground mt-2 text-center">Enter your email to receive a reset link</p>
        </div>

        {status === "success" ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-2xl text-center border border-green-200 dark:border-green-900/50">
            <h3 className="font-semibold text-lg mb-2">Check your email</h3>
            <p>{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                placeholder="Email address"
                required
              />
            </div>
            
            {status === "error" && (
              <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg text-center">
                {message}
              </p>
            )}
            
            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-foreground text-background py-4 rounded-[16px] font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
            >
              {status === "loading" ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <Link href="/login" className="font-semibold text-muted-foreground hover:text-foreground transition-colors">
            Return to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
