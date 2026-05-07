import { Head, Html, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="dns-prefetch" href="//old-cdn.vulnshop.invalid" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
