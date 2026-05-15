'use client';

import DOMPurify from 'dompurify';

DOMPurify.setConfig({ ALLOWED_TAGS: [] });

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty);
}

export function sanitizeHtmlWithTags(dirty: string, allowedTags: string[]): string {
  DOMPurify.setConfig({ ALLOWED_TAGS: allowedTags });
  return DOMPurify.sanitize(dirty);
}

export function createMarkup(html: string) {
  return {
    __html: sanitizeHtml(html),
  };
}
