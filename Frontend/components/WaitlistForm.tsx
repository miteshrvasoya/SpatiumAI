'use client';

import React, { useState } from 'react';
import { Loader2, CheckCircle2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export function WaitlistForm() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSuccess(true);
        toast.success(data.message || 'Joined successfully!');
      } else {
        toast.error(data.error || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Failed to connect to server');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 animate-in fade-in zoom-in duration-500">
        <div className="rounded-full bg-[var(--accent-primary)]/10 p-3">
          <CheckCircle2 className="h-8 w-8 text-[var(--accent-primary)]" />
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">You're on the list!</h3>
          <p className="text-[var(--text-secondary)] text-sm">We'll notify you as soon as early access opens.</p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md group">
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] opacity-20 blur transition duration-1000 group-hover:opacity-30 group-hover:duration-200"></div>
      <div className="relative flex flex-col sm:flex-row gap-3 rounded-xl bg-[var(--bg-base)] p-2 shadow-2xl border border-[var(--bg-border)]">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your professional email"
          required
          className="flex-1 bg-transparent px-4 py-3 text-sm text-[var(--text-primary)] outline-none placeholder:text-[var(--text-tertiary)]"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center justify-center gap-2 rounded-lg bg-[var(--accent-primary)] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--accent-primary)]/90 active:scale-95 disabled:opacity-50"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Join Waitlist
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
