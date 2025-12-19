// Browser fingerprinting utility for generating unique visitor IDs without cookies
// Uses canvas fingerprinting + browser characteristics

const VISITOR_ID_KEY = 'fbe_visitor_id';
const SESSION_ID_KEY = 'fbe_session_id';

/**
 * Generate a canvas fingerprint based on browser rendering characteristics
 */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return '';
    }

    // Draw text with specific styling
    canvas.width = 200;
    canvas.height = 50;
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#f60';
    ctx.fillRect(100, 1, 62, 20);
    ctx.fillStyle = '#069';
    ctx.font = '14px Arial';
    ctx.fillText('French by Examples 🇫🇷', 2, 15);
    ctx.fillStyle = 'rgba(102, 204, 0, 0.7)';
    ctx.font = '18px Georgia';
    ctx.fillText('Analytics Fingerprint', 4, 35);

    // Get canvas data URL and hash it
    const dataURL = canvas.toDataURL();
    return simpleHash(dataURL);
  } catch (error) {
    // Canvas fingerprinting may fail in some browsers
    return '';
  }
}

/**
 * Simple hash function for strings
 */
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Generate a browser fingerprint from various characteristics
 */
function getBrowserFingerprint(): string {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth.toString(),
    screen.width + 'x' + screen.height,
    new Date().getTimezoneOffset().toString(),
    !!window.sessionStorage,
    !!window.localStorage,
    !!window.indexedDB,
  ];

  // Add canvas fingerprint
  const canvasFP = getCanvasFingerprint();
  if (canvasFP) {
    components.push(canvasFP);
  }

  return simpleHash(components.join('|'));
}

/**
 * Generate a UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Get or create a visitor ID
 * Uses localStorage to persist across sessions
 */
export function getVisitorId(): string {
  try {
    // Check if we already have a visitor ID
    const existing = localStorage.getItem(VISITOR_ID_KEY);
    if (existing) {
      return existing;
    }

    // Generate new visitor ID based on browser fingerprint
    const fingerprint = getBrowserFingerprint();
    const visitorId = `v_${fingerprint}_${Date.now().toString(36)}`;

    localStorage.setItem(VISITOR_ID_KEY, visitorId);
    return visitorId;
  } catch (error) {
    // localStorage might be disabled or unavailable
    // Fall back to session-only UUID
    return `v_temp_${generateUUID()}`;
  }
}

/**
 * Get or create a session ID
 * Uses sessionStorage to reset on browser close
 */
export function getSessionId(): string {
  try {
    // Check if we already have a session ID
    const existing = sessionStorage.getItem(SESSION_ID_KEY);
    if (existing) {
      return existing;
    }

    // Generate new session ID
    const sessionId = `s_${generateUUID()}`;
    sessionStorage.setItem(SESSION_ID_KEY, sessionId);
    return sessionId;
  } catch (error) {
    // sessionStorage might be disabled or unavailable
    return `s_temp_${generateUUID()}`;
  }
}

/**
 * Detect if the current session is likely a bot
 */
export function detectBot(): boolean {
  // Check for webdriver
  if (navigator.webdriver) {
    return true;
  }

  // Check for headless browsers
  if (!navigator.languages || navigator.languages.length === 0) {
    return true;
  }

  // Check for phantom/selenium
  if ((window as any).callPhantom || (window as any)._phantom || (window as any).__nightmare) {
    return true;
  }

  // Check user agent for common bot patterns
  const botPatterns = [
    /bot/i, /crawl/i, /spider/i, /slurp/i,
    /headless/i, /phantom/i, /selenium/i,
  ];

  const userAgent = navigator.userAgent;
  return botPatterns.some(pattern => pattern.test(userAgent));
}
