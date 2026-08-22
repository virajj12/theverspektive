"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      
      const data: any = await res.json();
      
      if (data.success) {
        router.push("/account");
        router.refresh();
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950 p-4 pt-24">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[28px] shadow-xl p-8 md:p-12 border border-zinc-200 dark:border-white/10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <User className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Welcome back</h1>
          <p className="text-muted-foreground mt-2 text-center">Sign in to your VerspeKtive account</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
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
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
              placeholder="Password"
              required
            />
          </div>
          
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Forgot password?
            </Link>
          </div>

          {error && <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg text-center">{error}</p>}
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-foreground text-background py-4 rounded-[16px] font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <Link href="/register" className="font-semibold text-foreground hover:underline underline-offset-4">
              Sign up now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
