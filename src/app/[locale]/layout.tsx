import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";

export const metadata: Metadata = {
  title: "سيرتي - Siraty | AI Career Coach",
  description:
    "Create, improve, and optimize your resume with AI assistance. Build professional CVs in Arabic and English.",
  keywords: [
    "CV",
    "Resume",
    "AI",
    "Career",
    "Job",
    "Arabic",
    "English",
    "سيرة ذاتية",
    "ATS",
    "Job Matching",
  ],
  authors: [{ name: "Siraty Team" }],
  creator: "Siraty",
  publisher: "Siraty",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://siraty.app"),
  openGraph: {
    title: "سيرتي - Siraty | AI Career Coach",
    description: "Create, improve, and optimize your resume with AI assistance",
    url: "https://siraty.app",
    siteName: "Siraty",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "سيرتي - Siraty | AI Career Coach",
    description: "Create, improve, and optimize your resume with AI assistance",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // Add your verification tokens here
    // google: 'your-google-verification-token',
    // yandex: 'your-yandex-verification-token',
  },
};

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;

  // Validate locale
  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // Get messages for the locale
  const messages = await getMessages();

  // Determine text direction and font based on locale
  const isRTL = locale === "ar";
  const direction = isRTL ? "rtl" : "ltr";
  const fontClass = isRTL ? "font-arabic" : "font-latin";

  return (
    <html
      lang={locale}
      dir={direction}
      className={`h-full ${fontClass}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        {/* Viewport meta tag for responsive design */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes"
        />

        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#2563eb" />
        <meta name="msapplication-TileColor" content="#2563eb" />

        {/* Apple touch icon */}
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />

        {/* Favicon */}
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />

        {/* Manifest for PWA */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//api.openai.com" />

        {/* Structured data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: "Siraty",
              alternateName: "سيرتي",
              description:
                "AI-powered career coaching tool for creating and optimizing resumes",
              applicationCategory: "BusinessApplication",
              operatingSystem: "Web Browser",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              creator: {
                "@type": "Organization",
                name: "Siraty Team",
              },
            }),
          }}
        />
      </head>

      <body
        className={`
          min-h-full 
          bg-gradient-to-br from-blue-50 via-white to-indigo-50
          text-gray-900
          antialiased
          ${fontClass}
          selection:bg-blue-200 selection:text-blue-900
        `}
        suppressHydrationWarning
      >
        <NextIntlClientProvider
          messages={messages}
          locale={locale}
          timeZone="UTC"
        >
          {/* Skip to main content link for accessibility */}
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 bg-blue-600 text-white px-4 py-2 rounded-md font-medium"
          >
            Skip to main content
          </a>

          {/* Main application container */}
          <div className="min-h-screen flex flex-col">
            {/* Main content area */}
            <main id="main-content" className="flex-1">
              {children}
            </main>

            {/* Global loading overlay - can be controlled via state management */}
            <div
              id="global-loading"
              className="hidden fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center"
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-600 font-medium">Loading...</p>
              </div>
            </div>
          </div>

          {/* Toast container for notifications */}
          <div
            id="toast-container"
            className="fixed top-4 right-4 z-50 space-y-2"
            style={{ direction: "ltr" }} // Always LTR for toasts
          ></div>
        </NextIntlClientProvider>

        {/* Development helpers - only in development */}
        {process.env.NODE_ENV === "development" && (
          <>
            {/* Locale indicator */}
            <div className="fixed bottom-4 left-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono z-40">
              {locale.toUpperCase()} | {direction.toUpperCase()}
            </div>

            {/* Screen size indicator */}
            <div className="fixed bottom-4 right-4 bg-black/80 text-white px-2 py-1 rounded text-xs font-mono z-40">
              <span className="block sm:hidden">XS</span>
              <span className="hidden sm:block md:hidden">SM</span>
              <span className="hidden md:block lg:hidden">MD</span>
              <span className="hidden lg:block xl:hidden">LG</span>
              <span className="hidden xl:block 2xl:hidden">XL</span>
              <span className="hidden 2xl:block">2XL</span>
            </div>
          </>
        )}
      </body>
    </html>
  );
}
