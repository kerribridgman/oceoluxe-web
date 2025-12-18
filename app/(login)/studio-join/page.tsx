'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useActionState, Suspense } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowRight, Check } from 'lucide-react';
import { studioSignUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

const features = [
  'Full access to all courses',
  'Downloadable templates & resources',
  'Private community access',
  'Progress tracking & certificates',
];

function JoinForm() {
  const searchParams = useSearchParams();
  const plan = searchParams.get('plan') || 'yearly';

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    studioSignUp,
    { error: '' }
  );

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-[#CDA7B2] flex items-center justify-center shadow-lg">
                <span className="text-[#3B3937] font-bold text-lg">OL</span>
              </div>
              <div>
                <h1 className="text-lg font-serif font-light text-gray-900">
                  Studio Systems
                </h1>
              </div>
            </Link>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Create your account
            </h2>
            <p className="text-gray-600">
              Join Studio Systems and start learning today
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="plan" value={plan} />

            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Your name"
                defaultValue={state.name}
                required
                className="h-11"
              />
            </div>

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Create a password (min 8 characters)"
                defaultValue={state.password}
                required
                minLength={8}
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
                  Creating account...
                </>
              ) : (
                <>
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link
              href="/studio-login"
              className="text-[#CDA7B2] hover:text-[#CDA7B2]/80 font-medium"
            >
              Sign in
            </Link>
          </p>

          <p className="mt-4 text-center text-xs text-gray-500">
            By creating an account, you agree to our{' '}
            <Link href="/terms" className="underline">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Benefits */}
      <div className="hidden lg:flex flex-1 bg-[#3B3937] text-white items-center justify-center p-8">
        <div className="max-w-md">
          <h3 className="text-2xl font-serif font-light mb-6">
            Everything you need to grow your fashion business
          </h3>
          <ul className="space-y-4">
            {features.map((feature) => (
              <li key={feature} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#CDA7B2] flex items-center justify-center flex-shrink-0">
                  <Check className="w-3 h-3 text-[#3B3937]" />
                </div>
                <span className="text-white/90">{feature}</span>
              </li>
            ))}
          </ul>
          <div className="mt-8 p-4 bg-white/10 rounded-xl">
            <p className="text-sm text-white/70 mb-2">Selected plan:</p>
            <p className="text-xl font-semibold">
              {plan === 'yearly' ? '$297/year' : '$33/month'}
            </p>
            <p className="text-sm text-white/60 mt-1">
              {plan === 'yearly' ? 'Save over 25%' : 'Cancel anytime'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioJoinPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#CDA7B2]" />
        </div>
      }
    >
      <JoinForm />
    </Suspense>
  );
}
