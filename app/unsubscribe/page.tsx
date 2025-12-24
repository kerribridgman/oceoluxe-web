'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle, AlertCircle, Mail } from 'lucide-react';
import Link from 'next/link';

type UnsubscribeListType = 'marketing' | 'drips' | 'all';

interface ValidationData {
  email: string;
  firstName: string | null;
  listType: UnsubscribeListType;
  currentPreferences: {
    marketing: boolean;
    drips: boolean;
    all: boolean;
  };
}

function LoadingState() {
  return (
    <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
      <div className="text-[#967F71]">Loading...</div>
    </div>
  );
}

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationData, setValidationData] = useState<ValidationData | null>(null);
  const [selectedList, setSelectedList] = useState<UnsubscribeListType>('all');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setIsLoading(false);
      setError('No token provided');
    }
  }, [token]);

  async function validateToken() {
    try {
      const response = await fetch(`/api/unsubscribe?token=${token}`);
      const data = await response.json();

      if (data.valid) {
        setIsValid(true);
        setValidationData(data);
        setSelectedList(data.listType || 'all');
      } else {
        setError(data.error || 'Invalid link');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          listType: selectedList,
          reason: reason || undefined,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setIsComplete(true);
      } else {
        setError(data.error || 'Failed to unsubscribe');
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
              You've been unsubscribed
            </h2>
            <p className="text-[#967F71] mb-6">
              {selectedList === 'all'
                ? 'You will no longer receive any emails from us.'
                : selectedList === 'marketing'
                ? 'You will no longer receive marketing emails.'
                : 'You will no longer receive drip sequence emails.'}
            </p>
            <p className="text-sm text-[#967F71] mb-6">
              Changed your mind? You can always re-subscribe by signing up again on our website.
            </p>
            <Link href="/">
              <Button className="bg-[#CDA7B2] hover:bg-[#b8909a] text-white">
                Return to Website
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-8 text-center">
            <AlertCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-serif font-light text-[#3B3937] mb-2">
              Invalid Link
            </h2>
            <p className="text-[#967F71] mb-6">
              {error === 'Token expired'
                ? 'This unsubscribe link has expired. Please use a more recent email.'
                : error === 'Token already used'
                ? 'This unsubscribe link has already been used.'
                : 'This unsubscribe link is invalid or has expired.'}
            </p>
            <p className="text-sm text-[#967F71] mb-6">
              If you need help, please contact us at{' '}
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
          <Mail className="h-12 w-12 mx-auto text-[#CDA7B2] mb-2" />
          <CardTitle className="text-2xl font-serif font-light text-[#3B3937]">
            Manage Email Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-[#967F71]">
            {validationData?.firstName
              ? `Hi ${validationData.firstName}, `
              : ''}
            Choose which emails you'd like to stop receiving:
          </p>

          <RadioGroup value={selectedList} onValueChange={(value) => setSelectedList(value as UnsubscribeListType)}>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="marketing" id="marketing" className="mt-1" />
                <div>
                  <Label htmlFor="marketing" className="font-medium text-[#3B3937]">
                    Marketing Emails
                  </Label>
                  <p className="text-sm text-[#967F71]">
                    Promotional emails, newsletters, and special offers
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="drips" id="drips" className="mt-1" />
                <div>
                  <Label htmlFor="drips" className="font-medium text-[#3B3937]">
                    Automated Sequences
                  </Label>
                  <p className="text-sm text-[#967F71]">
                    Welcome emails, onboarding sequences, and educational content
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value="all" id="all" className="mt-1" />
                <div>
                  <Label htmlFor="all" className="font-medium text-[#3B3937]">
                    All Emails
                  </Label>
                  <p className="text-sm text-[#967F71]">
                    Unsubscribe from all non-transactional emails
                  </p>
                </div>
              </div>
            </div>
          </RadioGroup>

          <div>
            <Label htmlFor="reason" className="text-sm text-[#967F71]">
              Help us improve (optional)
            </Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Let us know why you're unsubscribing..."
              rows={3}
              className="mt-1"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full bg-[#CDA7B2] hover:bg-[#b8909a] text-white"
          >
            {isSubmitting ? 'Processing...' : 'Unsubscribe'}
          </Button>

          <p className="text-xs text-center text-[#967F71]">
            You're unsubscribing: {validationData?.email}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <UnsubscribeContent />
    </Suspense>
  );
}
