import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | Juno Healthcare Private Limited',
    default: 'Juno Healthcare Private Limited | Pharmaceutical Healthcare'
  },
  description: 'Professional pharmaceutical medicine marketing, verified formulations, and quality-driven healthcare distribution from Juno Healthcare Private Limited (CIN: U46497MR2026PTC474137).',
  keywords: [
    'Juno Healthcare',
    'Juno Healthcare Private Limited',
    'Pharmaceutical Marketing',
    'Medicine Marketing',
    'Pharmaceutical Formulations India',
    'cGMP Pharma Partner',
    'Tablets',
    'Capsules',
    'Sterile Injections',
    'Syrups',
    'Mumbai Pharmaceutical Company',
    'CIN U46497MR2026PTC474137'
  ],
  authors: [{ name: 'Juno Healthcare Private Limited' }],
  metadataBase: new URL('https://junohealthcare.in'),
  alternates: {
    canonical: '/'
  },
  openGraph: {
    title: 'Juno Healthcare Private Limited | Pharmaceutical Healthcare',
    description: 'Advancing healthcare through verified pharmaceutical formulations, responsible marketing, and rigorous quality standards.',
    url: 'https://junohealthcare.in',
    siteName: 'Juno Healthcare Private Limited',
    locale: 'en_IN',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Juno Healthcare Private Limited',
    description: 'Pharmaceutical marketing driven by responsibility, quality and trust.'
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${manrope.variable} scroll-smooth`}>
      <body className="font-sans antialiased flex flex-col min-h-screen selection:bg-[#16B8B3] selection:text-white bg-white text-[#102A43]">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
