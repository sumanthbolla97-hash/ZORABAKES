import React, { useState } from "react";
import { Link } from "react-router";
import { Button } from "@/components/ui/Button";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

export function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Check your inbox for further instructions.");
    } catch (err: any) {
      setError(err.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-24 md:px-12 flex justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-sm border border-[var(--color-zora-ink)]/5">
        <h1 className="mb-4 font-serif text-4xl font-bold text-[var(--color-zora-ink)] text-center">Reset Password</h1>
        <p className="mb-8 text-center text-sm font-medium text-[var(--color-zora-stone)]">
          Enter your email and we'll send you a link to reset your password.
        </p>
        
        {error && (
          <div className="mb-6 rounded-lg bg-red-50 p-4 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-6 rounded-lg bg-green-50 p-4 text-sm text-green-600 border border-green-200">
            {message}
          </div>
        )}

        <form onSubmit={handleReset} className="flex flex-col gap-6">
          <div>
            <label className="mb-2 block text-sm font-bold tracking-widest uppercase text-[var(--color-zora-ink)]">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[var(--color-zora-ink)]/20 px-4 py-3 text-[var(--color-zora-ink)] focus:border-[var(--color-zora-ink)] focus:outline-none focus:ring-1 focus:ring-[var(--color-zora-ink)]"
              placeholder="you@example.com"
            />
          </div>

          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? "Sending..." : "Reset Password"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm font-medium text-[var(--color-zora-stone)]">
          Remember your password?{" "}
          <Link to="/login" className="font-bold text-[var(--color-zora-ink)] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
