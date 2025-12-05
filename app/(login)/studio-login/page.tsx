'use client';

import Link from 'next/link';
import { useActionState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { studioSignIn } from './actions';
import { ActionState } from '@/lib/auth/middleware';

function LoginForm() {
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    studioSignIn,
    { error: '' }
  );

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm p-8">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#CDA7B2] flex items-center justify-center shadow-lg">
                <span className="text-[#3B3937] font-bold text-lg">OL</span>
              </div>
              <div className="text-left">
                <h1 className="text-lg font-serif font-light text-gray-900">
                  Studio Systems
                </h1>
              </div>
            </Link>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">Sign in to access your membership</p>
          </div>

          <form action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                defaultValue={state.email}
                required
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#CDA7B2] hover:text-[#CDA7B2]/80"
                >
                  Forgot password?
                </Link>
              </div>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                defaultValue={state.password}
                required
                className="h-11"
              />
            </div>

            {state.error && (
              <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {state.error}
              </p>
            )}

            <Button
              type="submit"
              disabled={pending}
              className="w-full h-11 bg-[#CDA7B2] hover:bg-[#CDA7B2]/90 text-white"
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have a membership?{' '}
              <Link
                href="/studio/subscribe"
                className="text-[#CDA7B2] hover:text-[#CDA7B2]/80 font-medium"
              >
                Join Studio Systems
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          Looking for the admin dashboard?{' '}
          <Link href="/sign-in" className="text-gray-700 hover:text-gray-900">
            Admin login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function StudioLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#CDA7B2]" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
