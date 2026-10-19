import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import './globals.css';

// Fonts are bundled with the project, so the opener works offline on the day.
const inter = localFont({
  src: './fonts/inter-latin-wght-normal.woff2',
  weight: '100 900',
  variable: '--f-inter',
  display: 'swap',
});
const serif = localFont({
  src: './fonts/source-serif-4-latin-wght-normal.woff2',
  weight: '200 900',
  variable: '--f-serif',
  display: 'swap',
});
const mono = localFont({
  src: './fonts/jetbrains-mono-latin-wght-normal.woff2',
  weight: '100 800',
  variable: '--f-mono',
  display: 'swap',
});
// Typewriter face, used only on the old-paper cards.
const typewriter = localFont({
  src: './fonts/special-elite-latin-400-normal.woff2',
  weight: '400',
  variable: '--f-type',
  display: 'swap',
});

// Faces for the home screen only: a tight grotesque for the name, an italic serif for the accent line.
const familjen = localFont({
  src: './fonts/familjen-grotesk-latin-wght-normal.woff2',
  weight: '400 700',
  variable: '--f-familjen',
  display: 'swap',
});
const instrument = localFont({
  src: './fonts/instrument-serif-latin-400-italic.woff2',
  weight: '400',
  style: 'italic',
  variable: '--f-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Praxis by Exponentor',
  description: 'Animated opener for the MGM Online Examination Portal demo.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${serif.variable} ${mono.variable} ${typewriter.variable} ${familjen.variable} ${instrument.variable}`}>
      <body>{children}</body>
    </html>
  );
}
