import type { NextApiRequest, NextApiResponse } from "next";
import * as Sentry from "@sentry/nextjs";

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const now = new Date().toISOString();

  console.log(`[sentry-log-test] log ${now}`);
  console.info(`[sentry-log-test] info ${now}`);
  console.warn(`[sentry-log-test] warn ${now}`);
  console.error(`[sentry-log-test] error ${now}`);

  Sentry.captureMessage(`[sentry-log-test] captureMessage ${now}`);
  await Sentry.flush(2000);

  res.status(200).json({ ok: true, timestamp: now });
}
