'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { MarketingHeader } from '@/components/marketing/marketing-header';
import { MarketingFooter } from '@/components/marketing/marketing-footer';

export default function CoachingApplicationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    socialHandle: '',
    interest: '',
    experiences: '',
    growthAreas: '',
    obstacles: '',
    willingToInvest: '',
    additionalInfo: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          type: 'coaching',
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit application');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-white">
        <MarketingHeader />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Application Submitted!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Thank you for your interest in 1:1 Tech Coaching. I'll review your application and get back to you within 48 hours.
          </p>
          <Link href="/">
            <Button className="bg-[#4a9fd8] hover:bg-[#3a8fc8] text-white">
              Return to Home
            </Button>
          </Link>
        </div>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <MarketingHeader />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/" className="inline-flex items-center text-[#4a9fd8] hover:text-[#3a8fc8] mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Apply for 1:1 Tech Coaching
          </h1>
          <p className="text-xl text-gray-600">
            High-touch experience for founders ready to create aligned and profitable online businesses.
            Clarity. Confidence. Clients.
          </p>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="border-b border-gray-100 pb-6">
            <CardTitle className="text-2xl font-semibold text-gray-900">
              Application Form
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              Please answer the following questions to help me understand your needs and goals.
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name" className="text-base font-medium text-gray-900">
                  What is your name? *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  className="mt-2"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-base font-medium text-gray-900">
                  What is your email? *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  required
                  className="mt-2"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-base font-medium text-gray-900">
                  What is your phone number? *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  required
                  className="mt-2"
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <Label htmlFor="socialHandle" className="text-base font-medium text-gray-900">
                  What is your Instagram Handle? (Or most used social media account link) *
                </Label>
                <Input
                  id="socialHandle"
                  value={formData.socialHandle}
                  onChange={(e) => handleChange('socialHandle', e.target.value)}
                  required
                  className="mt-2"
                  placeholder="@yourusername or https://..."
                />
              </div>

              <div>
                <Label htmlFor="interest" className="text-base font-medium text-gray-900">
                  What interests you about working with Patrick? *
                </Label>
                <Textarea
                  id="interest"
                  value={formData.interest}
                  onChange={(e) => handleChange('interest', e.target.value)}
                  required
                  rows={4}
                  className="mt-2"
                  placeholder="Share what drew you to apply..."
                />
              </div>

              <div>
                <Label htmlFor="experiences" className="text-base font-medium text-gray-900">
                  What kind of experiences do you want to have in your life? *
                </Label>
                <Textarea
                  id="experiences"
                  value={formData.experiences}
                  onChange={(e) => handleChange('experiences', e.target.value)}
                  required
                  rows={4}
                  className="mt-2"
                  placeholder="Describe your desired experiences..."
                />
              </div>

              <div>
                <Label htmlFor="growthAreas" className="text-base font-medium text-gray-900">
                  Where are you looking to grow in your life right now? *
                </Label>
                <Textarea
                  id="growthAreas"
                  value={formData.growthAreas}
                  onChange={(e) => handleChange('growthAreas', e.target.value)}
                  required
                  rows={4}
                  className="mt-2"
                  placeholder="Share your growth goals..."
                />
              </div>

              <div>
                <Label htmlFor="obstacles" className="text-base font-medium text-gray-900">
                  What is currently stopping you from achieving your goals? *
                </Label>
                <Textarea
                  id="obstacles"
                  value={formData.obstacles}
                  onChange={(e) => handleChange('obstacles', e.target.value)}
                  required
                  rows={4}
                  className="mt-2"
                  placeholder="What challenges are you facing?"
                />
              </div>

              <div>
                <Label className="text-base font-medium text-gray-900 mb-3 block">
                  Are you willing to invest in your own growth right now? *
                </Label>
                <RadioGroup
                  value={formData.willingToInvest}
                  onValueChange={(value) => handleChange('willingToInvest', value)}
                  required
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-[#4a9fd8] transition-colors">
                    <RadioGroupItem value="yes" id="yes" />
                    <Label htmlFor="yes" className="flex-1 cursor-pointer font-normal">
                      Yes, I'm ready to invest in myself
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border border-gray-200 rounded-lg p-4 hover:border-[#4a9fd8] transition-colors">
                    <RadioGroupItem value="no" id="no" />
                    <Label htmlFor="no" className="flex-1 cursor-pointer font-normal">
                      Not at this time
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="additionalInfo" className="text-base font-medium text-gray-900">
                  Any thing else you want to tell me to help me get to know you...
                </Label>
                <Textarea
                  id="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={(e) => handleChange('additionalInfo', e.target.value)}
                  rows={4}
                  className="mt-2"
                  placeholder="Optional - share anything else you'd like me to know"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  {error}
                </div>
              )}

              <div className="pt-6 border-t border-gray-100">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#4a9fd8] hover:bg-[#3a8fc8] text-white text-lg py-6"
                >
                  {submitting ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      <MarketingFooter />
    </div>
  );
}
