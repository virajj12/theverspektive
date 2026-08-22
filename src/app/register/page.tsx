"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email, 
          password: formData.password 
        }),
      });
      
      const data: any = await res.json();
      
      if (data.success) {
        setSuccess(data.message);
        setFormData({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
      } else {
        setError(data.error || "Registration failed");
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
            <UserPlus className="w-8 h-8 text-foreground" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-center">Create Account</h1>
          <p className="text-muted-foreground mt-2 text-center">Join the VerspeKtive community</p>
        </div>

        {success ? (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-6 rounded-2xl text-center border border-green-200 dark:border-green-900/50">
            <h3 className="font-semibold text-lg mb-2">Check your email</h3>
            <p>{success}</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                  placeholder="First name"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                  placeholder="Last name"
                  required
                />
              </div>
            </div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                placeholder="Email address"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                placeholder="Password (min 10 characters)"
                minLength={10}
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-[16px] border border-zinc-300 dark:border-zinc-700 bg-transparent focus:outline-none focus:ring-2 focus:ring-foreground transition-all"
                placeholder="Confirm password"
                minLength={10}
                required
              />
            </div>
            
            {error && <p className="text-red-500 text-sm font-medium bg-red-50 dark:bg-red-950/30 p-3 rounded-lg text-center">{error}</p>}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-foreground text-background py-4 rounded-[16px] font-semibold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 mt-4"
            >
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-foreground hover:underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
