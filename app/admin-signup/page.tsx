'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, Lock } from 'lucide-react';
import Link from 'next/link';

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="text-[#967F71]">Validating invitation...</div>
    </div>
  );
}

function AdminSignupContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setIsLoading(false);
      setError('No invitation token provided');
    }
  }, [token]);

  async function validateToken() {
    try {
      const response = await fetch(`/api/admin/invites/validate?token=${token}`);
      const data = await response.json();

      if (data.valid) {
        setIsValid(true);
        setEmail(data.email);
      } else {
        setError(data.error || 'Invalid invitation');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      setError('Password must include uppercase, lowercase, and a number');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/admin/invites/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          name,
          password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsComplete(true);
        // Redirect to dashboard after short delay
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Failed to create account');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <LoadingState />;
  }

  if (isComplete) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-2">
              Account Created!
            </h2>
            <p className="text-[#967F71] mb-6">
              Your admin account has been created successfully. Redirecting to dashboard...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-2">
              Invalid Invitation
            </h2>
            <p className="text-[#967F71] mb-6">
              {error === 'Invitation has expired'
                ? 'This invitation link has expired. Please request a new one.'
                : error === 'Invitation has already been used'
                ? 'This invitation has already been used to create an account.'
                : 'This invitation link is invalid or has expired.'}
            </p>
            <p className="text-sm text-[#967F71] mb-6">
              If you need help, please contact{' '}
              <a href="mailto:kerrib@oceoluxe.com" className="text-[#CDA7B2] hover:underline">
                kerrib@oceoluxe.com
              </a>
            </p>
            <Link href="/">
              <Button variant="outline">Return to Website</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <Lock className="h-12 w-12 mx-auto text-[#CDA7B2] mb-2" />
          <CardTitle className="text-2xl font-serif font-light text-[#3B3937]">
            Create Your Admin Account
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-50"
              />
            </div>

            <div>
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                minLength={8}
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !password || !confirmPassword}
              className="w-full bg-[#CDA7B2] hover:bg-[#b8909a] text-white"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-xs text-center text-[#967F71] mt-4">
            By creating an account, you agree to our Terms of Service.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminSignupPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <AdminSignupContent />
    </Suspense>
  );
}
