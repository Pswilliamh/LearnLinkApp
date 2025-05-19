
import type { Metadata } from 'next';
import { Open_Sans } from 'next/font/google';
import './globals.css';
import { AppLayout } from '@/components/layout/app-layout';
import { Toaster } from "@/components/ui/toaster";

const openSans = Open_Sans({
  subsets: ['latin'],
  variable: '--font-open-sans',
});

export const metadata: Metadata = {
  title: 'LearnLink - English Learning for Students',
  description: 'An engaging app to help students learn English, from letters to sentences.',
  manifest: '/manifest.json',
  icons: {
    apple: "/icons/learnlink/apple-touch-icon.png", // You should create this file: public/icons/learnlink/apple-touch-icon.png (e.g. 180x180)
  },
  themeColor: '#3B5998', // Added theme color for PWA
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        {/* Standard PWA meta tags */}
        <meta name="application-name" content="LearnLink" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="LearnLink" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/learnlink/browserconfig.xml" /> {/* You might need to create this file if supporting IE/Edge pinned sites */}
        <meta name="msapplication-TileColor" content="#3B5998" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className={`${openSans.variable} font-sans antialiased`} suppressHydrationWarning={true}>
        <AppLayout>
          {children}
        </AppLayout>
        <Toaster />
      </body>
    </html>
  );
}
