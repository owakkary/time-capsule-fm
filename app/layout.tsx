import type { Metadata, Viewport } from 'next';
import { Crimson_Pro, Source_Serif_4 } from 'next/font/google';
import { CapacitorInit } from './components/CapacitorInit';
import './globals.css';

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const sourceSerif = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Time Capsule FM — A Guided Journey Through Time',
  description: 'A guided audio journey through history — curated chapters about empires, figures, and turning points across the ages.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#F5E6D3',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${sourceSerif.variable}`}>
      <body className="font-body antialiased">
        <CapacitorInit />
        {children}
      </body>
    </html>
  );
}
