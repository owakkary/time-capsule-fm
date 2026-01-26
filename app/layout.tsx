import type { Metadata } from 'next';
import { Crimson_Pro, Source_Serif_4 } from 'next/font/google';
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
  title: 'Time Capsule FM - History Podcast Generator',
  description: 'Generate personalized history podcast episodes about any time period',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${crimsonPro.variable} ${sourceSerif.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
