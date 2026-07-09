import type { Metadata, Viewport } from "next";
import { Inter, DM_Serif_Display, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { JsonLd } from "@fe/components/seo/json-ld";
import { ClarityInit } from "@fe/components/analytics/clarity";
import { GoogleAnalytics } from "@fe/components/analytics/google-analytics";
import { ReferralCapture } from "@fe/components/analytics/referral-capture";
import { AffiliateCapture } from "@fe/components/analytics/affiliate-capture";
import { GitBookWidget } from "@fe/components/analytics/gitbook-widget";
import { Amplitude } from "@fe/amplitude";
import { CookieConsentBanner } from "@fe/components/cookies/cookie-consent";
import { QueryProvider } from "@fe/components/providers/query-provider";
import { ChunkReloadGuard } from "@fe/components/system/chunk-reload-guard";
import {
  buildMetadata,
  organizationJsonLd,
  softwareApplicationJsonLd,
  websiteJsonLd,
} from "@fe/lib/seo";

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const fontSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  ...buildMetadata({ path: "/" }),
  title: {
    default: "Signalor.ai | AI search visibility & GEO platform",
    template: "%s | Signalor.ai",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`light ${fontSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Signalor Blog"
          href="/blog/rss.xml"
        />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml" />
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key="Ii1VFS6QFRSKltNUh1aCZA"
          async
        ></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-TQ7NBN8Q');`,
          }}
        />
        <JsonLd id="ld-organization" data={organizationJsonLd()} />
        <JsonLd id="ld-website" data={websiteJsonLd()} />
        <JsonLd id="ld-software" data={softwareApplicationJsonLd()} />
      </head>
      <body
        suppressHydrationWarning
        className={`signalor-body ${fontSerif.variable} ${fontMono.variable} overflow-x-hidden antialiased`}
      >
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-TQ7NBN8Q"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ChunkReloadGuard />
        <Amplitude />
        <ClarityInit />
        <GoogleAnalytics />
        <Suspense fallback={null}>
          <ReferralCapture />
          <AffiliateCapture />
        </Suspense>
        <QueryProvider>{children}</QueryProvider>
        <CookieConsentBanner />
        <Analytics />
        <SpeedInsights />
        <GitBookWidget />
      </body>
    </html>
  );
}
