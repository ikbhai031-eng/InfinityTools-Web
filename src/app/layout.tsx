
import type { Metadata, Viewport } from 'next';

declare module '*.css';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Inter, Space_Grotesk } from 'next/font/google';
import { GlobalLoader } from '@/components/layout/GlobalLoader';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#08080a',
};


export const metadata: Metadata = {
  metadataBase: new URL('https://infinitytools.com'),
  title: {
    default: 'InfinityTools - All-in-One Professional Digital Workstation',
    template: '%s | InfinityTools',
  },
  description: '150+ free browser-based tools for developers, designers, and students. PDF editors, utilities, and more with 100% local privacy and zero-latency performance.',
  keywords: ['online tools', 'pdf editor', 'image compressor', 'developer utilities', 'free software', 'productivity workstation'],
  authors: [{ name: 'InfinityTools Team' }],
  creator: 'InfinityTools',
  publisher: 'InfinityTools',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://infinitytools.com',
    siteName: 'InfinityTools',
    title: 'InfinityTools - Professional Digital Workstation',
    description: 'The elite ecosystem for PDF, Design, and Developer utilities. Built for speed. Secured by default. Always free.',
    images: [
      {
        url: 'https://infinitytools.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'InfinityTools Professional Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'InfinityTools - All-in-One Professional Tools',
    description: '150+ free high-performance browser tools with local-first privacy.',
    images: ['https://infinitytools.com/og-image.jpg'],
    creator: '@infinitytools',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "InfinityTools",
    "url": "https://infinitytools.com",
    "logo": "https://infinitytools.com/logo.png",
    "description": "Engineering the future of professional browser-based utilities with zero-trust architecture."
  };

  return (
    <html lang="en" className={`dark ${inter.variable} ${spaceGrotesk.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen overflow-x-hidden selection:bg-primary selection:text-white">
        <GlobalLoader />
        <div className="flex flex-col min-h-screen relative z-0">
          {children}
        </div>
        <Toaster />
      </body>
    </html>
  );
}