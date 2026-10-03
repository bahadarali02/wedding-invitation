"use client";

import { useActionState } from "react";
import { LockKeyhole, Mail, ArrowRight, Loader2 } from "lucide-react";
import { loginAction, type LoginState } from "./actions";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, action, pending] = useActionState(
    loginAction,
    initialState
  );

  return (
    <form action={action} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Email address
        </label>

        <div className="relative">
          <Mail
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@example.com"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 outline-none transition focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="password"
          className="mb-2 block text-sm font-medium text-stone-700"
        >
          Password
        </label>

        <div className="relative">
          <LockKeyhole
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
          />

          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="Enter your password"
            className="h-12 w-full rounded-xl border border-stone-200 bg-white pl-11 pr-4 text-sm text-stone-900 outline-none transition focus:border-[#b99a5b] focus:ring-4 focus:ring-[#b99a5b]/10"
          />
        </div>
      </div>

      {state?.error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#171713] px-5 text-sm font-semibold text-white transition hover:bg-[#2b2a24] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign in to dashboard
            <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}