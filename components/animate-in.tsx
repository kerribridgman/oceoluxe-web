'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';

interface AnimateInProps {
  children: ReactNode;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'reveal-quote';
  delay?: number;
  threshold?: number;
  className?: string;
}

const animationClasses: Record<string, string> = {
  'fade-up': 'animate-reveal-up',
  'fade-in': 'animate-reveal-in',
  'slide-left': 'animate-reveal-slide-left',
  'slide-right': 'animate-reveal-slide-right',
  'reveal-quote': 'animate-reveal-quote',
};

export function AnimateIn({
  children,
  animation = 'fade-up',
  delay = 0,
  threshold = 0.15,
  className = '',
}: AnimateInProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`${isVisible ? animationClasses[animation] : 'opacity-0'} ${className}`}
      style={isVisible && delay > 0 ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  );
}
