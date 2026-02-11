'use client';

import { useEffect, useState } from 'react';

interface AnnouncerProps {
  message: string;
  politeness?: 'polite' | 'assertive';
}

export function Announcer({ message, politeness = 'polite' }: AnnouncerProps) {
  const [announced, setAnnounced] = useState('');

  useEffect(() => {
    const timeout = setTimeout(() => setAnnounced(message), 100);
    return () => clearTimeout(timeout);
  }, [message]);

  return (
    <div
      role="status"
      aria-live={politeness}
      aria-atomic="true"
      className="sr-only"
    >
      {announced}
    </div>
  );
}
