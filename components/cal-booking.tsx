'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar, Loader2 } from 'lucide-react';

declare global {
  interface Window {
    Cal?: {
      (action: string, ...args: unknown[]): void;
      ns?: Record<string, unknown>;
      loaded?: boolean;
    };
  }
}

interface CalBookingButtonProps {
  className?: string;
  children?: React.ReactNode;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  eventSlug?: string;
  calUsername?: string;
}

export function CalBookingButton({
  className = '',
  children = 'Book a Consultation',
  variant = 'default',
  size = 'default',
  eventSlug,
  calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME,
}: CalBookingButtonProps) {
  const calLink = eventSlug ? `${calUsername}/${eventSlug}` : calUsername;

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Cal) {
        window.Cal('init', { origin: 'https://cal.com' });
      }
    };

    return () => {
      const existingScript = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  const handleClick = () => {
    if (window.Cal && calLink) {
      window.Cal('ui', {
        styles: { branding: { brandColor: '#CDA7B2' } },
        hideEventTypeDetails: false,
        layout: 'month_view',
      });
      window.Cal('openModal', {
        calLink,
        config: {
          layout: 'month_view',
        },
      });
    } else if (calLink) {
      window.open(`https://cal.com/${calLink}`, '_blank');
    }
  };

  if (!calUsername) {
    return null;
  }

  return (
    <Button
      onClick={handleClick}
      variant={variant}
      size={size}
      className={className}
    >
      <Calendar className="w-4 h-4 mr-2" />
      {children}
    </Button>
  );
}

interface CalEmbedProps {
  eventSlug?: string;
  className?: string;
  calUsername?: string;
}

export function CalEmbed({
  eventSlug,
  className = '',
  calUsername = process.env.NEXT_PUBLIC_CAL_USERNAME,
}: CalEmbedProps) {
  const calLink = eventSlug ? `${calUsername}/${eventSlug}` : calUsername;

  if (!calUsername) {
    return (
      <div className="text-center p-8 text-gray-500">
        Calendar not configured. Please set NEXT_PUBLIC_CAL_USERNAME.
      </div>
    );
  }

  // Use iframe embed - more reliable than JS embed
  return (
    <div className={`${className}`}>
      <iframe
        src={`https://cal.com/${calLink}?embed=true&layout=month_view&theme=light`}
        width="100%"
        height="700"
        frameBorder="0"
        className="rounded-lg"
        allow="camera; microphone; fullscreen"
      />
    </div>
  );
}
