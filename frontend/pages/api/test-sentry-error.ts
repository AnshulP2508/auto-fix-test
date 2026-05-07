import type { NextApiRequest, NextApiResponse } from 'next';
import * as Sentry from '@sentry/nextjs';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  console.log('Triggering Sentry manual capture...');
  Sentry.captureMessage('Manual Sentry Test Message: ' + new Date().toISOString());
  await Sentry.flush(2000);
  throw new Error('Test Sentry Error: ' + new Date().toISOString());
}
