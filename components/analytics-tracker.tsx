'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { getVisitorId, getSessionId, detectBot } from '@/lib/analytics/fingerprint';
import type { PageViewEvent } from '@/types/analytics';

const ANALYTICS_ENDPOINT = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;
const ANALYTICS_ENABLED = process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === 'true';

/**
 * AnalyticsTracker component
 * Tracks page views and sends them to the analytics backend
 * Respects zero-cookie policy by using localStorage and fingerprinting
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const lastTrackedPath = useRef<string | null>(null);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Skip if analytics is disabled or endpoint not configured
    if (!ANALYTICS_ENABLED || !ANALYTICS_ENDPOINT) {
      return;
    }

    // Skip if path hasn't changed (prevent duplicate tracking)
    if (pathname === lastTrackedPath.current) {
      return;
    }

    // Debounce rapid navigation
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      trackPageView();
      lastTrackedPath.current = pathname;
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [pathname]);

  const trackPageView = async () => {
    // Skip if endpoint not configured
    if (!ANALYTICS_ENDPOINT) {
      return;
    }

    try {
      // Collect page view data
      const event: PageViewEvent = {
        visitor_id: getVisitorId(),
        session_id: getSessionId(),
        page_path: pathname,
        page_title: document.title,
        referrer: document.referrer || '(direct)',
        user_agent: navigator.userAgent,
        screen_resolution: `${screen.width}x${screen.height}`,
        viewport_size: `${window.innerWidth}x${window.innerHeight}`,
        language: navigator.language,
        timestamp: Date.now(),
        is_bot: detectBot(),
      };

      // Send to analytics endpoint
      await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
        // Don't wait for response
        keepalive: true,
      });
    } catch (error) {
      // Fail silently - analytics should never break the app
      if (process.env.NODE_ENV === 'development') {
        console.warn('Analytics tracking failed:', error);
      }
    }
  };

  // This component doesn't render anything
  return null;
}
