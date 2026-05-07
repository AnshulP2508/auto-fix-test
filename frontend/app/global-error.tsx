'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect, useState } from 'react';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const [eventId, setEventId] = useState<string>();

  useEffect(() => {
    const captured = Sentry.captureException(error);
    setEventId(captured);
  }, [error]);

  return (
    <html>
      <body>
        <main className="error-page">
          <h1>Something went wrong</h1>
          <p>Our team has been notified. Use this event ID when contacting support.</p>
          <code>{eventId || error.digest || 'pending'}</code>
          <div className="toolbar">
            <button onClick={() => eventId && Sentry.showReportDialog({ eventId })}>Report feedback</button>
            <button onClick={reset}>Try again</button>
          </div>
        </main>
      </body>
    </html>
  );
}
