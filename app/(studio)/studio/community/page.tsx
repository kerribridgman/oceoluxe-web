'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Users, MessageCircle } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Community</h1>
        <p className="text-gray-500 mt-1">
          Connect with other members and share your journey
        </p>
      </div>

      <Card className="bg-white border-0 shadow-sm">
        <CardContent className="p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">Coming Soon</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Our community space is being built. Soon you'll be able to post
            updates, ask questions, and connect with fellow members.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
