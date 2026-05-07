import type { NextPageContext } from 'next';
import NextErrorComponent, { ErrorProps } from 'next/error';
import * as Sentry from '@sentry/nextjs';

type SentryErrorProps = ErrorProps & {
  eventId?: string;
};

function CustomErrorPage(props: SentryErrorProps) {
  return (
    <main className="error-page">
      <NextErrorComponent statusCode={props.statusCode} />
      {props.eventId && <p>Support reference: <code>{props.eventId}</code></p>}
    </main>
  );
}

CustomErrorPage.getInitialProps = async (context: NextPageContext): Promise<SentryErrorProps> => {
  const errorInitialProps = await NextErrorComponent.getInitialProps(context);
  const eventId = await Sentry.captureUnderscoreErrorException(context);
  return { ...errorInitialProps, eventId };
};

export default CustomErrorPage;
