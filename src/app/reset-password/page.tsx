"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { LockKeyhole } from "lucide-react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    if (!token || !email) {
      setStatus("error");
      setMessage("Invalid password reset link. Missing token or email.");
    }
  }, [token, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "error" && !token) return;

    if (password !== confirmPassword) {
      setStatus("error");
      setMessage("Passwords do not match");
      return;
    }

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });
      
      const data: any = await res.json();
      
      if (data.success) {
        setStatus("success");
        setMessage("Your password has been successfully reset. You can now log in.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to reset password");
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
            <LockKeyhole className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Set New Password</h1>
          <p className="text-muted-foreground mt-2 text-center">Create a new secure password</p>
        </div>

        {status === "success" ? (
          <div className="text-center">
            <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-2xl border border-green-200 dark:border-green-900/50 mb-8">
              <p>{message}</p>
            </div>
            <Link 
              href="/login" 
              className="inline-block w-full bg-foreground text-background py-4 rounded-[16px] font-semibold text-lg hover:opacity-90 transition-opacity"
            >
              Go to Sign In
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                placeholder="New password (min 10 characters)"
                minLength={10}
                required
                disabled={!token || !email}
              />
            </div>
            <div>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                placeholder="Confirm new password"
                minLength={10}
                required
                disabled={!token || !email}
              />
            </div>
            
            {status === "error" && (
              <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg text-center">
                {message}
              </p>
            )}
            
            <button
              type="submit"
              disabled={status === "loading" || !token || !email}
              className="w-full bg-foreground text-background py-4 rounded-[16px] font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
            >
              {status === "loading" ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
