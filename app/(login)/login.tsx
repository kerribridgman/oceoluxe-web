'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Code2, Sparkles, Zap } from 'lucide-react';
import Image from 'next/image';
import { signIn, signUp } from './actions';
import { ActionState } from '@/lib/auth/middleware';

export function Login({ mode = 'signin' }: { mode?: 'signin' | 'signup' }) {
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');
  const priceId = searchParams.get('priceId');
  const inviteId = searchParams.get('inviteId');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    mode === 'signin' ? signIn : signUp,
    { error: '' }
  );

  return (
    <div className="min-h-[100dvh] flex bg-gradient-to-br from-[#1a2332] via-[#1e2838] to-[#243442]">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 flex-col justify-center px-12 py-12 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-20 left-10 text-6xl text-[#4a9fd8]/10 font-mono">&lt;/&gt;</div>
        <div className="absolute bottom-20 right-20 text-6xl text-[#4a9fd8]/10 font-mono">&#123;&#125;</div>
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-[#4a9fd8]/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <Image
            src="/logo.png"
            alt="Patrick Farrell"
            width={280}
            height={50}
            className="h-12 w-auto mb-8"
          />

          <h1 className="text-4xl font-bold text-white mb-6">
            {mode === 'signin'
              ? 'Welcome Back!'
              : 'Start Your Journey'}
          </h1>

          <p className="text-xl text-gray-300 mb-12 max-w-md leading-relaxed">
            {mode === 'signin'
              ? 'Access your dashboard and continue building amazing things.'
              : 'Join us and unlock powerful tools to grow your business.'}
          </p>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#4a9fd8]/10 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-[#4a9fd8]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Modern Tools</h3>
                <p className="text-gray-400 text-sm">Built with the latest technology stack</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#4a9fd8]/10 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#4a9fd8]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">AI-Powered</h3>
                <p className="text-gray-400 text-sm">Leverage artificial intelligence to scale faster</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#4a9fd8]/10 flex items-center justify-center">
                <Zap className="w-5 h-5 text-[#4a9fd8]" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Lightning Fast</h3>
                <p className="text-gray-400 text-sm">Optimized for performance and efficiency</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-20 bg-white">
        <div className="w-full max-w-md mx-auto">
          {/* Mobile logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <Image
              src="/logo.png"
              alt="Patrick Farrell"
              width={220}
              height={40}
              className="h-10 w-auto"
            />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              {mode === 'signin' ? 'Sign in to your account' : 'Create your account'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {mode === 'signin'
                ? 'Enter your credentials to access your dashboard'
                : 'Get started with your free account'}
            </p>
          </div>

          <form className="space-y-6" action={formAction}>
            <input type="hidden" name="redirect" value={redirect || ''} />
            <input type="hidden" name="priceId" value={priceId || ''} />
            <input type="hidden" name="inviteId" value={inviteId || ''} />

            <div>
              <Label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                defaultValue={state.email}
                required
                maxLength={50}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a9fd8] focus:border-[#4a9fd8] transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <Label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-900 mb-2"
              >
                Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={
                  mode === 'signin' ? 'current-password' : 'new-password'
                }
                defaultValue={state.password}
                required
                minLength={8}
                maxLength={100}
                className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4a9fd8] focus:border-[#4a9fd8] transition-colors"
                placeholder="Enter your password"
              />
            </div>

            {state?.error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-4">
                <p className="text-sm text-red-600 font-medium">{state.error}</p>
              </div>
            )}

            <div>
              <Button
                type="submit"
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-[#4a9fd8] hover:bg-[#3a8fc8] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a9fd8] transition-colors"
                disabled={pending}
              >
                {pending ? (
                  <>
                    <Loader2 className="animate-spin mr-2 h-5 w-5" />
                    Loading...
                  </>
                ) : mode === 'signin' ? (
                  'Sign in'
                ) : (
                  'Sign up'
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">
                  {mode === 'signin'
                    ? 'New to our platform?'
                    : 'Already have an account?'}
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                href={`${mode === 'signin' ? '/sign-up' : '/sign-in'}${
                  redirect ? `?redirect=${redirect}` : ''
                }${priceId ? `&priceId=${priceId}` : ''}`}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4a9fd8] transition-colors"
              >
                {mode === 'signin'
                  ? 'Create an account'
                  : 'Sign in to existing account'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
